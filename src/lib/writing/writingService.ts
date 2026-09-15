
export interface ArticleMetadata {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  published: boolean
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
 * Returns all articles regardless of publication status (internal / dev use)
 */
export function getAllArticles(): ArticleMetadata[] {
  return Object.values(metadataModules).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

/**
 * Returns only verified, published articles sorted in reverse chronological order
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
 * Returns all unique tags from published articles (or fallback default topics if none published)
 */
export function getWritingTopics(): string[] {
  const published = getPublishedArticles()
  if (published.length === 0) {
    return [
      'Backend Architecture',
      'Relational Databases & Indexing',
      'API Design & Auth Guards',
      'Full-Stack Performance',
      'System Resilience',
    ]
  }
  const set = new Set<string>()
  for (const article of published) {
    article.tags?.forEach((t) => set.add(t))
  }
  return Array.from(set)
}
