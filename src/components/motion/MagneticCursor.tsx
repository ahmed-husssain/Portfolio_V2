import { useEffect, useRef, useState } from 'react'

function checkPointerSupport(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function MagneticCursor() {
  const [isActive] = useState(() => checkPointerSupport())
  const [cursorText, setCursorText] = useState('')
  const [isHoveringLink, setIsHoveringLink] = useState(false)

  const cursorRef = useRef<HTMLDivElement>(null)
  const targetPos = useRef({ x: -100, y: -100 })
  const currentPos = useRef({ x: -100, y: -100 })
  const isVisibleRef = useRef(false)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    if (!isActive) return

    const handlePointerMove = (e: PointerEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY }
      if (!isVisibleRef.current && cursorRef.current) {
        isVisibleRef.current = true
        cursorRef.current.style.opacity = '1'
      }

      // Context detection via event delegation
      const target = e.target as HTMLElement | null
      if (!target) return

      // Hide custom cursor completely over navbar, form fields, editable text, and dialog modals
      // to ensure native text insertion I-beam, caret, and modal controls are never obscured
      const shouldHide = Boolean(
        target.closest(
          'header, nav, input, textarea, select, [contenteditable="true"], [role="dialog"], dialog, [data-no-cursor], [data-cursor-hide]'
        )
      )
      if (shouldHide) {
        setCursorText('')
        setIsHoveringLink(false)
        if (cursorRef.current) cursorRef.current.style.opacity = '0'
        return
      }

      if (cursorRef.current && isVisibleRef.current) {
        cursorRef.current.style.opacity = '1'
      }

      const textTarget = target.closest('[data-cursor-text]') as HTMLElement | null
      const clickableTarget = target.closest('a, button, [role="button"]')

      if (textTarget) {
        const text = textTarget.getAttribute('data-cursor-text') || ''
        setCursorText(text)
        setIsHoveringLink(false)
      } else if (clickableTarget) {
        setCursorText('')
        setIsHoveringLink(true)
      } else {
        setCursorText('')
        setIsHoveringLink(false)
      }
    }

    // Hide cursor during active keyboard typing in inputs/textareas
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      const active = document.activeElement
      if (
        active &&
        (active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          active.getAttribute('contenteditable') === 'true')
      ) {
        if (cursorRef.current) cursorRef.current.style.opacity = '0'
      }
    }

    const handleMouseLeave = () => {
      isVisibleRef.current = false
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
      }
    }

    // High performance lerp animation loop (Emil Kowalski / Snellenberg spring feel)
    const render = () => {
      const ease = 0.18
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease

      if (cursorRef.current) {
        const x = currentPos.current.x.toFixed(2)
        const y = currentPos.current.y.toFixed(2)
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }

      rafId.current = requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('keydown', handleKeyDown, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    rafId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [isActive])

  if (!isActive) return null

  const hasText = Boolean(cursorText)

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-50 opacity-0 transition-opacity duration-200 will-change-transform flex items-center justify-center ${
        hasText
          ? 'px-3.5 py-1.5 rounded-full bg-foreground text-page shadow-lg'
          : isHoveringLink
            ? 'w-10 h-10 rounded-full border border-foreground/60 bg-foreground/10 backdrop-blur-[2px]'
            : 'w-3 h-3 rounded-full bg-foreground'
      }`}
      style={{
        transition:
          'opacity 150ms ease-out, width 180ms cubic-bezier(0.16, 1, 0.3, 1), height 180ms cubic-bezier(0.16, 1, 0.3, 1), padding 180ms cubic-bezier(0.16, 1, 0.3, 1), background-color 180ms ease-out',
      }}
      aria-hidden="true"
    >
      {hasText && (
        <span className="font-mono text-[10px] font-bold tracking-wider uppercase whitespace-nowrap select-none">
          {cursorText}
        </span>
      )}
    </div>
  )
}
