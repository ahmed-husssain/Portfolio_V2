import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { commitStore, type ClientCommitData } from '../lib/github/commitStore.ts'
import { parseRepoSlug } from '../lib/github/config.ts'

export interface CommitResult {
  commitLabel: string
  commitDate?: string
  isLive: boolean
}

/**
 * Hook to retrieve the latest commit date for a GitHub repository.
 *
 * Architecture:
 * - Subscribes to a centralized client store (`commitStore`).
 * - Fetches all portfolio repository commits in a single batch request via `/api/github-commits`.
 * - Employs multi-tier caching (client sessionStorage + server HTTP CDN s-maxage).
 * - Treats successful GitHub data as authoritative, falling back to static dates only when live data is unavailable.
 * - Deduplicates concurrent requests so rendering multiple cards triggers only one network request.
 */
export function useGitHubCommit(
  githubUrl?: string,
  initialLabel?: string,
  initialDate?: string
): CommitResult {
  const slug = parseRepoSlug(githubUrl)
  const owner = slug?.owner?.toLowerCase() || ''
  const repo = slug?.repo?.toLowerCase() || ''

  const subscribe = useCallback((onStoreChange: () => void) => {
    return commitStore.subscribe(onStoreChange)
  }, [])

  const getSnapshot = useCallback((): ClientCommitData | null => {
    if (!owner || !repo) return null
    return commitStore.get(owner, repo)
  }, [owner, repo])

  const liveCommit = useSyncExternalStore(subscribe, getSnapshot, () => null)

  useEffect(() => {
    if (owner && repo) {
      commitStore.ensureLoaded()
    }
  }, [owner, repo])

  if (liveCommit) {
    return {
      commitLabel: liveCommit.label,
      commitDate: liveCommit.isoDate,
      isLive: true,
    }
  }

  return {
    commitLabel: initialLabel || '',
    commitDate: initialDate,
    isLive: false,
  }
}
