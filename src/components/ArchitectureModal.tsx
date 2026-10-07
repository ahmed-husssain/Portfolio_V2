import { useEffect } from 'react'
import { X } from 'lucide-react'
import ArchitectureVisualizer from './ArchitectureVisualizer'

interface ArchitectureModalProps {
  isOpen: boolean
  onClose: () => void
  initialFlowId?: string
}

export default function ArchitectureModal({
  isOpen,
  onClose,
  initialFlowId = 'auction-concurrency',
}: ArchitectureModalProps) {
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-surface border border-border-strong rounded-sm shadow-2xl overflow-y-auto z-10 flex flex-col">
        {/* Sticky Close Button Bar */}
        <div className="sticky top-0 right-0 z-20 flex justify-between items-center px-5 py-3 bg-surface/95 backdrop-blur-sm border-b border-border">
          <div className="text-xs font-mono text-muted uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>INTERACTIVE ARCHITECTURE INSPECTOR // GALLREX</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm border border-border text-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
            aria-label="Close architecture modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visualizer Body */}
        <div className="p-2 sm:p-4">
          <ArchitectureVisualizer initialFlowId={initialFlowId} />
        </div>
      </div>
    </div>
  )
}
