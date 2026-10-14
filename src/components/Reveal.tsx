import React, { useEffect, useRef, useState } from 'react'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number // delay in milliseconds
}

/**
 * Lightweight viewport-based section reveal using native IntersectionObserver.
 * Triggers once, disconnects immediately, and respects prefers-reduced-motion.
 */
export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return true
    if (!('IntersectionObserver' in window)) return true
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible) return

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08,
      }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [isVisible])

  return (
    <div
      ref={ref}
      style={delay > 0 && isVisible ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  )
}
