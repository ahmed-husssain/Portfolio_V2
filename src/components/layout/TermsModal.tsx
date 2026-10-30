import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Close, Gift } from 'pixelarticons/react'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        ;(window as any).__lenis.stop()
      }
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        ;(window as any).__lenis.start()
      }
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[99998] flex items-end justify-center p-3 sm:p-6 pointer-events-none">
      {/* Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Center Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terms and Conditions"
        data-no-cursor
        className="relative w-full max-w-lg bg-surface border border-border-strong rounded-sm shadow-2xl p-5 sm:p-6 z-10 pointer-events-auto pixel-corners animate-bottom-sheet max-h-[90dvh] overflow-y-auto"
      >
        {/* Top Bar: Protocol Tag + Close Button */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-2 text-[11px] font-mono text-muted uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-emerald-500 pixel-icon" aria-hidden="true" />
            <span>TERMS & CONDITIONS // SECTION 01</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground transition-colors rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
            aria-label="Close Terms"
          >
            <Close className="w-4 h-4 pixel-icon" />
          </button>
        </div>

        {/* Header & Cookie Message */}
        <div className="space-y-1.5 mb-4">
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <span>You deserve a cookie.</span>
            <span role="img" aria-label="cookie" className="text-xl">🍪</span>
          </h3>
          <p className="text-xs text-secondary leading-relaxed font-sans">
            Official browsing terms for reaching the bottom of this portfolio:
          </p>
        </div>

        {/* Humorous Clauses */}
        <div className="space-y-2.5 text-xs font-mono border border-border bg-page p-3.5 rounded-xs text-muted mb-5">
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold shrink-0">01.</span>
            <p className="text-secondary leading-relaxed font-sans">
              <strong className="text-foreground font-mono font-semibold">Endurance Reward:</strong> By scrolling past all the case studies, architecture diagrams, and stack specs to reach this footer, you have earned this virtual chocolate chip cookie.
            </p>
          </div>

          <div className="flex items-start gap-2 border-t border-border/50 pt-2">
            <span className="text-emerald-500 font-bold shrink-0">02.</span>
            <p className="text-secondary leading-relaxed font-sans">
              <strong className="text-foreground font-mono font-semibold">Zero Telemetry:</strong> No tracking scripts, marketing pixels, or third-party cookies were installed on your browser. Your visit is completely private.
            </p>
          </div>

          <div className="flex items-start gap-2 border-t border-border/50 pt-2">
            <span className="text-emerald-500 font-bold shrink-0">03.</span>
            <p className="text-secondary leading-relaxed font-sans">
              <strong className="text-foreground font-mono font-semibold">Bug Indemnity:</strong> In the rare event you spot a visual glitch, it is legally recognized as an undocumented experimental aesthetic choice.
            </p>
          </div>

          <div className="flex items-start gap-2 border-t border-border/50 pt-2">
            <span className="text-emerald-500 font-bold shrink-0">04.</span>
            <p className="text-secondary leading-relaxed font-sans">
              <strong className="text-foreground font-mono font-semibold">Binding Clause:</strong> You are hereby legally required to drink some water and have a great rest of your day.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 text-xs font-mono">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-foreground text-page font-semibold rounded-xs hover:bg-secondary active:scale-[0.98] transition-all text-center select-none"
          >
            ACCEPT COOKIE & CLOSE
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
