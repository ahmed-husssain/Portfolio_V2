import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'pixelarticons/react'
import Reveal from '../motion/Reveal'

export interface ContinuityBridgeProps {
  kicker?: string
  title: string
  description: ReactNode
  to: string
  actionLabel?: string
  className?: string
}

export default function ContinuityBridge({
  kicker = 'NEXT',
  title,
  description,
  to,
  actionLabel = 'CONTINUE',
  className = 'mt-14 sm:mt-20',
}: ContinuityBridgeProps) {
  return (
    <Reveal className={className}>
      <nav aria-label="Next Chapter Navigation">
        <Link
          to={to}
          className="group block p-6 sm:p-8 rounded-xs border border-border bg-surface hover:border-border-strong active:scale-[0.99] transition-[border-color,transform] hairline-card pixel-corners"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2 text-micro-caps text-muted font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="text-foreground font-semibold">{kicker}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight group-hover:text-secondary transition-colors">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-sans">
                {description}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-micro-caps font-semibold text-foreground group-hover:translate-x-1 transition-transform self-start sm:self-center shrink-0 border border-border bg-page px-3.5 py-2 rounded-xs">
              <span>{actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
            </div>
          </div>
        </Link>
      </nav>
    </Reveal>
  )
}
