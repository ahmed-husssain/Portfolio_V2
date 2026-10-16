import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow: ReactNode
  title: ReactNode
  description?: ReactNode
  metaRight?: ReactNode
  className?: string
  titleSize?: 'display' | 'title-1'
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  metaRight,
  className = 'mb-10 sm:mb-14 pb-8 border-b border-border',
  titleSize = 'title-1',
}: PageHeaderProps) {
  const titleClass = titleSize === 'display' ? 'text-display' : 'text-title-1'

  return (
    <header className={className}>
      <div className="flex flex-wrap items-center justify-between gap-y-2 text-micro-caps text-muted mb-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">{eyebrow}</div>
        {metaRight && <div className="flex items-center gap-2 text-secondary">{metaRight}</div>}
      </div>

      <h1 className={`${titleClass} text-foreground mb-4 sm:mb-5 max-w-3xl`}>
        {title}
      </h1>

      {description && (
        <p className="text-body-lead text-secondary max-w-3xl font-normal leading-relaxed">
          {description}
        </p>
      )}
    </header>
  )
}
