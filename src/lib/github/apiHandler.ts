import { isAllowedRepo, parseRepoSlug } from './config.ts'
import {
  getDurableCommitsReadOnly,
  performScheduledRefresh,
  verifyCronAuthorization,
} from './commitService.ts'

const CACHE_CONTROL_HEADER = 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400'

/**
 * Universal Vercel Serverless Function & Vite dev server middleware handler.
 * Implements strict separation between:
 * 1. Read-Only Visitors (GET without action=refresh): Reads durable snapshot; NEVER calls GitHub.
 * 2. Authorized Scheduled Refresh (POST or GET ?action=refresh): Authenticated via Bearer CRON_SECRET,
 *    enforces atomic lock and 24-hour interval.
 */
export default async function handler(req: any, res?: any) {
  // 1. Determine environment / request signature
  const isWebStandard = req instanceof Request && !res

  let urlStr = ''
  let method = 'GET'
  let authHeader: string | null = null
  let customHeader: string | null = null

  if (isWebStandard) {
    urlStr = req.url
    method = req.method
    authHeader = req.headers.get('authorization')
    customHeader = req.headers.get('x-cron-secret')
  } else {
    urlStr = req.url || '/'
    method = req.method || 'GET'
    authHeader = req.headers?.['authorization'] || null
    customHeader = req.headers?.['x-cron-secret'] || null
  }

  // Helper response builder
  const sendJson = (body: any, status = 200, extraHeaders: Record<string, string> = {}) => {
    const payload = JSON.stringify(body)
    if (isWebStandard) {
      return new Response(payload, {
        status,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...extraHeaders,
        },
      })
    }
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    for (const [k, v] of Object.entries(extraHeaders)) {
      res.setHeader(k, v)
    }
    return res.end(payload)
  }

  // Only allow GET, HEAD, and POST
  if (method !== 'GET' && method !== 'HEAD' && method !== 'POST') {
    return sendJson({ error: 'Method not allowed' }, 405, { Allow: 'GET, HEAD, POST' })
  }

  const parsedUrl = new URL(urlStr, 'http://localhost')
  const actionParam = parsedUrl.searchParams.get('action')
  const isRefreshRequest = actionParam === 'refresh' || method === 'POST'

  // ─────────────────────────────────────────────────────────────────────────
  // A. AUTHORIZED SCHEDULED REFRESH PATH (Writer)
  // ─────────────────────────────────────────────────────────────────────────
  if (isRefreshRequest) {
    const isAuthorized = verifyCronAuthorization(authHeader, customHeader)
    if (!isAuthorized) {
      return sendJson(
        { error: 'Unauthorized: Invalid or missing authorization token' },
        401
      )
    }

    const forceParam = parsedUrl.searchParams.get('force') === 'true'
    const refreshResult = await performScheduledRefresh({
      token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
      force: forceParam,
    })

    if (refreshResult.status === 'locked') {
      return sendJson({ error: `Conflict: ${refreshResult.message || 'Refresh in progress'}` }, 409)
    }

    if (refreshResult.status === 'upstream_failed') {
      return sendJson(refreshResult, 502)
    }

    return sendJson(refreshResult, 200)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // B. VISITOR READ-ONLY PATH (Strictly Zero GitHub Calls)
  // ─────────────────────────────────────────────────────────────────────────
  const repoParam = parsedUrl.searchParams.get('repo')
  if (repoParam) {
    const slug = parseRepoSlug(repoParam.includes('github.com') ? repoParam : `https://github.com/${repoParam}`)
    if (!slug || !isAllowedRepo(slug.owner, slug.repo)) {
      return sendJson(
        { error: 'Forbidden: Repository is not in the allowed portfolio registry' },
        400
      )
    }
  }

  const result = getDurableCommitsReadOnly()

  return sendJson(
    {
      commits: result.commits,
      timestamp: result.timestamp,
      source: result.source,
    },
    200,
    {
      'Cache-Control': CACHE_CONTROL_HEADER,
      'CDN-Cache-Control': CACHE_CONTROL_HEADER,
      'Vercel-CDN-Cache-Control': CACHE_CONTROL_HEADER,
    }
  )
}
