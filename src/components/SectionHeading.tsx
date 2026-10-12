import ScrambleText from './ScrambleText'

interface SectionHeadingProps {
  index?: string
  title: string
  subtitle?: string
  meta?: string
  className?: string
  scramble?: boolean
}

export default function SectionHeading({
  index,
  title,
  subtitle,
  meta,
  className = '',
  scramble = true,
}: SectionHeadingProps) {
  return (
    <div className={`mb-8 sm:mb-10 md:mb-12 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-border pb-4 gap-2">
        <div className="flex items-baseline gap-3">
          {index && (
            <span className="text-micro-caps text-muted">
              {index}
            </span>
          )}
          {scramble ? (
            <ScrambleText
              text={title}
              as="h2"
              className="text-title-1 text-foreground"
            />
          ) : (
            <h2 className="text-title-1 text-foreground">
              {title}
            </h2>
          )}
        </div>
        {meta && (
          <span className="text-micro-caps text-muted">
            {meta}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-body-lead text-secondary mt-3.5 max-w-[680px]">
          {subtitle}
        </p>
      )}
    </div>
  )
}

