import { useEffect, useRef, useCallback } from 'react'

/**
 * Concept 3 — Magnetic Cursor Gravity (Affordance Theory / J.J. Gibson)
 *
 * Returns a ref to attach to a button/link and an onMouseLeave handler.
 * When the cursor enters within the element's bounds, the element gently
 * gravitates toward the cursor — 30% pull strength. On leave, it springs back
 * with a slight overshoot (cubic-bezier with s > 1) to simulate a rubber band.
 *
 * Strength (0–1): how strongly the element pulls toward cursor. Default 0.3.
 */
export function useMagneticHover(strength = 0.3) {
  const ref = useRef<HTMLElement>(null)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength

      el.style.transition = 'transform 0.15s ease-out'
      el.style.transform = `translate(${dx}px, ${dy}px)`
    },
    [strength]
  )

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    // Spring back with elastic overshoot
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    el.style.transform = 'translate(0px, 0px)'
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return ref
}
