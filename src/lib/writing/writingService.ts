import { CONTACT_CONFIG } from '../../data/contact'

export interface ArticleMetadata {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  published: boolean
  isExternal?: boolean
  externalUrl?: string
  platform?: 'devto' | 'hashnode' | 'local'
  interactiveDemo?: boolean
  sourceProjectSlug?: string
}

export interface ActivityPulse {
  githubHandle: string
  githubUrl: string
  linkedinUrl: string
  activeSystems: { name: string; tag: string; repoUrl: string }[]
  status: string
}

export const ACTIVITY_PULSE: ActivityPulse = {
  githubHandle: CONTACT_CONFIG.github.handle,
  githubUrl: CONTACT_CONFIG.github.url,
  linkedinUrl: CONTACT_CONFIG.linkedin.url,
  status: 'Actively committing production code across .NET 8, Flutter, and PostgreSQL.',
  activeSystems: [
    {
      name: 'ShifaMangementSystem',
      tag: 'Clinical Ops / PostgreSQL RPCs',
      repoUrl: 'https://github.com/ahmed-husssain/ShifaMangementSystem',
    },
    {
      name: 'Online-Art-Gallery',
      tag: '.NET 8 / EF Core OCC Bidding',
      repoUrl: 'https://github.com/ahmed-husssain',
    },
    {
      name: 'Mockrithm',
      tag: 'Aptech Vision 2025 Runner-Up',
      repoUrl: 'https://github.com/AhapraxAhmed/mockrithm',
    },
  ],
}

// Eagerly import only the metadata export for fast listing without loading MDX component bodies
const metadataModules = import.meta.glob('../../content/writing/*.mdx', {
  eager: true,
  import: 'metadata',
}) as Record<string, ArticleMetadata>

// Map from slug -> filepath
const slugToFilepathMap = new Map<string, string>()

// Populate map
for (const [filepath, meta] of Object.entries(metadataModules)) {
  if (meta && meta.slug) {
    slugToFilepathMap.set(meta.slug, filepath)
  }
}

/**
 * Returns all local articles regardless of publication status (internal / dev use)
 */
export function getAllArticles(): ArticleMetadata[] {
  return Object.values(metadataModules).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

/**
 * Returns only verified, published local articles sorted in reverse chronological order
 */
export function getPublishedArticles(): ArticleMetadata[] {
  return getAllArticles().filter((article) => article.published === true)
}

/**
 * Looks up article metadata by slug. Only returns if published, unless includeDrafts is true.
 */
export function getArticleBySlug(slug: string, includeDrafts = false): ArticleMetadata | undefined {
  const filepath = slugToFilepathMap.get(slug)
  if (!filepath) return undefined
  const meta = metadataModules[filepath]
  if (!meta) return undefined
  if (!meta.published && !includeDrafts) return undefined
  return meta
}

/**
 * Gets the next published article after the current one, for bottom navigation
 */
export function getNextArticle(currentSlug: string): ArticleMetadata | null {
  const published = getPublishedArticles()
  const currentIndex = published.findIndex((a) => a.slug === currentSlug)
  if (currentIndex === -1 || currentIndex === published.length - 1) {
    return published[0] && published[0].slug !== currentSlug ? published[0] : null
  }
  return published[currentIndex + 1]
}

/**
 * Returns all unique tags from published articles
 */
export function getWritingTopics(): string[] {
  const published = getPublishedArticles()
  if (published.length === 0) {
    return [
      'Distributed Systems',
      'PostgreSQL',
      '.NET 8 / C#',
      'Concurrency & Locking',
      'System Resilience',
    ]
  }
  const set = new Set<string>()
  for (const article of published) {
    article.tags?.forEach((t) => set.add(t))
  }
  return Array.from(set)
}

/**
 * Fetches published articles from Dev.to API if a username is configured.
 * Caches in sessionStorage to eliminate rate-limiting and maximize performance.
 */
export async function fetchRemoteDevToArticles(username?: string): Promise<ArticleMetadata[]> {
  const targetUser = username || import.meta.env.VITE_DEVTO_USERNAME
  if (!targetUser) return []

  const cacheKey = `devto_articles_${targetUser}`
  if (typeof window !== 'undefined') {
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch {
        // ignore cache parse error
      }
    }
  }

  try {
    const res = await fetch(`https://dev.to/api/articles?username=${encodeURIComponent(targetUser)}`, {
      headers: { Accept: 'application/vnd.forem.api-v1+json' },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data)) return []

    const formatted: ArticleMetadata[] = data.map((item: any) => ({
      slug: item.slug || `devto-${item.id}`,
      title: item.title,
      description: item.description,
      date: item.published_at ? item.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      tags: Array.isArray(item.tag_list) ? item.tag_list : [],
      published: true,
      isExternal: true,
      externalUrl: item.url,
      platform: 'devto' as const,
    }))

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(formatted))
    }

    return formatted
  } catch (err) {
    console.warn('Could not fetch external Dev.to articles:', err)
    return []
  }
}
