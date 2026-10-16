import { useEffect, useRef, useState } from 'react'
import ScrambleText from '../motion/ScrambleText'

interface SectionHeadingProps {
  index?: string
  title: string
  subtitle?: string
  meta?: string
  className?: string
  scramble?: boolean
}

export default function SectionHeading({
  index,
  title,
  subtitle,
  meta,
  className = '',
  scramble = true,
}: SectionHeadingProps) {
  const [isInView, setIsInView] = useState(() => {
    if (typeof window === 'undefined') return true
    if (!('IntersectionObserver' in window)) return true
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isInView) return
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px',
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isInView])

  return (
    <div ref={containerRef} className={`mb-8 sm:mb-10 md:mb-12 ${className}`}>
      {/* ─── Top Line & Heading Content ─── */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between pb-3 sm:pb-4 gap-2">
        <div className="flex items-baseline gap-3">
          {/* Masked Baseline Index Slot */}
          {index && (
            <div className="overflow-hidden inline-flex items-baseline">
              <span
                className={`text-micro-caps text-muted inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                  isInView ? 'translate-y-0' : 'translate-y-[125%]'
                }`}
              >
                {index}
              </span>
            </div>
          )}

          {/* Masked Baseline Title Slot */}
          <div className="overflow-hidden inline-flex items-baseline">
            <div
              className={`transition-transform duration-600 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                isInView ? 'translate-y-0' : 'translate-y-[125%]'
              }`}
            >
              {scramble ? (
                <ScrambleText
                  text={title}
                  as="h2"
                  className="text-title-1 text-foreground"
                />
              ) : (
                <h2 className="text-title-1 text-foreground">{title}</h2>
              )}
            </div>
          </div>
        </div>

        {/* Masked Meta Tag */}
        {meta && (
          <div className="overflow-hidden inline-flex items-baseline">
            <span
              className={`text-micro-caps text-muted inline-block transition-[opacity,transform] duration-500 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
            >
              {meta}
            </span>
          </div>
        )}
      </div>

      {/* ─── Architectural Rule Line (Draws from Left) ─── */}
      <div
        className={`h-[1px] bg-border transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left motion-reduce:transition-none ${
          isInView ? 'scale-x-100' : 'scale-x-0'
        }`}
      />

      {/* ─── Subtitle Lead In ─── */}
      {subtitle && (
        <p
          className={`text-body-lead text-secondary mt-3.5 max-w-[680px] transition-[opacity,transform] duration-500 delay-200 ease-out motion-reduce:transition-none ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}


