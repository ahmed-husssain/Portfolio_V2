import { useState } from 'react'
import { Check, Copy } from 'pixelarticons/react'

interface CopyButtonProps {
  text: string
  label?: string
  copiedLabel?: string
  className?: string
  title?: string
}

export default function CopyButton({
  text,
  label = 'COPY',
  copiedLabel = 'COPIED',
  className = 'shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 border border-border bg-page text-foreground text-xs font-mono rounded-sm hover:border-border-strong transition-colors cursor-pointer',
  title = 'Copy to clipboard',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={title}
      className={className}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-foreground pixel-icon" aria-hidden="true" />
          {copiedLabel && <span className="text-[11px]">{copiedLabel}</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-muted pixel-icon" aria-hidden="true" />
          {label && <span className="text-[11px]">{label}</span>}
        </>
      )}
    </button>
  )
}
