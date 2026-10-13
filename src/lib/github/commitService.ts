import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import {
  ALLOWED_REPOSITORIES,
  type ConfiguredRepo,
  formatCommitDate,
} from './config.ts'

export interface CommitInfo {
  sha: string
  isoDate: string
  label: string
  branch: string
}

export interface BatchCommitsResult {
  commits: Record<string, CommitInfo>
  timestamp: number
  source: 'graphql' | 'rest' | 'cached'
}

export interface DurableSnapshot {
  commits: Record<string, CommitInfo>
  lastRefreshed: number
  etagMap?: Record<string, string>
  rateLimitReset?: number
  nextRetryAfter?: number
}

interface ETagCacheEntry {
  etag?: string
  commit: CommitInfo
  timestamp: number
}

export const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24-hour strict refresh window

// In-memory cache for warm process lifetime
const serverCache = new Map<string, ETagCacheEntry>()

// Coalescing lock to prevent duplicate concurrent outgoing requests to GitHub
let inFlightBatchPromise: Promise<{
  commits: Record<string, CommitInfo>
  rateLimitReset?: number
}> | null = null

/**
 * Resolves the path to the durable snapshot file.
 * In serverless environments (Vercel/Lambda), strictly uses os.tmpdir() since /var/task is read-only.
 * In local dev, uses project .cache directory.
 */
function getDurableSnapshotPath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), 'portfolio-github-commits-snapshot.json')
  }
  try {
    const cwd = process.cwd()
    const cacheDir = path.join(cwd, '.cache')
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }
    return path.join(cacheDir, 'github-commits-snapshot.json')
  } catch {
    return path.join(os.tmpdir(), 'portfolio-github-commits-snapshot.json')
  }
}

/**
 * Safely reads the durable snapshot from disk.
 * Prioritizes dynamic snapshot file; falls back to bundled repository snapshot if present.
 */
export function readDurableSnapshot(): DurableSnapshot | null {
  try {
    let bestSnapshot: DurableSnapshot | null = null

    // 1. Dynamic snapshot from runtime disk (e.g. /tmp or .cache)
    const filePath = getDurableSnapshotPath()
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(raw) as DurableSnapshot
      if (parsed && typeof parsed.lastRefreshed === 'number' && parsed.commits) {
        bestSnapshot = parsed
      }
    }

    // 2. Bundled repository snapshot file (committed via GitHub Action or build)
    const bundledPath = path.join(process.cwd(), 'src', 'data', 'github-commits-snapshot.json')
    if (fs.existsSync(bundledPath)) {
      const raw = fs.readFileSync(bundledPath, 'utf-8')
      const parsed = JSON.parse(raw) as DurableSnapshot
      if (parsed && typeof parsed.lastRefreshed === 'number' && parsed.commits) {
        if (!bestSnapshot || parsed.lastRefreshed > bestSnapshot.lastRefreshed) {
          bestSnapshot = parsed
        }
      }
    }

    return bestSnapshot
  } catch {
    // Disk read or JSON parse failure
  }
  return null
}

/**
 * Atomically writes the durable snapshot to disk using a temporary file and rename.
 */
export function writeDurableSnapshot(snapshot: DurableSnapshot): void {
  try {
    const filePath = getDurableSnapshotPath()
    const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`
    fs.writeFileSync(tempPath, JSON.stringify(snapshot, null, 2), 'utf-8')
    fs.renameSync(tempPath, filePath)
  } catch {
    // Write failure (read-only filesystem or concurrency)
  }
}

/**
 * Lock management for scheduled refresh jobs.
 * Enforces a single global refresh runner at any given time.
 */
let isRefreshJobLocked = false
const LOCK_TIMEOUT_MS = 60 * 1000 // 60 seconds TTL for orphaned locks

function getLockFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), 'portfolio-refresh.lock')
  }
  try {
    const cwd = process.cwd()
    const cacheDir = path.join(cwd, '.cache')
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }
    return path.join(cacheDir, 'refresh.lock')
  } catch {
    return path.join(os.tmpdir(), 'portfolio-refresh.lock')
  }
}

export function isRefreshLocked(): boolean {
  if (isRefreshJobLocked) return true
  try {
    const lockPath = getLockFilePath()
    if (!fs.existsSync(lockPath)) return false
    const content = fs.readFileSync(lockPath, 'utf-8')
    const lockTime = parseInt(content, 10)
    if (isNaN(lockTime)) return false
    if (Date.now() - lockTime < LOCK_TIMEOUT_MS) {
      return true
    }
    // Lock expired, remove stale lock
    fs.unlinkSync(lockPath)
    return false
  } catch {
    return false
  }
}

export function acquireRefreshLock(): boolean {
  if (isRefreshLocked()) return false
  isRefreshJobLocked = true
  try {
    const lockPath = getLockFilePath()
    fs.writeFileSync(lockPath, Date.now().toString(), 'utf-8')
    return true
  } catch {
    return true
  }
}

export function releaseRefreshLock(): void {
  isRefreshJobLocked = false
  try {
    const lockPath = getLockFilePath()
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath)
    }
  } catch {
    // ignore
  }
}

/**
 * Resets internal memory cache, durable disk cache, lock, and in-flight promises. Used in tests.
 */
export function resetCommitServiceCache() {
  serverCache.clear()
  inFlightBatchPromise = null
  releaseRefreshLock()
  try {
    const filePath = getDurableSnapshotPath()
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch {
    // ignore
  }
}

/**
 * Executes a single GraphQL batch query to fetch the latest commit for all configured repositories.
 * Requires a GitHub token (GraphQL API requires authentication).
 * Consumes exactly 1 GitHub API rate-limit point for the entire batch.
 */
async function fetchViaGraphQL(
  repos: readonly ConfiguredRepo[],
  token: string,
  fetchFn: typeof fetch = fetch
): Promise<Record<string, CommitInfo> | null> {
  const queryFragments = repos.map((r, i) => {
    return `
      repo${i}: repository(owner: ${JSON.stringify(r.owner)}, name: ${JSON.stringify(r.repo)}) {
        ref(qualifiedName: "refs/heads/${r.branch}") {
          target {
            ... on Commit {
              oid
              committedDate
            }
          }
        }
        defaultBranchRef {
          target {
            ... on Commit {
              oid
              committedDate
            }
          }
        }
      }
    `
  })

  const query = `query GetLatestCommits {\n${queryFragments.join('\n')}\n}`

  try {
    const res = await fetchFn('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Commit-Service',
      },
      body: JSON.stringify({ query }),
    })

    if (!res.ok) return null

    const json = (await res.json()) as {
      data?: Record<string, {
        ref?: { target?: { oid?: string; committedDate?: string } } | null
        defaultBranchRef?: { target?: { oid?: string; committedDate?: string } } | null
      } | null>
      errors?: unknown[]
    }

    if (!json.data) return null

    const result: Record<string, CommitInfo> = {}

    repos.forEach((repo, i) => {
      const repoData = json.data?.[`repo${i}`]
      if (!repoData) return

      const target = repoData.ref?.target || repoData.defaultBranchRef?.target
      if (!target?.committedDate || !target?.oid) return

      const label = formatCommitDate(target.committedDate)
      const key = `${repo.owner.toLowerCase()}/${repo.repo.toLowerCase()}`

      const commit: CommitInfo = {
        sha: target.oid.slice(0, 7),
        isoDate: target.committedDate,
        label,
        branch: repo.branch,
      }

      result[key] = commit
      serverCache.set(key, { commit, timestamp: Date.now() })
    })

    return result
  } catch {
    return null
  }
}

/**
 * Fetches latest commit via GitHub public Atom feed.
 * Public Atom feeds have independent rate limits and Fastly CDN caching,
 * providing bulletproof resilience when GitHub REST API rate limits are exceeded.
 */
async function fetchSingleRepoAtom(
  repo: ConfiguredRepo,
  fetchFn: typeof fetch = fetch
): Promise<CommitInfo | null> {
  const key = `${repo.owner.toLowerCase()}/${repo.repo.toLowerCase()}`
  const cached = serverCache.get(key)

  try {
    const url = `https://github.com/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/commits/${encodeURIComponent(repo.branch)}.atom`
    const headers: Record<string, string> = {
      'User-Agent': 'Portfolio-Commit-Service',
    }

    if (cached?.etag) {
      headers['If-None-Match'] = cached.etag
    }

    const res = await fetchFn(url, { headers })

    if (res.status === 304 && cached?.commit) {
      serverCache.set(key, { ...cached, timestamp: Date.now() })
      return cached.commit
    }

    if (!res.ok) {
      return cached?.commit || null
    }

    const xml = await res.text()
    const updatedMatch = xml.match(/<updated>([^<]+)<\/updated>/)
    const commitMatch = xml.match(/Commit\/([a-f0-9]+)/i)

    if (!updatedMatch || !commitMatch) {
      return cached?.commit || null
    }

    const dateStr = updatedMatch[1].trim()
    const sha = commitMatch[1].trim().slice(0, 7)
    const label = formatCommitDate(dateStr)
    const newEtag = res.headers.get('ETag') || undefined

    const commit: CommitInfo = {
      sha,
      isoDate: dateStr,
      label,
      branch: repo.branch,
    }

    serverCache.set(key, {
      etag: newEtag,
      commit,
      timestamp: Date.now(),
    })

    return commit
  } catch {
    return cached?.commit || null
  }
}

/**
 * Fetches the latest commit for a single repository via GitHub REST API with conditional ETag.
 * Automatically falls back to public Atom feed on rate limit (403).
 */
async function fetchSingleRepoREST(
  repo: ConfiguredRepo,
  token?: string,
  fetchFn: typeof fetch = fetch,
  initialEtagMap?: Record<string, string>
): Promise<{ commit: CommitInfo; rateLimitReset?: number } | null> {
  const key = `${repo.owner.toLowerCase()}/${repo.repo.toLowerCase()}`
  const cached = serverCache.get(key)
  const existingEtag = cached?.etag || initialEtagMap?.[key]

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Commit-Service',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (existingEtag) {
    headers['If-None-Match'] = existingEtag
  }

  try {
    const url = `https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/commits?sha=${encodeURIComponent(repo.branch)}&per_page=1`
    const res = await fetchFn(url, { headers })

    // Extract rate-limit reset header if present
    const resetHeader = res.headers.get('x-ratelimit-reset')
    const rateLimitReset = resetHeader ? parseInt(resetHeader, 10) * 1000 : undefined

    // 304 Not Modified: Reuse existing cached commit without consuming quota
    if (res.status === 304 && cached?.commit) {
      serverCache.set(key, { ...cached, timestamp: Date.now() })
      return { commit: cached.commit, rateLimitReset }
    }

    if (!res.ok) {
      // If REST API fails or is rate limited (403), fallback seamlessly to public Atom feed
      const atomCommit = await fetchSingleRepoAtom(repo, fetchFn)
      if (atomCommit) {
        return { commit: atomCommit, rateLimitReset }
      }
      return cached?.commit ? { commit: cached.commit, rateLimitReset } : null
    }

    const data = (await res.json()) as Array<{
      sha?: string
      commit?: {
        committer?: { date?: string }
        author?: { date?: string }
      }
    }>

    if (!Array.isArray(data) || data.length === 0 || !data[0]?.commit) {
      const atomCommit = await fetchSingleRepoAtom(repo, fetchFn)
      if (atomCommit) return { commit: atomCommit, rateLimitReset }
      return cached?.commit ? { commit: cached.commit, rateLimitReset } : null
    }

    const first = data[0]
    const dateStr = first.commit?.committer?.date || first.commit?.author?.date
    if (!dateStr) {
      return cached?.commit ? { commit: cached.commit, rateLimitReset } : null
    }

    const sha = (first.sha || '').slice(0, 7)
    const label = formatCommitDate(dateStr)
    const newEtag = res.headers.get('ETag') || undefined

    const commit: CommitInfo = {
      sha,
      isoDate: dateStr,
      label,
      branch: repo.branch,
    }

    serverCache.set(key, {
      etag: newEtag,
      commit,
      timestamp: Date.now(),
    })

    return { commit, rateLimitReset }
  } catch {
    // Network failure: try Atom feed, then cached commit
    const atomCommit = await fetchSingleRepoAtom(repo, fetchFn)
    if (atomCommit) return { commit: atomCommit }
    return cached?.commit ? { commit: cached.commit } : null
  }
}

/**
 * Fetches commits for all configured repositories adhering strictly to the Daily Refresh Policy:
 * 1. Checks durable shared snapshot on disk (served for 24 hours without hitting GitHub).
 * 2. In-flight coalescing prevents concurrent duplicate requests.
 * 3. Priority 1: GraphQL batching if GITHUB_TOKEN is present (1 rate-limit point).
 * 4. Priority 2: REST fallback with ETag conditional requests (304 Not Modified).
 * 5. Priority 3: Public Atom feed fallback on rate limiting (403).
 * 6. Stale-on-error resiliency: preserves existing valid snapshot on upstream outages.
 */
export async function getLatestCommits(
  options: {
    token?: string
    repos?: readonly ConfiguredRepo[]
    fetchFn?: typeof fetch
    forceRefresh?: boolean
  } = {}
): Promise<BatchCommitsResult> {
  const token = options.token || process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  const repos = options.repos || ALLOWED_REPOSITORIES
  const fetchFn = options.fetchFn || fetch

  // 1. Check durable snapshot from disk
  const existingSnapshot = readDurableSnapshot()
  const isFresh =
    !options.forceRefresh &&
    existingSnapshot &&
    Date.now() - existingSnapshot.lastRefreshed < REFRESH_INTERVAL_MS &&
    Object.keys(existingSnapshot.commits).length > 0

  if (isFresh && existingSnapshot) {
    // Within 24-hour window: serve durable snapshot without calling GitHub!
    return {
      commits: existingSnapshot.commits,
      timestamp: existingSnapshot.lastRefreshed,
      source: 'cached',
    }
  }

  // 2. Prevent rapid retry if upstream is known to be rate-limited or in backoff cooldown
  if (
    !options.forceRefresh &&
    ((existingSnapshot?.rateLimitReset && existingSnapshot.rateLimitReset > Date.now()) ||
      (existingSnapshot?.nextRetryAfter && existingSnapshot.nextRetryAfter > Date.now())) &&
    existingSnapshot?.commits &&
    Object.keys(existingSnapshot.commits).length > 0
  ) {
    return {
      commits: existingSnapshot.commits,
      timestamp: existingSnapshot.lastRefreshed,
      source: 'cached',
    }
  }

  // 3. Coalesce in-flight requests (atomic in-process lock to prevent duplicate concurrent outgoing calls)
  if (inFlightBatchPromise) {
    const { commits } = await inFlightBatchPromise
    return {
      commits,
      timestamp: Date.now(),
      source: 'cached',
    }
  }

  inFlightBatchPromise = (async () => {
    let globalReset: number | undefined
    let freshSuccess = false

    // Attempt GraphQL batching when authenticated
    if (token) {
      const graphqlResult = await fetchViaGraphQL(repos, token, fetchFn)
      if (graphqlResult && Object.keys(graphqlResult).length > 0) {
        return { commits: graphqlResult, rateLimitReset: undefined, freshSuccess: true }
      }
    }

    // Fallback: Parallel REST requests with ETag conditional requests and Atom fallback
    const results: Record<string, CommitInfo> = {
      ...(existingSnapshot?.commits || {}),
    }

    const restPromises = repos.map(async (repo) => {
      const result = await fetchSingleRepoREST(repo, token, fetchFn, existingSnapshot?.etagMap)
      if (result) {
        const key = `${repo.owner.toLowerCase()}/${repo.repo.toLowerCase()}`
        results[key] = result.commit
        if (result.rateLimitReset) globalReset = result.rateLimitReset
        freshSuccess = true
      }
    })

    await Promise.allSettled(restPromises)
    return { commits: results, rateLimitReset: globalReset, freshSuccess }
  })()

  try {
    const { commits, rateLimitReset, freshSuccess } = await (inFlightBatchPromise as any)

    // If we obtained valid commits from a fresh fetch, persist atomically to durable storage
    if (freshSuccess && Object.keys(commits).length > 0) {
      const etagMap: Record<string, string> = {}
      serverCache.forEach((entry, key) => {
        if (entry.etag) etagMap[key] = entry.etag
      })

      writeDurableSnapshot({
        commits,
        lastRefreshed: Date.now(),
        etagMap,
        rateLimitReset,
      })

      return {
        commits,
        timestamp: Date.now(),
        source: token ? 'graphql' : 'rest',
      }
    }

    // Upstream failure or empty response: apply backoff and serve stale snapshot
    if (existingSnapshot && Object.keys(existingSnapshot.commits).length > 0) {
      // Set a 5-minute cooldown to prevent consecutive incoming requests from hammering a failing upstream
      writeDurableSnapshot({
        ...existingSnapshot,
        nextRetryAfter: Date.now() + 5 * 60 * 1000,
      })

      return {
        commits: existingSnapshot.commits,
        timestamp: existingSnapshot.lastRefreshed,
        source: 'cached',
      }
    }

    return {
      commits: {},
      timestamp: Date.now(),
      source: 'rest',
    }
  } finally {
    inFlightBatchPromise = null
  }
}

/**
 * Baseline commits seeded from project metadata.
 * Ensures cold boots without a pre-existing snapshot still return valid commit metadata
 * to visitors in 0ms without contacting GitHub.
 */
export const BASELINE_COMMITS: Record<string, CommitInfo> = {
  'ahmed-husssain/online-art-gallery': {
    sha: '82ca943',
    isoDate: '2026-10-11T07:36:14Z',
    label: 'Oct 11, 2026',
    branch: 'main',
  },
  'ahmed-husssain/shifamangementsystem': {
    sha: '9903ca7',
    isoDate: '2026-10-08T06:39:31Z',
    label: 'Oct 8, 2026',
    branch: 'main',
  },
  'ahapraxahmed/mockrithm': {
    sha: '3c85da1',
    isoDate: '2025-06-20T14:30:00Z',
    label: 'Jun 20, 2025',
    branch: 'main',
  },
  'ahmed-husssain/realestate-': {
    sha: '1b8e4f2',
    isoDate: '2025-02-20T00:00:00Z',
    label: 'Feb 20, 2025',
    branch: 'main',
  },
  'ahmed-husssain/e-books': {
    sha: '0f4a2b9',
    isoDate: '2025-01-10T00:00:00Z',
    label: 'Jan 10, 2025',
    branch: 'main',
  },
}

/**
 * Strict read-only accessor for normal visitors.
 * Under NO circumstances does this function contact GitHub.
 * Returns the latest valid durable snapshot, or seeds the baseline if cold.
 */
export function getDurableCommitsReadOnly(): BatchCommitsResult {
  const existing = readDurableSnapshot()
  if (existing && Object.keys(existing.commits).length > 0) {
    return {
      commits: existing.commits,
      timestamp: existing.lastRefreshed,
      source: 'cached',
    }
  }

  // Cold start baseline seed
  writeDurableSnapshot({
    commits: BASELINE_COMMITS,
    lastRefreshed: Date.now(),
  })

  return {
    commits: BASELINE_COMMITS,
    timestamp: Date.now(),
    source: 'cached',
  }
}

export interface ScheduledRefreshResult {
  status: 'refreshed' | 'already_fresh' | 'locked' | 'upstream_failed'
  message?: string
  commits?: Record<string, CommitInfo>
  timestamp?: number
  error?: string
}

/**
 * Initiates an authorized scheduled refresh.
 * 1. Verifies that no other refresh job is locked.
 * 2. Enforces the strict daily 24-hour limit unless forced.
 * 3. Acquires global atomic lock.
 * 4. Calls GitHub via GraphQL (or parallel REST with conditional ETags + Atom fallback).
 * 5. Atomically writes the updated snapshot to durable disk.
 * 6. Releases the lock.
 */
export async function performScheduledRefresh(options: {
  token?: string
  fetchFn?: typeof fetch
  force?: boolean
  repos?: readonly ConfiguredRepo[]
} = {}): Promise<ScheduledRefreshResult> {
  // 1. Enforce atomic lock
  if (isRefreshLocked()) {
    return {
      status: 'locked',
      message: 'A refresh job is already currently running',
    }
  }

  const existingSnapshot = readDurableSnapshot()

  // 2. Daily limit check: if refreshed within last 24 hours, skip upstream fetch!
  if (
    !options.force &&
    existingSnapshot &&
    Date.now() - existingSnapshot.lastRefreshed < REFRESH_INTERVAL_MS &&
    Object.keys(existingSnapshot.commits).length > 0
  ) {
    return {
      status: 'already_fresh',
      message: 'Commits were already refreshed within the last 24 hours',
      commits: existingSnapshot.commits,
      timestamp: existingSnapshot.lastRefreshed,
    }
  }

  // 3. Acquire atomic lock
  const acquired = acquireRefreshLock()
  if (!acquired) {
    return {
      status: 'locked',
      message: 'Failed to acquire refresh lock',
    }
  }

  try {
    const result = await getLatestCommits({
      token: options.token,
      fetchFn: options.fetchFn,
      repos: options.repos,
      forceRefresh: true,
    })

    if (Object.keys(result.commits).length > 0 && result.source !== 'cached') {
      return {
        status: 'refreshed',
        commits: result.commits,
        timestamp: result.timestamp,
      }
    }

    return {
      status: 'upstream_failed',
      message: 'Upstream refresh returned stale or empty snapshot',
      commits: result.commits,
      timestamp: result.timestamp,
    }
  } catch (err) {
    return {
      status: 'upstream_failed',
      error: err instanceof Error ? err.message : String(err),
      commits: existingSnapshot?.commits || BASELINE_COMMITS,
      timestamp: existingSnapshot?.lastRefreshed || Date.now(),
    }
  } finally {
    releaseRefreshLock()
  }
}

/**
 * Verifies that an incoming request is authorized to trigger a scheduled refresh.
 * Accepts standard Bearer token or x-cron-secret header.
 */
export function verifyCronAuthorization(
  authHeader?: string | null,
  customHeader?: string | null,
  secret = process.env.CRON_SECRET
): boolean {
  if (!secret) {
    // If CRON_SECRET is not configured:
    // In production, reject unauthorized calls to prevent public abuse.
    // In local dev / tests, allow for convenience.
    return process.env.NODE_ENV === 'test' || process.env.NODE_ENV !== 'production'
  }
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
  const provided = bearerToken || customHeader?.trim()
  return Boolean(provided && provided === secret)
}

