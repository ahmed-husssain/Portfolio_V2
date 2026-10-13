import { useEffect, useRef, useCallback } from 'react'

interface KineticHeadlineProps {
  className?: string
  lines: Array<{
    prefix?: React.ReactNode
    text: string
    suffix?: React.ReactNode
  }>
}

export default function KineticHeadline({ className = '', lines }: KineticHeadlineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const charElementsRef = useRef<HTMLSpanElement[]>([])
  const charCoordsRef = useRef<Array<{ cx: number; cy: number }>>([])
  const rafIdRef = useRef<number | null>(null)
  const activeCharsRef = useRef<Set<HTMLSpanElement>>(new Set())

  // Full plain text for screen readers
  const fullText = lines.map((l) => l.text).join(' ')

  // Measure and cache character center coordinates
  const measureChars = useCallback(() => {
    if (!containerRef.current) return
    const coords: Array<{ cx: number; cy: number }> = []

    charElementsRef.current.forEach((el) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      coords.push({
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
      })
    })

    charCoordsRef.current = coords
  }, [])

  // Reset all stretched characters back to neutral transform
  const resetAllChars = useCallback(() => {
    activeCharsRef.current.forEach((el) => {
      el.style.transform = 'translate3d(0, 0, 0) scale(1, 1)'
    })
    activeCharsRef.current.clear()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Guard 1: Verify fine pointer (disable on touch devices to avoid scroll interference)
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    // Guard 2: Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isFinePointer || prefersReducedMotion) {
      return
    }

    measureChars()

    const handleResize = () => {
      measureChars()
      resetAllChars()
    }

    window.addEventListener('resize', handleResize, { passive: true })

    const handlePointerMove = (e: PointerEvent) => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const mouseX = e.clientX
        const mouseY = e.clientY
        const radius = 135 // Proximity influence radius in px
        const maxScaleY = 0.72 // Up to ~1.72x vertical stretch
        const maxScaleX = 0.12 // Subtle ~1.12x horizontal breath
        const maxTranslateY = -8 // Subtle upward ascender reach

        const elements = charElementsRef.current
        const coords = charCoordsRef.current

        coords.forEach((coord, i) => {
          const el = elements[i]
          if (!el) return

          const dx = mouseX - coord.cx
          const dy = mouseY - coord.cy
          const dist = Math.hypot(dx, dy)

          if (dist < radius) {
            const ratio = 1 - dist / radius
            // Smooth easing curve (quartic-like falloff for snappy center)
            const eased = ratio * ratio * (3 - 2 * ratio)

            const scaleY = 1 + eased * maxScaleY
            const scaleX = 1 + eased * maxScaleX
            const translateY = eased * maxTranslateY

            el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`
            activeCharsRef.current.add(el)
          } else if (activeCharsRef.current.has(el)) {
            el.style.transform = 'translate3d(0, 0, 0) scale(1, 1)'
            activeCharsRef.current.delete(el)
          }
        })
      })
    }

    const handlePointerEnter = () => {
      measureChars()
    }

    const handlePointerLeave = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
      resetAllChars()
    }

    container.addEventListener('pointermove', handlePointerMove, { passive: true })
    container.addEventListener('pointerenter', handlePointerEnter, { passive: true })
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerenter', handlePointerEnter)
      container.removeEventListener('pointerleave', handlePointerLeave)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
      resetAllChars()
    }
  }, [measureChars, resetAllChars])

  // Collect char elements into ref list during render
  charElementsRef.current = []

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      aria-label={fullText}
      role="heading"
      aria-level={1}
    >
      {lines.map((line, lineIdx) => {
        const words = line.text.split(' ')

        return (
          <div
            key={lineIdx}
            className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-x-6 gap-y-1.5 py-1"
            aria-hidden="true"
          >
            <div className="flex items-baseline flex-wrap gap-x-3">
              {line.prefix && (
                <div className="shrink-0 mb-1 lg:mb-0 mr-1 sm:mr-3">
                  {line.prefix}
                </div>
              )}

              <span className="inline-block lg:whitespace-nowrap">
                {words.map((word, wordIdx) => (
                  <span key={wordIdx} className="inline-block whitespace-nowrap">
                    {word.split('').map((char, charIdx) => (
                      <span
                        key={charIdx}
                        ref={(el) => {
                          if (el) charElementsRef.current.push(el)
                        }}
                        className="kinetic-char text-editorial-display text-foreground"
                      >
                        {char}
                      </span>
                    ))}
                    {wordIdx < words.length - 1 && (
                      <span className="inline-block w-[0.26em] text-editorial-display select-none">
                        &nbsp;
                      </span>
                    )}
                  </span>
                ))}
              </span>
            </div>

            {line.suffix && (
              <div className="shrink-0 mt-2 lg:mt-0 lg:ml-auto">
                {line.suffix}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
