// src/lib/github/config.ts
var ALLOWED_REPOSITORIES = [
  { owner: "ahmed-husssain", repo: "Online-Art-Gallery", branch: "main" },
  { owner: "ahmed-husssain", repo: "ShifaMangementSystem", branch: "main" },
  { owner: "AhapraxAhmed", repo: "mockrithm", branch: "main" },
  { owner: "ahmed-husssain", repo: "RealEstate-", branch: "main" },
  { owner: "ahmed-husssain", repo: "E-books", branch: "main" }
];
function parseRepoSlug(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const cleaned = url.trim().replace(/\/+$/, "");
    const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/i);
    if (!match) return null;
    const owner = match[1].trim();
    const repo = match[2].trim().replace(/\.git$/i, "");
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}
function isAllowedRepo(owner, repo) {
  if (!owner || !repo) return false;
  const normOwner = owner.toLowerCase().trim();
  const normRepo = repo.toLowerCase().trim();
  return ALLOWED_REPOSITORIES.some(
    (configured) => configured.owner.toLowerCase() === normOwner && configured.repo.toLowerCase() === normRepo
  );
}
function formatCommitDate(isoDate) {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "";
    const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();
    return `${month} ${day}, ${year}`;
  } catch {
    return "";
  }
}

// src/lib/github/commitService.ts
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
var REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1e3;
var serverCache = /* @__PURE__ */ new Map();
var inFlightBatchPromise = null;
function getDurableSnapshotPath() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "portfolio-github-commits-snapshot.json");
  }
  try {
    const cwd = process.cwd();
    const cacheDir = path.join(cwd, ".cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    return path.join(cacheDir, "github-commits-snapshot.json");
  } catch {
    return path.join(os.tmpdir(), "portfolio-github-commits-snapshot.json");
  }
}
function readDynamicSnapshot() {
  try {
    const filePath = getDurableSnapshotPath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.lastRefreshed === "number" && parsed.commits) {
        return parsed;
      }
    }
  } catch {
  }
  return null;
}
function readDurableSnapshot() {
  const dynamic = readDynamicSnapshot();
  if (dynamic) {
    return dynamic;
  }
  try {
    const bundledPath = path.join(process.cwd(), "src", "data", "github-commits-snapshot.json");
    if (fs.existsSync(bundledPath)) {
      const raw = fs.readFileSync(bundledPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.lastRefreshed === "number" && parsed.commits) {
        return parsed;
      }
    }
  } catch {
  }
  return null;
}
function writeDurableSnapshot(snapshot) {
  try {
    const filePath = getDurableSnapshotPath();
    const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(snapshot, null, 2), "utf-8");
    fs.renameSync(tempPath, filePath);
  } catch {
  }
}
var isRefreshJobLocked = false;
var LOCK_TIMEOUT_MS = 60 * 1e3;
function getLockFilePath() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "portfolio-refresh.lock");
  }
  try {
    const cwd = process.cwd();
    const cacheDir = path.join(cwd, ".cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    return path.join(cacheDir, "refresh.lock");
  } catch {
    return path.join(os.tmpdir(), "portfolio-refresh.lock");
  }
}
function isRefreshLocked() {
  if (isRefreshJobLocked) return true;
  try {
    const lockPath = getLockFilePath();
    if (!fs.existsSync(lockPath)) return false;
    const content = fs.readFileSync(lockPath, "utf-8");
    const lockTime = parseInt(content, 10);
    if (isNaN(lockTime)) return false;
    if (Date.now() - lockTime < LOCK_TIMEOUT_MS) {
      return true;
    }
    fs.unlinkSync(lockPath);
    return false;
  } catch {
    return false;
  }
}
function acquireRefreshLock() {
  if (isRefreshLocked()) return false;
  isRefreshJobLocked = true;
  try {
    const lockPath = getLockFilePath();
    fs.writeFileSync(lockPath, Date.now().toString(), "utf-8");
    return true;
  } catch {
    return true;
  }
}
function releaseRefreshLock() {
  isRefreshJobLocked = false;
  try {
    const lockPath = getLockFilePath();
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
    }
  } catch {
  }
}
async function fetchViaGraphQL(repos, token, fetchFn = fetch) {
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
    `;
  });
  const query = `query GetLatestCommits {
${queryFragments.join("\n")}
}`;
  try {
    const res = await fetchFn("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Portfolio-Commit-Service"
      },
      body: JSON.stringify({ query })
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data) return null;
    const result = {};
    repos.forEach((repo, i) => {
      const repoData = json.data?.[`repo${i}`];
      if (!repoData) return;
      const target = repoData.ref?.target || repoData.defaultBranchRef?.target;
      if (!target?.committedDate || !target?.oid) return;
      const label = formatCommitDate(target.committedDate);
      const key = `${repo.owner.toLowerCase()}/${repo.repo.toLowerCase()}`;
      const commit = {
        sha: target.oid.slice(0, 7),
        isoDate: target.committedDate,
        label,
        branch: repo.branch
      };
      result[key] = commit;
      serverCache.set(key, { commit, timestamp: Date.now() });
    });
    return result;
  } catch {
    return null;
  }
}
async function fetchSingleRepoAtom(repo, fetchFn = fetch) {
  const key = `${repo.owner.toLowerCase()}/${repo.repo.toLowerCase()}`;
  const cached = serverCache.get(key);
  try {
    const url = `https://github.com/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/commits/${encodeURIComponent(repo.branch)}.atom`;
    const headers = {
      "User-Agent": "Portfolio-Commit-Service"
    };
    if (cached?.etag) {
      headers["If-None-Match"] = cached.etag;
    }
    const res = await fetchFn(url, { headers });
    if (res.status === 304 && cached?.commit) {
      serverCache.set(key, { ...cached, timestamp: Date.now() });
      return cached.commit;
    }
    if (!res.ok) {
      return cached?.commit || null;
    }
    const xml = await res.text();
    const updatedMatch = xml.match(/<updated>([^<]+)<\/updated>/);
    const commitMatch = xml.match(/Commit\/([a-f0-9]+)/i);
    if (!updatedMatch || !commitMatch) {
      return cached?.commit || null;
    }
    const dateStr = updatedMatch[1].trim();
    const sha = commitMatch[1].trim().slice(0, 7);
    const label = formatCommitDate(dateStr);
    const newEtag = res.headers.get("ETag") || void 0;
    const commit = {
      sha,
      isoDate: dateStr,
      label,
      branch: repo.branch
    };
    serverCache.set(key, {
      etag: newEtag,
      commit,
      timestamp: Date.now()
    });
    return commit;
  } catch {
    return cached?.commit || null;
  }
}
async function fetchSingleRepoREST(repo, token, fetchFn = fetch, initialEtagMap) {
  const key = `${repo.owner.toLowerCase()}/${repo.repo.toLowerCase()}`;
  const cached = serverCache.get(key);
  const existingEtag = cached?.etag || initialEtagMap?.[key];
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Portfolio-Commit-Service"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (existingEtag) {
    headers["If-None-Match"] = existingEtag;
  }
  try {
    const url = `https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/commits?sha=${encodeURIComponent(repo.branch)}&per_page=1`;
    const res = await fetchFn(url, { headers });
    const resetHeader = res.headers.get("x-ratelimit-reset");
    const rateLimitReset = resetHeader ? parseInt(resetHeader, 10) * 1e3 : void 0;
    if (res.status === 304 && cached?.commit) {
      serverCache.set(key, { ...cached, timestamp: Date.now() });
      return { commit: cached.commit, rateLimitReset };
    }
    if (!res.ok) {
      const atomCommit = await fetchSingleRepoAtom(repo, fetchFn);
      if (atomCommit) {
        return { commit: atomCommit, rateLimitReset };
      }
      return cached?.commit ? { commit: cached.commit, rateLimitReset } : null;
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0 || !data[0]?.commit) {
      const atomCommit = await fetchSingleRepoAtom(repo, fetchFn);
      if (atomCommit) return { commit: atomCommit, rateLimitReset };
      return cached?.commit ? { commit: cached.commit, rateLimitReset } : null;
    }
    const first = data[0];
    const dateStr = first.commit?.committer?.date || first.commit?.author?.date;
    if (!dateStr) {
      return cached?.commit ? { commit: cached.commit, rateLimitReset } : null;
    }
    const sha = (first.sha || "").slice(0, 7);
    const label = formatCommitDate(dateStr);
    const newEtag = res.headers.get("ETag") || void 0;
    const commit = {
      sha,
      isoDate: dateStr,
      label,
      branch: repo.branch
    };
    serverCache.set(key, {
      etag: newEtag,
      commit,
      timestamp: Date.now()
    });
    return { commit, rateLimitReset };
  } catch {
    const atomCommit = await fetchSingleRepoAtom(repo, fetchFn);
    if (atomCommit) return { commit: atomCommit };
    return cached?.commit ? { commit: cached.commit } : null;
  }
}
async function getLatestCommits(options = {}) {
  const token = options.token || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repos = options.repos || ALLOWED_REPOSITORIES;
  const fetchFn = options.fetchFn || fetch;
  const dynamicSnapshot = readDynamicSnapshot();
  const isFresh = !options.forceRefresh && dynamicSnapshot && Date.now() - dynamicSnapshot.lastRefreshed < REFRESH_INTERVAL_MS && Object.keys(dynamicSnapshot.commits).length > 0;
  if (isFresh && dynamicSnapshot) {
    return {
      commits: dynamicSnapshot.commits,
      timestamp: dynamicSnapshot.lastRefreshed,
      source: "cached"
    };
  }
  const existingSnapshot = dynamicSnapshot || readDurableSnapshot();
  if (!options.forceRefresh && (existingSnapshot?.rateLimitReset && existingSnapshot.rateLimitReset > Date.now() || existingSnapshot?.nextRetryAfter && existingSnapshot.nextRetryAfter > Date.now()) && existingSnapshot?.commits && Object.keys(existingSnapshot.commits).length > 0) {
    return {
      commits: existingSnapshot.commits,
      timestamp: existingSnapshot.lastRefreshed,
      source: "cached"
    };
  }
  if (inFlightBatchPromise) {
    const { commits } = await inFlightBatchPromise;
    return {
      commits,
      timestamp: Date.now(),
      source: "cached"
    };
  }
  inFlightBatchPromise = (async () => {
    let globalReset;
    let freshSuccess = false;
    if (token) {
      const graphqlResult = await fetchViaGraphQL(repos, token, fetchFn);
      if (graphqlResult && Object.keys(graphqlResult).length > 0) {
        return { commits: graphqlResult, rateLimitReset: void 0, freshSuccess: true };
      }
    }
    const results = {
      ...existingSnapshot?.commits || {}
    };
    const restPromises = repos.map(async (repo) => {
      const result = await fetchSingleRepoREST(repo, token, fetchFn, existingSnapshot?.etagMap);
      if (result) {
        const key = `${repo.owner.toLowerCase()}/${repo.repo.toLowerCase()}`;
        results[key] = result.commit;
        if (result.rateLimitReset) globalReset = result.rateLimitReset;
        freshSuccess = true;
      }
    });
    await Promise.allSettled(restPromises);
    return { commits: results, rateLimitReset: globalReset, freshSuccess };
  })();
  try {
    const { commits, rateLimitReset, freshSuccess } = await inFlightBatchPromise;
    if (freshSuccess && Object.keys(commits).length > 0) {
      const etagMap = {};
      serverCache.forEach((entry, key) => {
        if (entry.etag) etagMap[key] = entry.etag;
      });
      writeDurableSnapshot({
        commits,
        lastRefreshed: Date.now(),
        etagMap,
        rateLimitReset
      });
      return {
        commits,
        timestamp: Date.now(),
        source: token ? "graphql" : "rest"
      };
    }
    if (existingSnapshot && Object.keys(existingSnapshot.commits).length > 0) {
      writeDurableSnapshot({
        ...existingSnapshot,
        nextRetryAfter: Date.now() + 5 * 60 * 1e3
      });
      return {
        commits: existingSnapshot.commits,
        timestamp: existingSnapshot.lastRefreshed,
        source: "cached"
      };
    }
    return {
      commits: {},
      timestamp: Date.now(),
      source: "rest"
    };
  } finally {
    inFlightBatchPromise = null;
  }
}
var BASELINE_COMMITS = {
  "ahmed-husssain/online-art-gallery": {
    sha: "82ca943",
    isoDate: "2026-10-11T07:36:14Z",
    label: "Oct 11, 2026",
    branch: "main"
  },
  "ahmed-husssain/shifamangementsystem": {
    sha: "9903ca7",
    isoDate: "2026-10-08T06:39:31Z",
    label: "Oct 8, 2026",
    branch: "main"
  },
  "ahapraxahmed/mockrithm": {
    sha: "3c85da1",
    isoDate: "2025-06-20T14:30:00Z",
    label: "Jun 20, 2025",
    branch: "main"
  },
  "ahmed-husssain/realestate-": {
    sha: "1b8e4f2",
    isoDate: "2025-02-20T00:00:00Z",
    label: "Feb 20, 2025",
    branch: "main"
  },
  "ahmed-husssain/e-books": {
    sha: "0f4a2b9",
    isoDate: "2025-01-10T00:00:00Z",
    label: "Jan 10, 2025",
    branch: "main"
  }
};
function getDurableCommitsReadOnly() {
  const existing = readDurableSnapshot();
  if (existing && Object.keys(existing.commits).length > 0) {
    return {
      commits: existing.commits,
      timestamp: existing.lastRefreshed,
      source: "cached"
    };
  }
  writeDurableSnapshot({
    commits: BASELINE_COMMITS,
    lastRefreshed: Date.now()
  });
  return {
    commits: BASELINE_COMMITS,
    timestamp: Date.now(),
    source: "cached"
  };
}
async function performScheduledRefresh(options = {}) {
  if (isRefreshLocked()) {
    return {
      status: "locked",
      message: "A refresh job is already currently running"
    };
  }
  const dynamicSnapshot = readDynamicSnapshot();
  if (!options.force && dynamicSnapshot && Date.now() - dynamicSnapshot.lastRefreshed < REFRESH_INTERVAL_MS && Object.keys(dynamicSnapshot.commits).length > 0) {
    return {
      status: "already_fresh",
      message: "Commits were already refreshed within the last 24 hours",
      commits: dynamicSnapshot.commits,
      timestamp: dynamicSnapshot.lastRefreshed
    };
  }
  const existingSnapshot = dynamicSnapshot || readDurableSnapshot();
  const acquired = acquireRefreshLock();
  if (!acquired) {
    return {
      status: "locked",
      message: "Failed to acquire refresh lock"
    };
  }
  try {
    const result = await getLatestCommits({
      token: options.token,
      fetchFn: options.fetchFn,
      repos: options.repos,
      forceRefresh: true
    });
    if (Object.keys(result.commits).length > 0 && result.source !== "cached") {
      return {
        status: "refreshed",
        commits: result.commits,
        timestamp: result.timestamp
      };
    }
    return {
      status: "upstream_failed",
      message: "Upstream refresh returned stale or empty snapshot",
      commits: result.commits,
      timestamp: result.timestamp
    };
  } catch (err) {
    return {
      status: "upstream_failed",
      error: err instanceof Error ? err.message : String(err),
      commits: existingSnapshot?.commits || BASELINE_COMMITS,
      timestamp: existingSnapshot?.lastRefreshed || Date.now()
    };
  } finally {
    releaseRefreshLock();
  }
}
function verifyCronAuthorization(authHeader, customHeader, secret = process.env.CRON_SECRET) {
  if (!secret) {
    return process.env.NODE_ENV === "test" || process.env.NODE_ENV !== "production";
  }
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const provided = bearerToken || customHeader?.trim();
  return Boolean(provided && provided === secret);
}

// src/lib/github/apiHandler.ts
var CACHE_CONTROL_HEADER = "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400";
async function handler(req, res) {
  const isWebStandard = req instanceof Request && !res;
  let urlStr = "";
  let method = "GET";
  let authHeader = null;
  let customHeader = null;
  if (isWebStandard) {
    urlStr = req.url;
    method = req.method;
    authHeader = req.headers.get("authorization");
    customHeader = req.headers.get("x-cron-secret");
  } else {
    urlStr = req.url || "/";
    method = req.method || "GET";
    authHeader = req.headers?.["authorization"] || null;
    customHeader = req.headers?.["x-cron-secret"] || null;
  }
  const sendJson = (body, status = 200, extraHeaders = {}) => {
    const payload = JSON.stringify(body);
    if (isWebStandard) {
      return new Response(payload, {
        status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...extraHeaders
        }
      });
    }
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    for (const [k, v] of Object.entries(extraHeaders)) {
      res.setHeader(k, v);
    }
    return res.end(payload);
  };
  if (method !== "GET" && method !== "HEAD" && method !== "POST") {
    return sendJson({ error: "Method not allowed" }, 405, { Allow: "GET, HEAD, POST" });
  }
  const parsedUrl = new URL(urlStr, "http://localhost");
  const actionParam = parsedUrl.searchParams.get("action");
  const isRefreshRequest = actionParam === "refresh" || method === "POST";
  if (isRefreshRequest) {
    const isAuthorized = verifyCronAuthorization(authHeader, customHeader);
    if (!isAuthorized) {
      return sendJson(
        { error: "Unauthorized: Invalid or missing authorization token" },
        401
      );
    }
    const forceParam = parsedUrl.searchParams.get("force") === "true";
    const refreshResult = await performScheduledRefresh({
      token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
      force: forceParam
    });
    if (refreshResult.status === "locked") {
      return sendJson({ error: `Conflict: ${refreshResult.message || "Refresh in progress"}` }, 409);
    }
    if (refreshResult.status === "upstream_failed") {
      return sendJson(refreshResult, 502);
    }
    return sendJson(refreshResult, 200);
  }
  const repoParam = parsedUrl.searchParams.get("repo");
  if (repoParam) {
    const slug = parseRepoSlug(repoParam.includes("github.com") ? repoParam : `https://github.com/${repoParam}`);
    if (!slug || !isAllowedRepo(slug.owner, slug.repo)) {
      return sendJson(
        { error: "Forbidden: Repository is not in the allowed portfolio registry" },
        400
      );
    }
  }
  const result = getDurableCommitsReadOnly();
  return sendJson(
    {
      commits: result.commits,
      timestamp: result.timestamp,
      source: result.source
    },
    200,
    {
      "Cache-Control": CACHE_CONTROL_HEADER,
      "CDN-Cache-Control": CACHE_CONTROL_HEADER,
      "Vercel-CDN-Cache-Control": CACHE_CONTROL_HEADER
    }
  );
}
export {
  handler as default
};
