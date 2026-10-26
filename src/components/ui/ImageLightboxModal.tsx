import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ImageLightboxModalProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt?: string
  caption?: string
}

export default function ImageLightboxModal({
  isOpen,
  onClose,
  src,
  alt = '',
  caption,
}: ImageLightboxModalProps) {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fluid dismiss with Apple-style exit transition
  const handleClose = useCallback(() => {
    setActive(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      onClose()
      setMounted(false)
    }, 180)
  }, [onClose])

  // Mount, scroll lock, Lenis lock, and animation trigger
  useEffect(() => {
    if (isOpen) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setMounted(true)

      // 1. Pause Lenis smooth scrolling if active
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        ;(window as any).__lenis.stop()
      }

      // 2. Lock browser window and touch scrolling
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'

      // 3. Trigger fluid entrance animation on next animation frame
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setActive(true)
        })
        return () => cancelAnimationFrame(raf2)
      })
      return () => cancelAnimationFrame(raf1)
    } else {
      setActive(false)
      const timer = setTimeout(() => {
        setMounted(false)
        if (typeof window !== 'undefined' && (window as any).__lenis) {
          ;(window as any).__lenis.start()
        }
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        document.body.style.touchAction = ''
      }, 180)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // ESC keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mounted) {
        e.preventDefault()
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mounted, handleClose])

  // Failsafe cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        ;(window as any).__lenis.start()
      }
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!mounted || !src || typeof document === 'undefined') return null

  const displayTitle = alt || caption || 'Architecture Diagram'

  // Portal directly to document.body: completely escapes transformed parent containers and Lenis wrappers
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={displayTitle}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 select-none cursor-zoom-out"
      onClick={handleClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* 1. Immersive Apple-Grade Scrim Backdrop */}
      <div
        className={`fixed inset-0 bg-neutral-950/92 backdrop-blur-2xl transition-opacity duration-200 ease-out ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* 2. Floating Top Chrome Island (macOS Preview / QuickLook style) */}
      <header
        className={`relative z-20 flex items-center justify-between max-w-3xl w-full px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-200 cursor-default ${
          active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span className="text-white/90 text-xs font-mono font-medium tracking-tight truncate">
            {displayTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono tracking-wider text-white/50 bg-white/5 rounded border border-white/10">
            ESC
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all active:scale-90 cursor-pointer"
            title="Close viewer (Esc)"
            aria-label="Close viewer"
          >
            <X className="w-4 h-4 stroke-[2]" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* 3. Hero Diagram Image (Centered in Viewport, Maximum Optical Room) */}
      <main
        className={`relative z-10 flex-1 w-full flex items-center justify-center py-2 sm:py-4 transition-all duration-250 pointer-events-auto ${
          active ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.95]'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={handleClose}
      >
        <img
          src={src}
          alt={alt || displayTitle}
          className="max-h-[78vh] sm:max-h-[82vh] max-w-[94vw] w-auto h-auto object-contain rounded-xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] cursor-zoom-out"
        />
      </main>

      {/* 4. Floating Minimal Bottom Telemetry Pill */}
      <footer
        className={`relative z-20 px-4 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-white/10 text-white/70 text-xs font-mono text-center max-w-[90vw] truncate shadow-2xl pointer-events-none transition-all duration-200 ${
          active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        {caption || 'Click anywhere or press Esc to return'}
      </footer>
    </div>,
    document.body
  )
}
