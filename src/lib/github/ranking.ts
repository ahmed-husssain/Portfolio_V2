import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import type { Project } from '../../data/projects.ts'
import { PROJECTS } from '../../data/projects.ts'
import { commitStore, type ClientCommitData } from './commitStore.ts'
import { parseRepoSlug } from './config.ts'

/**
 * Extracts the authoritative timestamp (in epoch milliseconds) for a project.
 * Uses live GitHub commit data when available; falls back deterministically
 * to the project's static lastCommitDate, or 0 if neither is valid.
 */
export function getProjectEffectiveTimestamp(
  project: Project,
  commitData?: { isoDate?: string } | null
): number {
  if (commitData?.isoDate) {
    const time = new Date(commitData.isoDate).getTime()
    if (!isNaN(time) && time > 0) return time
  }

  if (project.lastCommitDate) {
    const time = new Date(project.lastCommitDate).getTime()
    if (!isNaN(time) && time > 0) return time
  }

  return 0
}

/**
 * Sorts a project collection descending by exact commit timestamp.
 * 
 * Rules:
 * - Compares exact millisecond timestamps (supports sub-day ordering).
 * - Newly committed projects move to #01; previously newer projects move down.
 * - Missing or failed repository data falls back deterministically to static dates.
 * - Uses project title as a secondary tiebreaker when timestamps are identical.
 */
export function rankProjects(
  projects: readonly Project[],
  commits: Record<string, { isoDate?: string; label?: string } | undefined>
): Project[] {
  return [...projects].sort((a, b) => {
    const slugA = parseRepoSlug(a.githubUrl)
    const slugB = parseRepoSlug(b.githubUrl)

    const keyA = slugA ? `${slugA.owner.toLowerCase()}/${slugA.repo.toLowerCase()}` : ''
    const keyB = slugB ? `${slugB.owner.toLowerCase()}/${slugB.repo.toLowerCase()}` : ''

    const commitA = keyA ? commits[keyA] : undefined
    const commitB = keyB ? commits[keyB] : undefined

    const timeA = getProjectEffectiveTimestamp(a, commitA)
    const timeB = getProjectEffectiveTimestamp(b, commitB)

    if (timeB !== timeA) {
      return timeB - timeA
    }

    // Deterministic tiebreaker for equal timestamps
    return a.title.localeCompare(b.title)
  })
}

export interface UseRankedProjectsOptions {
  featuredOnly?: boolean
}

export interface UseRankedProjectsResult {
  projects: Project[]
  isLive: boolean
}

/**
 * React hook to retrieve dynamically ranked projects sorted by latest commit.
 * Subscribes to the centralized commitStore so project cards automatically
 * reorder upon receipt of authoritative commit data.
 */
export function useRankedProjects(options: UseRankedProjectsOptions = {}): UseRankedProjectsResult {
  const subscribe = useCallback((onStoreChange: () => void) => {
    return commitStore.subscribe(onStoreChange)
  }, [])

  const getSnapshot = useCallback((): Record<string, ClientCommitData> => {
    return commitStore.getAll()
  }, [])

  const commits = useSyncExternalStore(subscribe, getSnapshot, () => ({}))

  useEffect(() => {
    commitStore.ensureLoaded()
  }, [])

  const isLive = Object.keys(commits).length > 0

  const ranked = useMemo(() => {
    const all = rankProjects(PROJECTS, commits)
    return options.featuredOnly ? all.filter((p) => p.featured) : all
  }, [commits, options.featuredOnly])

  return { projects: ranked, isLive }
}
