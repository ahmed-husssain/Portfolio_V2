export interface ConfiguredRepo {
  owner: string
  repo: string
  branch: string
}

/**
 * Strict allowlist of portfolio repositories.
 * Any request attempting to fetch repositories outside this list will be rejected
 * at the server boundary to prevent SSRF and unauthorized proxy abuse.
 */
export const ALLOWED_REPOSITORIES: readonly ConfiguredRepo[] = [
  { owner: 'ahmed-husssain', repo: 'Online-Art-Gallery', branch: 'main' },
  { owner: 'ahmed-husssain', repo: 'ShifaMangementSystem', branch: 'main' },
  { owner: 'AhapraxAhmed', repo: 'mockrithm', branch: 'main' },
  { owner: 'ahmed-husssain', repo: 'RealEstate-', branch: 'main' },
  { owner: 'ahmed-husssain', repo: 'E-books', branch: 'main' },
] as const

/**
 * Extracts owner and repository name from a GitHub URL.
 * Safely handles trailing slashes, .git extensions, and whitespace.
 * Returns null for profile URLs (e.g. github.com/username) and invalid inputs.
 */
export function parseRepoSlug(url?: string): { owner: string; repo: string } | null {
  if (!url || typeof url !== 'string') return null
  try {
    const cleaned = url.trim().replace(/\/+$/, '')
    const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/i)
    if (!match) return null

    const owner = match[1].trim()
    const repo = match[2].trim().replace(/\.git$/i, '')

    if (!owner || !repo) return null
    return { owner, repo }
  } catch {
    return null
  }
}

/**
 * Verifies whether a given repository slug is on the configured allowlist.
 * Comparison is case-insensitive according to GitHub repository naming standards.
 */
export function isAllowedRepo(owner: string, repo: string): boolean {
  if (!owner || !repo) return false
  const normOwner = owner.toLowerCase().trim()
  const normRepo = repo.toLowerCase().trim()

  return ALLOWED_REPOSITORIES.some(
    (configured) =>
      configured.owner.toLowerCase() === normOwner &&
      configured.repo.toLowerCase() === normRepo
  )
}

/**
 * Finds the configured repository configuration including the intended branch.
 */
export function getConfiguredRepo(owner: string, repo: string): ConfiguredRepo | null {
  const normOwner = owner.toLowerCase().trim()
  const normRepo = repo.toLowerCase().trim()

  const match = ALLOWED_REPOSITORIES.find(
    (configured) =>
      configured.owner.toLowerCase() === normOwner &&
      configured.repo.toLowerCase() === normRepo
  )

  return match || null
}

/**
 * Formats an ISO-8601 date string to a clean, human-readable editorial label (e.g. "Oct 8, 2026").
 * Formats in UTC to prevent day-shifting discrepancies across viewer client timezones.
 */
export function formatCommitDate(isoDate: string): string {
  if (!isoDate) return ''
  try {
    const d = new Date(isoDate)
    if (isNaN(d.getTime())) return ''

    const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    const day = d.getUTCDate()
    const year = d.getUTCFullYear()

    return `${month} ${day}, ${year}`
  } catch {
    return ''
  }
}
