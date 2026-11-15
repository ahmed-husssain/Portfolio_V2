import React, { useRef, useEffect } from 'react'

interface MagneticProps {
  children: React.ReactNode
  strength?: number
  maxDistance?: number
  className?: string
  onClick?: () => void
}

/**
 * Magnetic cursor pull wrapper.
 * Gently pulls the element toward the cursor on desktop pointer hover (max 6px).
 * Releases with a smooth Apple-damped spring curve (cubic-bezier(0.16, 1, 0.3, 1)).
 * Automatically disabled on touch screens and prefers-reduced-motion.
 * Zero React re-renders: modifies style.transform directly on the GPU layer.
 */
export default function Magnetic({
  children,
  strength = 0.28,
  maxDistance = 6,
  className = 'inline-block',
  onClick,
}: MagneticProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    // Guard: Only run for fine pointers (mouse) and when motion is permitted
    const isSupported =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isSupported) return

    const handleMouseMove = (e: MouseEvent) => {
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
    }

    const handleMouseLeave = () => {
      el.style.transition = 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = 'translate3d(0px, 0px, 0)'
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, maxDistance])

  return (
    <div
      ref={elementRef}
      onClick={onClick}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}
