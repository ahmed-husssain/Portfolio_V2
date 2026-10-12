import { useState, useEffect } from 'react'

interface CommitResult {
  commitLabel: string
  commitDate?: string
  isLive: boolean
}

interface CacheEntry {
  isoDate: string
  label: string
  timestamp: number
}

const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes
const inFlightRequests = new Map<string, Promise<{ isoDate: string; label: string } | null>>()

/**
 * Extracts owner and repo from a GitHub URL
 * e.g. 'https://github.com/ahmed-husssain/ShifaMangementSystem' -> { owner: 'ahmed-husssain', repo: 'ShifaMangementSystem' }
 */
function parseRepoSlug(url?: string): { owner: string; repo: string } | null {
  if (!url) return null
  try {
    const cleaned = url.replace(/\/$/, '')
    const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/i)
    if (!match) return null
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
  } catch {
    return null
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return ''
    const month = d.toLocaleString('en-US', { month: 'short' })
    const day = d.getDate()
    const year = d.getFullYear()
    return `${month} ${day}, ${year}`
  } catch {
    return ''
  }
}

/**
 * Safely reads from localStorage or sessionStorage
 */
function readCache(cacheKey: string): CacheEntry | null {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) || sessionStorage.getItem(cacheKey) : null
    if (!raw) return null
    const parsed: CacheEntry = JSON.parse(raw)
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed
    }
  } catch {
    // Storage access blocked or invalid JSON
  }
  return null
}

function writeCache(cacheKey: string, entry: CacheEntry) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify(entry))
    }
  } catch {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(cacheKey, JSON.stringify(entry))
      }
    } catch {
      // ignore
    }
  }
}

/**
 * Hook to dynamically fetch the latest commit date from GitHub's REST API.
 * Gracefully falls back to the static `initialLabel` and `initialDate`.
 * Automatically caches results to avoid rate limits.
 */
export function useGitHubCommit(
  githubUrl?: string,
  initialLabel?: string,
  initialDate?: string
): CommitResult {
  const [result, setResult] = useState<CommitResult>(() => ({
    commitLabel: initialLabel || '',
    commitDate: initialDate,
    isLive: false,
  }))

  useEffect(() => {
    const slug = parseRepoSlug(githubUrl)
    if (!slug) {
      setResult({
        commitLabel: initialLabel || '',
        commitDate: initialDate,
        isLive: false,
      })
      return
    }

    const cacheKey = `gh_commit_v1_${slug.owner}_${slug.repo}`
    const cached = readCache(cacheKey)

    const initialTime = initialDate ? new Date(initialDate).getTime() : 0

    if (cached) {
      const cachedTime = new Date(cached.isoDate).getTime()
      if (cachedTime >= initialTime) {
        setResult({
          commitLabel: cached.label,
          commitDate: cached.isoDate,
          isLive: true,
        })
        return
      }
    }

    let isMounted = true

    const fetchLatest = async () => {
      try {
        const repoPath = `${slug.owner}/${slug.repo}`
        let reqPromise = inFlightRequests.get(repoPath)

        if (!reqPromise) {
          reqPromise = (async () => {
            const res = await fetch(
              `https://api.github.com/repos/${slug.owner}/${slug.repo}/commits?per_page=1`,
              {
                headers: {
                  Accept: 'application/vnd.github.v3+json',
                },
              }
            )

            if (!res.ok) return null
            const data = await res.json()
            if (!Array.isArray(data) || !data[0]?.commit) return null

            const commit = data[0].commit
            const dateStr = commit.committer?.date || commit.author?.date
            if (!dateStr) return null

            const label = formatDate(dateStr)
            return { isoDate: dateStr, label }
          })()

          inFlightRequests.set(repoPath, reqPromise)
        }

        const data = await reqPromise
        if (!isMounted) return

        if (data) {
          writeCache(cacheKey, {
            isoDate: data.isoDate,
            label: data.label,
            timestamp: Date.now(),
          })

          const fetchedTime = new Date(data.isoDate).getTime()
          // Only override if fetched commit is at least as new as the static initialDate
          if (fetchedTime >= initialTime) {
            setResult({
              commitLabel: data.label,
              commitDate: data.isoDate,
              isLive: true,
            })
          }
        }
      } catch {
        // Fall back quietly without interrupting UI
      } finally {
        inFlightRequests.delete(`${slug.owner}/${slug.repo}`)
      }
    }

    fetchLatest()

    return () => {
      isMounted = false
    }
  }, [githubUrl, initialLabel, initialDate])

  return result
}
