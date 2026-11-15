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
export function useMagneticHover(strength = 0.28, maxDistance = 6) {
  const ref = useRef<HTMLElement>(null)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      if (
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return
      }

      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      let dx = (e.clientX - cx) * strength
      let dy = (e.clientY - cy) * strength

      // Physical distance clamp
      const dist = Math.hypot(dx, dy)
      if (dist > maxDistance) {
        const scale = maxDistance / dist
        dx *= scale
        dy *= scale
      }

      el.style.transition = 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`
    },
    [strength, maxDistance]
  )

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    // Damped Apple spring release
    el.style.transition = 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.transform = 'translate3d(0px, 0px, 0)'
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
