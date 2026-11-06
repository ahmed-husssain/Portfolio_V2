import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'status'
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  if (variant === 'status') {
    return (
      <span className={`text-blue-600 dark:text-blue-400 font-semibold inline-flex items-center gap-1.5 shrink-0 ${className}`}>
        <span className="pixel-beacon" aria-hidden="true" />
        {children}
      </span>
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xs border border-border bg-surface text-micro-caps text-secondary shadow-2xs pixel-corners ${className}`}
      style={{ boxShadow: 'var(--hairline-top)' }}
    >
      {children}
    </div>
  )
}
