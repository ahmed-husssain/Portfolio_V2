import { useEffect, useRef } from 'react'

/**
 * Concept 2 — Scroll Progress Ambient Indicator (Flow Theory)
 *
 * A hair-thin 2px line at the very top of the viewport that silently tracks
 * reading progress. No numbers, no labels — just a growing line that anchors
 * the user's sense of position in the content. Driven by scaleX for optimal
 * performance (compositor-only, no layout/paint).
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
      bar.style.transform = `scaleX(${progress})`
    }

    window.addEventListener('scroll', update, { passive: true })
    update() // initial paint

    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        transformOrigin: 'left center',
        transform: 'scaleX(0)',
        backgroundColor: 'var(--text-primary)',
        opacity: 0.5,
        zIndex: 9999,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  )
}
