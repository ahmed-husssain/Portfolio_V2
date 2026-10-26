import { useEffect } from 'react'
import { Close } from 'pixelarticons/react'

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !src) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Image zoom preview'}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-200 animate-backdrop-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 max-w-5xl w-full max-h-[92vh] flex flex-col bg-surface border border-border-strong rounded-sm overflow-hidden shadow-2xl pixel-corners transition-all duration-200 animate-lightbox-in">
        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface-subtle/80 border-b border-border text-xs font-mono shrink-0">
          <div className="flex items-center gap-2 text-muted truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-foreground font-semibold uppercase tracking-wider">DIAGRAM INSPECTOR</span>
            <span className="text-border-strong hidden sm:inline">·</span>
            <span className="text-secondary truncate hidden sm:inline">{alt || 'Full Resolution View'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-secondary hover:text-foreground hover:bg-page border border-transparent hover:border-border rounded-2xs active:scale-[0.96] transition-all cursor-pointer"
            title="Close (Esc)"
          >
            <Close className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
            <span className="hidden sm:inline">ESC</span>
          </button>
        </div>

        {/* Image Content Area */}
        <div
          className="p-3 sm:p-6 overflow-auto flex items-center justify-center bg-black/40 min-h-[240px] max-h-[75vh]"
          onClick={onClose}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xs border border-border/50 shadow-lg cursor-zoom-out"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Bottom Caption Bar */}
        {caption && (
          <div className="px-4 py-2.5 bg-page/90 border-t border-border text-center text-xs font-mono text-muted shrink-0">
            {caption}
          </div>
        )}
      </div>
    </div>
  )
}
