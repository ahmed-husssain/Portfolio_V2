import { useEffect, useState, useRef, useCallback } from 'react'
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

  const handleClose = useCallback(() => {
    setActive(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      onClose()
      setMounted(false)
    }, 200)
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setMounted(true)
      document.body.style.overflow = 'hidden'
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
        document.body.style.overflow = 'unset'
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mounted) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mounted, handleClose])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!mounted || !src) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Image zoom preview'}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 cursor-zoom-out select-none"
      onClick={handleClose}
    >
      {/* Immersive Dark Backdrop with fluid opacity transition */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-200 ease-out ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Floating Minimalist Close Button */}
      <button
        type="button"
        onClick={handleClose}
        className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-200 active:scale-95 cursor-pointer shadow-lg ${
          active ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        title="Close (Esc)"
        aria-label="Close image preview"
      >
        <X className="w-5 h-5 stroke-[1.75]" aria-hidden="true" />
      </button>

      {/* Hero Image — Zero Box Framing, Zero Chrome, Maximum Optical Room */}
      <div
        className={`relative z-10 max-w-full max-h-full flex items-center justify-center transition-all duration-250 pointer-events-auto ${
          active ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={handleClose}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] sm:max-h-[90vh] max-w-[94vw] w-auto h-auto object-contain rounded-md shadow-2xl drop-shadow-2xl cursor-zoom-out"
        />
      </div>

      {/* Floating Minimalist Caption (Subtle floating pill, no slicing borders) */}
      {caption && (
        <div
          className={`absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-[90vw] px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white/80 text-xs font-mono text-center truncate pointer-events-none transition-all duration-200 shadow-lg ${
            active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {caption}
        </div>
      )}
    </div>
  )
}
