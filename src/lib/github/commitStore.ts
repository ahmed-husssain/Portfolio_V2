import { parseRepoSlug, formatCommitDate } from './config.ts'

export interface ClientCommitData {
  sha: string
  isoDate: string
  label: string
  branch: string
}

interface StoredCache {
  commits: Record<string, ClientCommitData>
  timestamp: number
}

const CLIENT_CACHE_KEY = 'portfolio_github_commits_v2'
const CLIENT_CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes client cache (CDN protects origin; client catches updates within 30m)

class CommitStore {
  private memoryCache = new Map<string, ClientCommitData>()
  private snapshot: Record<string, ClientCommitData> = {}
  private listeners = new Set<() => void>()
  private inFlightPromise: Promise<void> | null = null
  private hasInitializedFromStorage = false

  constructor() {
    this.hydrateFromStorage()
  }

  private updateSnapshot() {
    const next: Record<string, ClientCommitData> = {}
    this.memoryCache.forEach((value, key) => {
      next[key] = value
    })
    this.snapshot = next
  }

  private hydrateFromStorage() {
    if (this.hasInitializedFromStorage || typeof window === 'undefined') return
    this.hasInitializedFromStorage = true

    try {
      const raw = sessionStorage.getItem(CLIENT_CACHE_KEY) || localStorage.getItem(CLIENT_CACHE_KEY)
      if (!raw) return

      const parsed: StoredCache = JSON.parse(raw)
      const isFresh = Date.now() - parsed.timestamp < CLIENT_CACHE_TTL_MS

      if (isFresh && parsed.commits) {
        Object.entries(parsed.commits).forEach(([key, data]) => {
          this.memoryCache.set(key.toLowerCase(), data)
        })
        this.updateSnapshot()
      }
    } catch {
      // Storage access blocked or malformed JSON
    }
  }

  private persistToStorage() {
    if (typeof window === 'undefined') return
    try {
      const payload: StoredCache = {
        commits: this.snapshot,
        timestamp: Date.now(),
      }

      sessionStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(payload))
      localStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(payload))
    } catch {
      // Ignore quota or private mode issues
    }
  }

  public get(owner: string, repo: string): ClientCommitData | null {
    this.hydrateFromStorage()
    const key = `${owner.toLowerCase()}/${repo.toLowerCase()}`
    return this.memoryCache.get(key) || null
  }

  public getAll(): Record<string, ClientCommitData> {
    this.hydrateFromStorage()
    return this.snapshot
  }

  public getByUrl(url?: string): ClientCommitData | null {
    const slug = parseRepoSlug(url)
    if (!slug) return null
    return this.get(slug.owner, slug.repo)
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener())
  }

  /**
   * Resets the store. Useful in unit tests and cache invalidation testing.
   */
  public resetForTesting() {
    this.memoryCache.clear()
    this.snapshot = {}
    this.hasInitializedFromStorage = false
    this.inFlightPromise = null
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(CLIENT_CACHE_KEY)
        localStorage.removeItem(CLIENT_CACHE_KEY)
      } catch {
        // ignore
      }
    }
  }

  /**
   * Ensures commit data is fetched.
   * If a fetch is already in flight, reuses the existing promise.
   * All subscribers are notified once the batch arrives.
   */
  public async ensureLoaded(): Promise<void> {
    this.hydrateFromStorage()

    // If we already have fresh entries, no immediate fetch needed
    if (this.memoryCache.size > 0 && !this.inFlightPromise) {
      return
    }

    if (this.inFlightPromise) {
      return this.inFlightPromise
    }

    this.inFlightPromise = (async () => {
      try {
        const res = await fetch('/api/github-commits', {
          headers: {
            Accept: 'application/json',
          },
        })

        if (!res.ok) return

        const json = (await res.json()) as {
          commits?: Record<string, ClientCommitData>
        }

        if (json.commits && typeof json.commits === 'object') {
          Object.entries(json.commits).forEach(([key, commit]) => {
            if (commit?.isoDate) {
              const label = commit.label || formatCommitDate(commit.isoDate)
              this.memoryCache.set(key.toLowerCase(), {
                ...commit,
                label,
              })
            }
          })

          this.updateSnapshot()
          this.persistToStorage()
          this.notify()
        }
      } catch {
        // Network failure; graceful degradation without UI errors
      } finally {
        this.inFlightPromise = null
      }
    })()

    return this.inFlightPromise
  }
}

export const commitStore = new CommitStore()
