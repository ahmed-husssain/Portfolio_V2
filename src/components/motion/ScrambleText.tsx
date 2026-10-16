import React, { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'
const INTERVAL_MS = 40
const CYCLES_PER_CHAR = 3

/**
 * Concept 4 — Text Scramble Reveal (Gestalt Pattern Recognition)
 *
 * Hook that triggers a character-scramble animation when `start` becomes true.
 * Each character resolves left-to-right after cycling through CYCLES_PER_CHAR
 * random characters at INTERVAL_MS intervals.
 *
 * The brain's pattern-completion drive makes the final text feel *decoded*
 * rather than simply revealed. Works best on short headings (≤ 40 chars).
 */
export function useTextScramble(target: string, start: boolean) {
  const [displayed, setDisplayed] = useState(target)
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!start) {
      setDisplayed(target)
      return
    }

    // Respect reduced motion — skip animation entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(target)
      return
    }

    const iterMap = new Array(target.length).fill(0) // cycles elapsed per char

    frameRef.current = setInterval(() => {
      setDisplayed((prev) => {
        const chars = prev.split('')
        let allResolved = true

        for (let i = 0; i < target.length; i++) {
          if (iterMap[i] >= CYCLES_PER_CHAR + i * 1.5) {
            // This character has served its time — lock it
            chars[i] = target[i]
          } else {
            // Still scrambling: show a random character
            chars[i] = target[i] === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
            iterMap[i]++
            allResolved = false
          }
        }

        if (allResolved && frameRef.current) {
          clearInterval(frameRef.current)
          frameRef.current = null
        }

        return chars.join('')
      })
    }, INTERVAL_MS)

    return () => {
      if (frameRef.current) clearInterval(frameRef.current)
    }
  }, [start, target])

  return displayed
}

/**
 * ScrambleText — drop-in component wrapping useTextScramble.
 * Uses IntersectionObserver to trigger when the element enters the viewport.
 */
interface ScrambleTextProps {
  text: string
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  triggerOnce?: boolean
}

export default function ScrambleText({
  text,
  as = 'span',
  className = '',
  triggerOnce = true,
}: ScrambleTextProps) {
  const [triggered, setTriggered] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const displayed = useTextScramble(text, triggered)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setTriggered(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true)
          if (triggerOnce) observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [triggerOnce])

  return React.createElement(as, { ref: containerRef, className }, displayed)
}

