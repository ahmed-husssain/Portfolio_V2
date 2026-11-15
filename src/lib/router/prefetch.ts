/**
 * Route prefetching engine.
 * Preloads code-split chunks on idle or link hover to eliminate
 * loading delays, prevent Suspense fallback flash, and ensure
 * instant in-memory page transitions.
 */

const prefetchedRoutes = new Set<string>()

const loaders: Record<string, () => Promise<unknown>> = {
  '/work': () => import('../../pages/Work'),
  '/about': () => import('../../pages/About'),
  '/writing': () => import('../../pages/Writing'),
  '/review': () => import('../../pages/Review'),
}

/**
 * Prefetch a specific route chunk on demand (e.g. mouse hover or focus)
 */
export function prefetchRoute(href: string): void {
  if (typeof window === 'undefined') return
  const cleanPath = href.split('#')[0].split('?')[0]
  if (!cleanPath || cleanPath === '/' || prefetchedRoutes.has(cleanPath)) return

  const directLoader = loaders[cleanPath]
  if (directLoader) {
    prefetchedRoutes.add(cleanPath)
    directLoader().catch(() => {
      prefetchedRoutes.delete(cleanPath)
    })
    return
  }

  // Parameterized routes
  if (cleanPath.startsWith('/work/')) {
    prefetchedRoutes.add(cleanPath)
    import('../../pages/ProjectDetail').catch(() => {
      prefetchedRoutes.delete(cleanPath)
    })
  } else if (cleanPath.startsWith('/writing/')) {
    prefetchedRoutes.add(cleanPath)
    import('../../pages/ArticleDetail').catch(() => {
      prefetchedRoutes.delete(cleanPath)
    })
  }
}

/**
 * Preload all primary subpage chunks when the main thread becomes idle
 */
export function preloadPrimaryRoutesOnIdle(): void {
  if (typeof window === 'undefined') return

  const warmAll = () => {
    Object.keys(loaders).forEach((route) => {
      prefetchRoute(route)
    })
  }

  if ('requestIdleCallback' in window) {
    ;(window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => void }).requestIdleCallback(
      warmAll,
      { timeout: 2000 }
    )
  } else {
    setTimeout(warmAll, 1200)
  }
}
