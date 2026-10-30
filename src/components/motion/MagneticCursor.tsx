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

  const cursorRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const targetPos = useRef({ x: -100, y: -100 })
  const currentPos = useRef({ x: -100, y: -100 })
  const lastPointer = useRef({ x: -100, y: -100 })
  const isVisibleRef = useRef(false)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    if (!isActive) return

    let currentMode: 'dot' | 'link' | 'text' | 'hidden' = 'dot'
    let currentText = ''

    const updateState = (target: HTMLElement | null) => {
      const cursor = cursorRef.current
      const textSpan = textRef.current
      if (!cursor || !textSpan || !target) return

      const shouldHide = Boolean(
        target.closest(
          'header, nav, input, textarea, select, [contenteditable="true"], [role="dialog"], dialog, [data-no-cursor], [data-cursor-hide]'
        )
      )

      if (shouldHide) {
        if (currentMode !== 'hidden') {
          currentMode = 'hidden'
          cursor.style.opacity = '0'
        }
        return
      }

      if (isVisibleRef.current && currentMode === 'hidden') {
        cursor.style.opacity = '1'
      }

      const textTarget = target.closest('[data-cursor-text]') as HTMLElement | null
      const clickableTarget = target.closest('a, button, [role="button"]')

      if (textTarget) {
        const text = textTarget.getAttribute('data-cursor-text') || ''
        if (currentMode !== 'text' || currentText !== text) {
          currentMode = 'text'
          currentText = text
          textSpan.textContent = text
          textSpan.className = 'font-mono text-[10px] font-bold tracking-wider uppercase whitespace-nowrap select-none'
          cursor.className =
            'fixed top-0 left-0 pointer-events-none z-50 will-change-transform flex items-center justify-center px-3.5 py-1.5 rounded-full bg-foreground text-page shadow-lg transition-[width,height,padding,background-color] duration-75 ease-out'
        }
      } else if (clickableTarget) {
        if (currentMode !== 'link') {
          currentMode = 'link'
          currentText = ''
          textSpan.textContent = ''
          textSpan.className = 'hidden'
          cursor.className =
            'fixed top-0 left-0 pointer-events-none z-50 will-change-transform flex items-center justify-center w-10 h-10 rounded-full border border-foreground/60 bg-foreground/10 backdrop-blur-[2px] transition-[width,height,padding,background-color] duration-75 ease-out'
        }
      } else {
        if (currentMode !== 'dot') {
          currentMode = 'dot'
          currentText = ''
          textSpan.textContent = ''
          textSpan.className = 'hidden'
          cursor.className =
            'fixed top-0 left-0 pointer-events-none z-50 will-change-transform flex items-center justify-center w-3 h-3 rounded-full bg-foreground transition-[width,height,padding,background-color] duration-75 ease-out'
        }
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      lastPointer.current = { x: e.clientX, y: e.clientY }
      targetPos.current = { x: e.clientX, y: e.clientY }

      if (!isVisibleRef.current && cursorRef.current) {
        isVisibleRef.current = true
        cursorRef.current.style.opacity = '1'
      }

      updateState(e.target as HTMLElement | null)
    }

    const handlePointerOver = (e: PointerEvent) => {
      lastPointer.current = { x: e.clientX, y: e.clientY }
      targetPos.current = { x: e.clientX, y: e.clientY }
      updateState(e.target as HTMLElement | null)
    }

    const handleScroll = () => {
      if (lastPointer.current.x < 0 || lastPointer.current.y < 0) return
      const el = document.elementFromPoint(lastPointer.current.x, lastPointer.current.y) as HTMLElement | null
      if (el) updateState(el)
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

    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0

    // Ultra-snappy tracking loop (Apple fluid response - speed of light)
    const render = () => {
      const ease = 0.42
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease

      if (cursorRef.current) {
        const x = currentPos.current.x.toFixed(2)
        const y = currentPos.current.y.toFixed(2)
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }

      // Continuously synchronize element under pointer during smooth scroll inertia frames
      if (window.scrollY !== lastScrollY && lastPointer.current.x >= 0) {
        lastScrollY = window.scrollY
        const el = document.elementFromPoint(lastPointer.current.x, lastPointer.current.y) as HTMLElement | null
        if (el) updateState(el)
      }

      rafId.current = requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerover', handlePointerOver, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    rafId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 opacity-0 will-change-transform flex items-center justify-center w-3 h-3 rounded-full bg-foreground select-none"
      aria-hidden="true"
    >
      <span ref={textRef} className="hidden" />
    </div>
  )
}
