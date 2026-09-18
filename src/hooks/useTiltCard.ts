import { useRef, useCallback, useEffect } from 'react'

/**
 * Concept 5 — Elastic Card Tilt (Embodied Cognition)
 *
 * Returns a ref to attach to a card element.
 * On mousemove, applies a gentle perspective tilt based on cursor position
 * within the element — max ±TILT_MAX degrees on each axis. A subtle
 * box-shadow shift reinforces the illusion of a physical light source.
 *
 * On mouseleave, the card springs back with elastic overshoot.
 *
 * The physical-object illusion (Embodied Cognition, Lakoff & Johnson) increases
 * perceived quality and makes content feel tangible and trustworthy.
 */

const TILT_MAX = 5 // degrees — subtle, not carnival
const PERSPECTIVE = 900 // px

export function useTiltCard() {
  const ref = useRef<HTMLElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = el.getBoundingClientRect()
    // Normalize cursor position to -1 … +1 range relative to card center
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2

    const rotateX = -ny * TILT_MAX // invert Y so tilting toward cursor
    const rotateY = nx * TILT_MAX

    // Subtle shadow offset following tilt direction
    const shadowX = nx * 8
    const shadowY = ny * 8

    el.style.transition = 'transform 0.12s ease-out, box-shadow 0.12s ease-out'
    el.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
    el.style.boxShadow = `${shadowX}px ${shadowY}px 24px -4px rgba(0,0,0,0.12)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    el.style.boxShadow = ''
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.willChange = 'transform'
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return ref
}
