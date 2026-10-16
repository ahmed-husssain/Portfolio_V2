import { ArrowRight } from 'pixelarticons/react'

interface SubmitButtonProps {
  loading: boolean
  label: string
  loadingLabel?: string
  disabled?: boolean
  className?: string
}

export default function SubmitButton({
  loading,
  label,
  loadingLabel = 'TRANSMITTING...',
  disabled,
  className = 'group w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-foreground text-page text-xs font-mono font-semibold uppercase tracking-wider rounded-sm hover:bg-secondary active:scale-[0.98] transition-all duration-150 disabled:opacity-60 cursor-pointer shadow-xs',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={className}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-page border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 pixel-icon" aria-hidden="true" />
        </>
      )}
    </button>
  )
}
