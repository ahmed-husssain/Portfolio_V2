import { useEffect } from 'react'
import { X } from 'lucide-react'
import ArchitectureVisualizer from './ArchitectureVisualizer'

interface ArchitectureModalProps {
  isOpen: boolean
  onClose: () => void
  projectSlug?: string
  initialFlowId?: string
}

export default function ArchitectureModal({
  isOpen,
  onClose,
  projectSlug = 'online-art-gallery',
  initialFlowId,
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

  const isShifa = projectSlug === 'shifamanagement' || initialFlowId === 'shifa-architecture'
  const title = isShifa ? 'SHIFA HEALTHCARE ARCHITECTURE' : 'GALLREX LIVE ARCHITECTURE'
  const subtitle = isShifa ? 'ATOMIC BILLING & RLS SECURITY ENGINE' : 'CONCURRENCY & WEBSOCKET ENGINE'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card - 100% fits on screen, zero scrollbars on desktop/tablet, smooth scroll if small phone */}
      <div className="relative w-full max-w-3xl bg-surface border border-border-strong rounded-sm shadow-2xl z-10 overflow-hidden flex flex-col max-h-[96dvh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 sm:px-5 border-b border-border bg-surface-subtle/70 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-foreground font-bold tracking-tight truncate">{title}</span>
            <span className="text-border-strong hidden sm:inline">|</span>
            <span className="text-muted hidden sm:inline text-[11px] truncate">{subtitle}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xs border border-border text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visualizer Content */}
        <div className="overflow-y-auto sm:overflow-hidden flex-1">
          <ArchitectureVisualizer projectSlug={projectSlug} initialFlowId={initialFlowId} />
        </div>
      </div>
    </div>
  )
}
