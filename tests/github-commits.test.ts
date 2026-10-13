import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parseRepoSlug,
  isAllowedRepo,
  getConfiguredRepo,
  formatCommitDate,
} from '../src/lib/github/config.ts'
import {
  getLatestCommits,
  resetCommitServiceCache,
  readDurableSnapshot,
  writeDurableSnapshot,
  REFRESH_INTERVAL_MS,
  performScheduledRefresh,
  getDurableCommitsReadOnly,
  acquireRefreshLock,
  releaseRefreshLock,
  isRefreshLocked,
} from '../src/lib/github/commitService.ts'
import handler from '../api/github-commits.ts'
import { commitStore } from '../src/lib/github/commitStore.ts'
import {
  rankProjects,
  getProjectEffectiveTimestamp,
} from '../src/lib/github/ranking.ts'
import type { Project } from '../src/data/projects.ts'

test('parseRepoSlug: correctly extracts owner and repo across diverse URL formats', () => {
  // Standard GitHub URL
  assert.deepEqual(parseRepoSlug('https://github.com/ahmed-husssain/Online-Art-Gallery'), {
    owner: 'ahmed-husssain',
    repo: 'Online-Art-Gallery',
  })

  // URL with trailing slash
  assert.deepEqual(parseRepoSlug('https://github.com/ahmed-husssain/ShifaMangementSystem/'), {
    owner: 'ahmed-husssain',
    repo: 'ShifaMangementSystem',
  })

  // URL with .git extension
  assert.deepEqual(parseRepoSlug('https://github.com/ahmed-husssain/RealEstate-.git'), {
    owner: 'ahmed-husssain',
    repo: 'RealEstate-',
  })

  // Different organization casing
  assert.deepEqual(parseRepoSlug('https://github.com/AhapraxAhmed/mockrithm'), {
    owner: 'AhapraxAhmed',
    repo: 'mockrithm',
  })

  // Profile URL (no repo)
  assert.equal(parseRepoSlug('https://github.com/ahmed-husssain'), null)
  assert.equal(parseRepoSlug('https://github.com/ahmed-husssain/'), null)

  // Empty or invalid inputs
  assert.equal(parseRepoSlug(''), null)
  assert.equal(parseRepoSlug(undefined), null)
  assert.equal(parseRepoSlug('https://example.com/some/repo'), null)
})

test('isAllowedRepo: restricts repository access strictly to allowed portfolio registry', () => {
  assert.equal(isAllowedRepo('ahmed-husssain', 'Online-Art-Gallery'), true)
  assert.equal(isAllowedRepo('AHMED-HUSSSAIN', 'online-art-gallery'), true)
  assert.equal(isAllowedRepo('ahmed-husssain', 'ShifaMangementSystem'), true)
  assert.equal(isAllowedRepo('AHMED-HUSSSAIN', 'shifamangementsystem'), true)
  assert.equal(isAllowedRepo('AhapraxAhmed', 'mockrithm'), true)
  assert.equal(isAllowedRepo('ahmed-husssain', 'RealEstate-'), true)
  assert.equal(isAllowedRepo('ahmed-husssain', 'E-books'), true)

  // Disallowed arbitrary repositories (SSRF prevention)
  assert.equal(isAllowedRepo('facebook', 'react'), false)
  assert.equal(isAllowedRepo('malicious-actor', 'exploit-repo'), false)
  assert.equal(isAllowedRepo('', ''), false)
})

test('getConfiguredRepo: retrieves correct branch for allowed repository', () => {
  const match = getConfiguredRepo('ahmed-husssain', 'online-art-gallery')
  assert.ok(match)
  assert.equal(match.branch, 'main')
  assert.equal(match.owner, 'ahmed-husssain')

  const nonMatch = getConfiguredRepo('other', 'repo')
  assert.equal(nonMatch, null)
})

test('formatCommitDate: formats ISO date to UTC editorial format without timezone drift', () => {
  assert.equal(formatCommitDate('2026-10-11T07:36:14Z'), 'Oct 11, 2026')
  assert.equal(formatCommitDate('2026-10-08T00:15:00Z'), 'Oct 8, 2026')
  assert.equal(formatCommitDate('2026-03-15T23:55:00Z'), 'Mar 15, 2026')

  // Empty or invalid input
  assert.equal(formatCommitDate(''), '')
  assert.equal(formatCommitDate('invalid-date'), '')
})

/* ─────────────────────────────────────────────────────────────────────────
   1. RANKING VERIFICATION TESTS
   ───────────────────────────────────────────────────────────────────────── */

const mockProjects: Project[] = [
  {
    slug: 'project-a',
    title: 'Project Alpha',
    shortDescription: 'Alpha description',
    description: 'Alpha full',
    category: 'Full-Stack',
    technologies: ['React'],
    featured: true,
    githubUrl: 'https://github.com/ahmed-husssain/Online-Art-Gallery',
    lastCommitDate: '2026-10-01T10:00:00Z',
    lastCommitLabel: 'Oct 1, 2026',
  },
  {
    slug: 'project-b',
    title: 'Project Beta',
    shortDescription: 'Beta description',
    description: 'Beta full',
    category: 'Full-Stack',
    technologies: ['C#'],
    featured: true,
    githubUrl: 'https://github.com/ahmed-husssain/ShifaMangementSystem',
    lastCommitDate: '2026-10-05T10:00:00Z',
    lastCommitLabel: 'Oct 5, 2026',
  },
  {
    slug: 'project-c',
    title: 'Project Gamma',
    shortDescription: 'Gamma description',
    description: 'Gamma full',
    category: 'Full-Stack',
    technologies: ['PHP'],
    featured: true,
    githubUrl: 'https://github.com/ahmed-husssain/E-books',
    lastCommitDate: '2026-09-20T10:00:00Z',
    lastCommitLabel: 'Sep 20, 2026',
  },
]

test('Ranking: project with newest commit becomes #01', () => {
  // Alpha receives newest commit (Oct 11)
  const commits = {
    'ahmed-husssain/online-art-gallery': {
      isoDate: '2026-10-11T07:36:14Z',
      label: 'Oct 11, 2026',
    },
    'ahmed-husssain/shifamangementsystem': {
      isoDate: '2026-10-08T06:39:31Z',
      label: 'Oct 8, 2026',
    },
    'ahmed-husssain/e-books': {
      isoDate: '2026-09-25T12:00:00Z',
      label: 'Sep 25, 2026',
    },
  }

  const ranked = rankProjects(mockProjects, commits)
  assert.equal(ranked[0]?.slug, 'project-a') // Alpha is #01
  assert.equal(ranked[1]?.slug, 'project-b') // Beta is #02
  assert.equal(ranked[2]?.slug, 'project-c') // Gamma is #03
})

test('Ranking: previous first project moves down when another receives a newer commit', () => {
  // Initially Alpha is #01 (Oct 11) and Beta is #02 (Oct 8)
  const initialCommits = {
    'ahmed-husssain/online-art-gallery': {
      isoDate: '2026-10-11T07:36:14Z',
      label: 'Oct 11, 2026',
    },
    'ahmed-husssain/shifamangementsystem': {
      isoDate: '2026-10-08T06:39:31Z',
      label: 'Oct 8, 2026',
    },
  }
  const initialRanked = rankProjects(mockProjects, initialCommits)
  assert.equal(initialRanked[0]?.slug, 'project-a')

  // Beta receives newer commit (Oct 13)
  const updatedCommits = {
    'ahmed-husssain/online-art-gallery': {
      isoDate: '2026-10-11T07:36:14Z',
      label: 'Oct 11, 2026',
    },
    'ahmed-husssain/shifamangementsystem': {
      isoDate: '2026-10-13T14:20:00Z',
      label: 'Oct 13, 2026',
    },
  }
  const updatedRanked = rankProjects(mockProjects, updatedCommits)

  // Beta took #01, Alpha moved down to #02
  assert.equal(updatedRanked[0]?.slug, 'project-b')
  assert.equal(updatedRanked[1]?.slug, 'project-a')
})

test('Ranking: sorts using exact timestamps on the same calendar day', () => {
  const sameDayCommits = {
    'ahmed-husssain/online-art-gallery': {
      isoDate: '2026-10-11T09:00:00Z', // 9:00 AM
      label: 'Oct 11, 2026',
    },
    'ahmed-husssain/shifamangementsystem': {
      isoDate: '2026-10-11T17:30:00Z', // 5:30 PM (later on same day)
      label: 'Oct 11, 2026',
    },
  }

  const ranked = rankProjects(mockProjects, sameDayCommits)
  assert.equal(ranked[0]?.slug, 'project-b') // 5:30 PM is #01
  assert.equal(ranked[1]?.slug, 'project-a') // 9:00 AM is #02
})

test('Ranking: missing or failed repository data does not break rendering and uses fallback', () => {
  // Only Gamma has live commit; Alpha and Beta fail/missing
  const partialCommits = {
    'ahmed-husssain/e-books': {
      isoDate: '2026-10-20T10:00:00Z',
      label: 'Oct 20, 2026',
    },
  }

  const ranked = rankProjects(mockProjects, partialCommits)
  // Gamma has Oct 20 -> #01
  assert.equal(ranked[0]?.slug, 'project-c')
  // Beta falls back to static Oct 5 -> #02
  assert.equal(ranked[1]?.slug, 'project-b')
  // Alpha falls back to static Oct 1 -> #03
  assert.equal(ranked[2]?.slug, 'project-a')

  // Verify getProjectEffectiveTimestamp handles undefined gracefully
  const ts = getProjectEffectiveTimestamp(mockProjects[0]!, null)
  assert.equal(ts, new Date('2026-10-01T10:00:00Z').getTime())
})

/* ─────────────────────────────────────────────────────────────────────────
   2. DAILY REFRESH POLICY & DURABLE PERSISTENCE TESTS
   ───────────────────────────────────────────────────────────────────────── */

test('24-Hour Policy: repeated calls within 24-hour window do not cause extra GitHub requests', async () => {
  resetCommitServiceCache()

  let fetchCallCount = 0
  const mockFetch: typeof fetch = async () => {
    fetchCallCount++
    return new Response(
      JSON.stringify([
        {
          sha: 'sha-fresh',
          commit: { committer: { date: '2026-10-11T07:36:14Z' } },
        },
      ]),
      { status: 200 }
    )
  }

  const singleRepo = [{ owner: 'ahmed-husssain', repo: 'Online-Art-Gallery', branch: 'main' }]

  // 1st call: fresh fetch occurs and writes durable snapshot
  const res1 = await getLatestCommits({ repos: singleRepo, fetchFn: mockFetch })
  assert.equal(fetchCallCount, 1)
  assert.equal(res1.source, 'rest')

  // Verify durable snapshot was persisted to disk
  const snapshot = readDurableSnapshot()
  assert.ok(snapshot)
  assert.ok(snapshot.commits['ahmed-husssain/online-art-gallery'])

  // 2nd, 3rd, 4th calls immediately after (well within 24h)
  const res2 = await getLatestCommits({ repos: singleRepo, fetchFn: mockFetch })
  const res3 = await getLatestCommits({ repos: singleRepo, fetchFn: mockFetch })

  assert.equal(fetchCallCount, 1) // Zero additional GitHub requests!
  assert.equal(res2.source, 'cached')
  assert.equal(res3.source, 'cached')
})

test('24-Hour Policy: concurrent requests cannot trigger duplicate refreshes', async () => {
  resetCommitServiceCache()

  let fetchCount = 0
  const mockFetch: typeof fetch = async () => {
    fetchCount++
    await new Promise((r) => setTimeout(r, 20))
    return new Response(
      JSON.stringify([
        {
          sha: 'coalesce123',
          commit: { committer: { date: '2026-10-10T12:00:00Z' } },
        },
      ]),
      { status: 200 }
    )
  }

  const singleRepo = [{ owner: 'ahmed-husssain', repo: 'Online-Art-Gallery', branch: 'main' }]

  // Fire 5 simultaneous calls
  const [r1, _r2, _r3, _r4, r5] = await Promise.all([
    getLatestCommits({ repos: singleRepo, fetchFn: mockFetch }),
    getLatestCommits({ repos: singleRepo, fetchFn: mockFetch }),
    getLatestCommits({ repos: singleRepo, fetchFn: mockFetch }),
    getLatestCommits({ repos: singleRepo, fetchFn: mockFetch }),
    getLatestCommits({ repos: singleRepo, fetchFn: mockFetch }),
  ])

  // Exactly 1 fetch executed
  assert.equal(fetchCount, 1)
  assert.equal(r1.commits['ahmed-husssain/online-art-gallery']?.sha, 'coalesc')
  assert.equal(r5.commits['ahmed-husssain/online-art-gallery']?.sha, 'coalesc')
})

test('24-Hour Policy: an expired cache (>24h) refreshes and updates data', async () => {
  resetCommitServiceCache()

  // Pre-seed an expired durable snapshot (25 hours ago)
  const twentyFiveHoursAgo = Date.now() - (REFRESH_INTERVAL_MS + 60 * 60 * 1000)
  writeDurableSnapshot({
    commits: {
      'ahmed-husssain/online-art-gallery': {
        sha: 'oldsha',
        isoDate: '2026-10-05T10:00:00Z',
        label: 'Oct 5, 2026',
        branch: 'main',
      },
    },
    lastRefreshed: twentyFiveHoursAgo,
  })

  let fetchExecuted = false
  const mockFetch: typeof fetch = async () => {
    fetchExecuted = true
    return new Response(
      JSON.stringify([
        {
          sha: 'newsha82ca943',
          commit: { committer: { date: '2026-10-11T07:36:14Z' } },
        },
      ]),
      { status: 200 }
    )
  }

  const singleRepo = [{ owner: 'ahmed-husssain', repo: 'Online-Art-Gallery', branch: 'main' }]
  const res = await getLatestCommits({ repos: singleRepo, fetchFn: mockFetch })

  assert.equal(fetchExecuted, true) // Expired cache triggered refresh
  assert.equal(res.commits['ahmed-husssain/online-art-gallery']?.sha, 'newsha8')
  assert.equal(res.commits['ahmed-husssain/online-art-gallery']?.label, 'Oct 11, 2026')
})

test('24-Hour Policy: rate-limiting preserves last successful snapshot and prevents rapid retries', async () => {
  resetCommitServiceCache()

  // Pre-seed a valid snapshot that was rate-limited with reset 30 minutes in future
  const resetIn30Min = Date.now() + 30 * 60 * 1000
  writeDurableSnapshot({
    commits: {
      'ahmed-husssain/online-art-gallery': {
        sha: 'safe123',
        isoDate: '2026-10-11T07:36:14Z',
        label: 'Oct 11, 2026',
        branch: 'main',
      },
    },
    lastRefreshed: Date.now() - (REFRESH_INTERVAL_MS + 1000), // Expired TTL
    rateLimitReset: resetIn30Min,
  })

  let fetchAttempted = false
  const mockFetch: typeof fetch = async () => {
    fetchAttempted = true
    return new Response(null, { status: 403 })
  }

  const singleRepo = [{ owner: 'ahmed-husssain', repo: 'Online-Art-Gallery', branch: 'main' }]
  const res = await getLatestCommits({ repos: singleRepo, fetchFn: mockFetch })

  // Did NOT hammer GitHub because rate limit reset is in the future
  assert.equal(fetchAttempted, false)
  // Served last successful snapshot
  assert.equal(res.commits['ahmed-husssain/online-art-gallery']?.sha, 'safe123')
})

test('24-Hour Policy: upstream failure sets nextRetryAfter backoff preventing rapid retry storms', async () => {
  resetCommitServiceCache()

  // Seed an expired snapshot (25 hours ago)
  const twentyFiveHoursAgo = Date.now() - (REFRESH_INTERVAL_MS + 60 * 60 * 1000)
  writeDurableSnapshot({
    commits: {
      'ahmed-husssain/online-art-gallery': {
        sha: 'stale-sha',
        isoDate: '2026-10-05T10:00:00Z',
        label: 'Oct 5, 2026',
        branch: 'main',
      },
    },
    lastRefreshed: twentyFiveHoursAgo,
  })

  let fetchCallCount = 0
  const failingFetch: typeof fetch = async () => {
    fetchCallCount++
    // Simulate GitHub total upstream network outage
    throw new Error('Network error / DNS failure')
  }

  const singleRepo = [{ owner: 'ahmed-husssain', repo: 'Online-Art-Gallery', branch: 'main' }]

  // 1st call: attempts fetch, fails, sets nextRetryAfter backoff, returns stale snapshot
  const res1 = await getLatestCommits({ repos: singleRepo, fetchFn: failingFetch })
  assert.equal(fetchCallCount, 2) // Tried REST and Atom fallback, both failed
  assert.equal(res1.source, 'cached')
  assert.equal(res1.commits['ahmed-husssain/online-art-gallery']?.sha, 'stale-sha')

  // Check that durable snapshot on disk now has nextRetryAfter set in the future
  const diskSnapshot = readDurableSnapshot()
  assert.ok(diskSnapshot)
  assert.ok(diskSnapshot.nextRetryAfter && diskSnapshot.nextRetryAfter > Date.now())

  // 2nd call immediately after: should be blocked by nextRetryAfter backoff cooldown!
  fetchCallCount = 0
  const res2 = await getLatestCommits({ repos: singleRepo, fetchFn: failingFetch })
  assert.equal(fetchCallCount, 0) // ZERO fetch attempts made during backoff cooldown!
  assert.equal(res2.source, 'cached')
  assert.equal(res2.commits['ahmed-husssain/online-art-gallery']?.sha, 'stale-sha')
})


/* ─────────────────────────────────────────────────────────────────────────
   3. SECURITY & SERVERLESS API TESTS
   ───────────────────────────────────────────────────────────────────────── */

test('Security & API: returns 200 with 24-hour cache headers and blocks SSRF', async () => {
  resetCommitServiceCache()

  // Valid GET request
  const req = new Request('https://example.com/api/github-commits')
  const res = await handler(req)

  assert.equal(res.status, 200)
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400')
  assert.equal(res.headers.get('CDN-Cache-Control'), 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400')

  // Disallowed HTTP method
  const putReq = new Request('https://example.com/api/github-commits', { method: 'PUT' })
  const putRes = await handler(putReq)
  assert.equal(putRes.status, 405)

  // Unauthorized arbitrary repo query (SSRF protection)
  const forbiddenReq = new Request('https://example.com/api/github-commits?repo=evil/exploit')
  const forbiddenRes = await handler(forbiddenReq)
  assert.equal(forbiddenRes.status, 400)
})

test('commitStore: deduplicates client fetches and exposes stable getAll snapshot', async () => {
  commitStore.resetForTesting()
  let fetchCount = 0
  const originalFetch = globalThis.fetch

  globalThis.fetch = async () => {
    fetchCount++
    await new Promise((r) => setTimeout(r, 10))
    return new Response(
      JSON.stringify({
        commits: {
          'ahmed-husssain/online-art-gallery': {
            sha: 'test82ca',
            isoDate: '2026-10-11T07:36:14Z',
            label: 'Oct 11, 2026',
            branch: 'main',
          },
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    let notifiedCount = 0
    const unsubscribe = commitStore.subscribe(() => {
      notifiedCount++
    })

    // Concurrent calls from multiple components
    await Promise.all([
      commitStore.ensureLoaded(),
      commitStore.ensureLoaded(),
      commitStore.ensureLoaded(),
    ])

    assert.equal(fetchCount, 1)
    assert.ok(notifiedCount >= 1)

    const all = commitStore.getAll()
    assert.ok(all['ahmed-husssain/online-art-gallery'])
    assert.equal(all['ahmed-husssain/online-art-gallery']?.label, 'Oct 11, 2026')

    unsubscribe()
  } finally {
    globalThis.fetch = originalFetch
  }
})

/* ─────────────────────────────────────────────────────────────────────────
   4. PHASE 2.4 SCHEDULED REFRESH, LOCKING & AUTHORIZATION TESTS
   ───────────────────────────────────────────────────────────────────────── */

test('Phase 2.4: Refresh Authorization: rejects unauthorized callers and accepts valid CRON_SECRET', async () => {
  resetCommitServiceCache()
  const originalSecret = process.env.CRON_SECRET
  process.env.CRON_SECRET = 'super-secret-cron-token-123'

  try {
    // 1. Missing authorization header
    const unauthReq = new Request('https://example.com/api/github-commits?action=refresh', {
      method: 'GET',
    })
    const unauthRes = await handler(unauthReq)
    assert.equal(unauthRes.status, 401)
    const unauthBody = await unauthRes.json()
    assert.ok(unauthBody.error.includes('Unauthorized'))

    // 2. Invalid bearer token
    const wrongAuthReq = new Request('https://example.com/api/github-commits?action=refresh', {
      method: 'GET',
      headers: { Authorization: 'Bearer wrong-secret' },
    })
    const wrongRes = await handler(wrongAuthReq)
    assert.equal(wrongRes.status, 401)

    // 3. Valid bearer token via Authorization header
    const validAuthReq = new Request('https://example.com/api/github-commits?action=refresh', {
      method: 'GET',
      headers: { Authorization: 'Bearer super-secret-cron-token-123' },
    })
    const validRes = await handler(validAuthReq)
    assert.equal(validRes.status, 200)

    // 4. Valid token via custom x-cron-secret header
    const customHeaderReq = new Request('https://example.com/api/github-commits?action=refresh', {
      method: 'POST',
      headers: { 'x-cron-secret': 'super-secret-cron-token-123' },
    })
    const customRes = await handler(customHeaderReq)
    assert.equal(customRes.status, 200)
  } finally {
    process.env.CRON_SECRET = originalSecret
  }
})

test('Phase 2.4: Global Refresh Lock: prevents concurrent execution and returns 409 Conflict', async () => {
  resetCommitServiceCache()
  const originalSecret = process.env.CRON_SECRET
  process.env.CRON_SECRET = 'lock-test-secret'

  try {
    // Acquire the lock manually
    const acquired = acquireRefreshLock()
    assert.equal(acquired, true)
    assert.equal(isRefreshLocked(), true)

    // A second acquisition attempt must fail
    const secondAcquire = acquireRefreshLock()
    assert.equal(secondAcquire, false)

    // Invocations hitting the endpoint during lock return 409 Conflict
    const concurrentReq = new Request('https://example.com/api/github-commits?action=refresh', {
      method: 'GET',
      headers: { Authorization: 'Bearer lock-test-secret' },
    })
    const conflictRes = await handler(concurrentReq)
    assert.equal(conflictRes.status, 409)
    const conflictBody = await conflictRes.json()
    assert.ok(conflictBody.error.includes('Conflict'))

    // Releasing lock allows subsequent execution
    releaseRefreshLock()
    assert.equal(isRefreshLocked(), false)
  } finally {
    releaseRefreshLock()
    process.env.CRON_SECRET = originalSecret
  }
})

test('Phase 2.4: Daily Limits: scheduled refresh skips upstream fetch if refreshed within 24h', async () => {
  resetCommitServiceCache()

  // Pre-seed a fresh durable snapshot (1 hour ago)
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  writeDurableSnapshot({
    commits: {
      'ahmed-husssain/online-art-gallery': {
        sha: 'fresh82',
        isoDate: '2026-10-11T07:36:14Z',
        label: 'Oct 11, 2026',
        branch: 'main',
      },
    },
    lastRefreshed: oneHourAgo,
  })

  let fetchCallCount = 0
  const mockFetch: typeof fetch = async () => {
    fetchCallCount++
    return new Response(JSON.stringify([]), { status: 200 })
  }

  // Attempt scheduled refresh without force flag
  const result = await performScheduledRefresh({
    fetchFn: mockFetch,
    force: false,
  })

  // Zero calls to GitHub because lastRefreshed is within 24 hours
  assert.equal(fetchCallCount, 0)
  assert.equal(result.status, 'already_fresh')
  assert.equal(result.commits?.['ahmed-husssain/online-art-gallery']?.sha, 'fresh82')
})

test('Phase 2.4: Visitor Read-Only Guarantee: visitor requests never contact upstream GitHub', async () => {
  resetCommitServiceCache()

  // Pre-seed an expired durable snapshot (48 hours ago)
  const twoDaysAgo = Date.now() - (48 * 60 * 60 * 1000)
  writeDurableSnapshot({
    commits: {
      'ahmed-husssain/online-art-gallery': {
        sha: 'stale-visitor-sha',
        isoDate: '2026-10-05T10:00:00Z',
        label: 'Oct 5, 2026',
        branch: 'main',
      },
    },
    lastRefreshed: twoDaysAgo,
  })

  // Standard visitor GET request
  const visitorReq = new Request('https://example.com/api/github-commits')
  const visitorRes = await handler(visitorReq)

  assert.equal(visitorRes.status, 200)
  const visitorData = await visitorRes.json()
  assert.equal(visitorData.source, 'cached')
  assert.equal(visitorData.commits['ahmed-husssain/online-art-gallery']?.sha, 'stale-visitor-sha')

  // Calling getDurableCommitsReadOnly directly also never calls fetch
  const readOnlyResult = getDurableCommitsReadOnly()
  assert.equal(readOnlyResult.source, 'cached')
  assert.equal(readOnlyResult.commits['ahmed-husssain/online-art-gallery']?.sha, 'stale-visitor-sha')
})

test('Phase 2.4: Failed Jobs: preserves stale snapshot on upstream outage and releases lock', async () => {
  resetCommitServiceCache()

  // Seed baseline snapshot
  writeDurableSnapshot({
    commits: {
      'ahmed-husssain/online-art-gallery': {
        sha: 'existing-safe-sha',
        isoDate: '2026-10-11T07:36:14Z',
        label: 'Oct 11, 2026',
        branch: 'main',
      },
    },
    lastRefreshed: Date.now() - (30 * 60 * 60 * 1000), // 30 hours old
  })

  const failingFetch: typeof fetch = async () => {
    throw new Error('GitHub Outage / DNS Timeout')
  }

  const result = await performScheduledRefresh({
    fetchFn: failingFetch,
    force: true,
  })

  // Lock must be safely released despite upstream failure
  assert.equal(isRefreshLocked(), false)
  // Status reflects upstream failure
  assert.equal(result.status, 'upstream_failed')
  // Stale snapshot preserved
  assert.equal(result.commits?.['ahmed-husssain/online-art-gallery']?.sha, 'existing-safe-sha')
})

test('Phase 2.4: Updated Ranking: dynamically reorders projects upon successful scheduled refresh', async () => {
  resetCommitServiceCache()

  const projectsToRank: Project[] = [
    {
      slug: 'project-one',
      title: 'Project One',
      shortDescription: 'Desc 1',
      description: 'Desc 1',
      category: 'Web',
      technologies: ['React'],
      featured: true,
      githubUrl: 'https://github.com/ahmed-husssain/Online-Art-Gallery',
      lastCommitDate: '2026-10-01T10:00:00Z',
    },
    {
      slug: 'project-two',
      title: 'Project Two',
      shortDescription: 'Desc 2',
      description: 'Desc 2',
      category: 'Web',
      technologies: ['React'],
      featured: true,
      githubUrl: 'https://github.com/ahmed-husssain/ShifaMangementSystem',
      lastCommitDate: '2026-10-05T10:00:00Z',
    },
  ]

  // Initial order before refresh: Project Two (#01, Oct 5) > Project One (#02, Oct 1)
  const initialRanked = rankProjects(projectsToRank, {})
  assert.equal(initialRanked[0]?.slug, 'project-two')
  assert.equal(initialRanked[1]?.slug, 'project-one')

  // Simulate scheduled refresh returning new commit for Project One (Oct 11)
  const mockFetch: typeof fetch = async () => {
    return new Response(
      JSON.stringify([
        {
          sha: 'newest-sha',
          commit: { committer: { date: '2026-10-11T07:36:14Z' } },
        },
      ]),
      { status: 200 }
    )
  }

  const singleRepo = [{ owner: 'ahmed-husssain', repo: 'Online-Art-Gallery', branch: 'main' }]
  const refreshResult = await performScheduledRefresh({
    repos: singleRepo,
    fetchFn: mockFetch,
    force: true,
  })

  assert.equal(refreshResult.status, 'refreshed')

  // Re-rank with updated snapshot: Project One becomes #01
  const updatedRanked = rankProjects(projectsToRank, refreshResult.commits || {})
  assert.equal(updatedRanked[0]?.slug, 'project-one') // #01 (Oct 11)
  assert.equal(updatedRanked[1]?.slug, 'project-two') // #02 (Oct 5)
})

/* ─────────────────────────────────────────────────────────────────────────
   5. PHASE 2.5 AUDIT & REFRESH TIMING TESTS
   ───────────────────────────────────────────────────────────────────────── */

test('Phase 2.5: Multiple Commits: ranking evaluates only latest commit timestamp regardless of commit count', () => {
  const projects: Project[] = [
    {
      slug: 'project-high-count',
      title: 'High Activity Project',
      shortDescription: '20 commits',
      description: 'Desc',
      category: 'Web',
      technologies: ['React'],
      featured: true,
      githubUrl: 'https://github.com/ahmed-husssain/ShifaMangementSystem',
      lastCommitDate: '2026-10-08T00:00:00Z',
    },
    {
      slug: 'project-single-new-commit',
      title: 'Single Commit Project',
      shortDescription: '1 commit',
      description: 'Desc',
      category: 'Web',
      technologies: ['React'],
      featured: true,
      githubUrl: 'https://github.com/ahmed-husssain/Online-Art-Gallery',
      lastCommitDate: '2026-10-01T00:00:00Z',
    },
  ]

  // Suppose Shifa had 20 commits today, but the latest was at 10:00 AM UTC
  // Online Art Gallery had only 1 commit today, but at 11:00 AM UTC
  const snapshotAfterRefresh = {
    'ahmed-husssain/shifamangementsystem': {
      isoDate: '2026-10-13T10:00:00Z',
      label: 'Oct 13, 2026',
    },
    'ahmed-husssain/online-art-gallery': {
      isoDate: '2026-10-13T11:00:00Z', // 1 hour newer despite fewer commits
      label: 'Oct 13, 2026',
    },
  }

  const ranked = rankProjects(projects, snapshotAfterRefresh)
  // Single Commit Project wins #01 because its latest timestamp is newer
  assert.equal(ranked[0]?.slug, 'project-single-new-commit')
  assert.equal(ranked[1]?.slug, 'project-high-count')
})

test('Phase 2.5: Bundled Snapshot Fallback: cold starts read bundled snapshot when dynamic cache is empty', () => {
  resetCommitServiceCache()

  // Dynamic snapshot (.cache) is unlinked, but bundled snapshot in src/data exists
  const snapshot = readDurableSnapshot()
  assert.ok(snapshot, 'Should find bundled snapshot')
  assert.ok(snapshot.commits['ahmed-husssain/online-art-gallery'])
  assert.equal(snapshot.commits['ahmed-husssain/online-art-gallery']?.sha, '82ca943')
})

test('Phase 2.5: Serverless Environment Safety: writes to os.tmpdir when process.env.VERCEL is set', () => {
  const originalVercel = process.env.VERCEL
  process.env.VERCEL = '1'

  try {
    resetCommitServiceCache()

    // Test writing in simulated Vercel serverless environment
    writeDurableSnapshot({
      commits: {
        'ahmed-husssain/online-art-gallery': {
          sha: 'vercel-tmp',
          isoDate: '2026-10-11T07:36:14Z',
          label: 'Oct 11, 2026',
          branch: 'main',
        },
      },
      lastRefreshed: Date.now(),
    })

    const readBack = readDurableSnapshot()
    assert.ok(readBack)
    assert.equal(readBack.commits['ahmed-husssain/online-art-gallery']?.sha, 'vercel-tmp')
  } finally {
    process.env.VERCEL = originalVercel
    resetCommitServiceCache()
  }
})

test('Phase 2.5: Client Cache Timing: commitStore invalidates after 30 minutes rather than 24 hours', async () => {
  commitStore.resetForTesting()
  let fetchCallCount = 0
  const originalFetch = globalThis.fetch
  const originalWindow = (globalThis as any).window
  const originalSessionStorage = (globalThis as any).sessionStorage
  const originalLocalStorage = (globalThis as any).localStorage

  const storageMap = new Map<string, string>()
  const mockStorage = {
    getItem: (key: string) => storageMap.get(key) || null,
    setItem: (key: string, val: string) => storageMap.set(key, val),
    removeItem: (key: string) => storageMap.delete(key),
  }

  ;(globalThis as any).window = {}
  ;(globalThis as any).sessionStorage = mockStorage
  ;(globalThis as any).localStorage = mockStorage

  globalThis.fetch = async () => {
    fetchCallCount++
    return new Response(
      JSON.stringify({
        commits: {
          'ahmed-husssain/online-art-gallery': {
            sha: 'fresh-after-30m',
            isoDate: '2026-10-13T12:00:00Z',
            label: 'Oct 13, 2026',
            branch: 'main',
          },
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Seed client storage with cache that is 35 minutes old (past the 30m TTL, but within old 24h)
    const thirtyFiveMinutesAgo = Date.now() - (35 * 60 * 1000)
    mockStorage.setItem('portfolio_github_commits_v2', JSON.stringify({
      commits: {
        'ahmed-husssain/online-art-gallery': {
          sha: 'stale-client',
          isoDate: '2026-10-01T00:00:00Z',
          label: 'Oct 1, 2026',
          branch: 'main',
        },
      },
      timestamp: thirtyFiveMinutesAgo,
    }))

    // ensureLoaded should recognize 35m is expired and fetch fresh data
    await commitStore.ensureLoaded()
    assert.equal(fetchCallCount, 1)

    const updated = commitStore.getAll()
    assert.equal(updated['ahmed-husssain/online-art-gallery']?.sha, 'fresh-after-30m')
  } finally {
    globalThis.fetch = originalFetch
    ;(globalThis as any).window = originalWindow
    ;(globalThis as any).sessionStorage = originalSessionStorage
    ;(globalThis as any).localStorage = originalLocalStorage
  }
})


