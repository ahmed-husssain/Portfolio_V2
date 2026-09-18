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
    <div className={`mb-12 md:mb-16 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-border pb-4 gap-2">
        <div className="flex items-baseline gap-3">
          {index && (
            <span className="font-mono text-xs text-muted tracking-wider">
              {index}
            </span>
          )}
          {scramble ? (
            <ScrambleText
              text={title}
              as="h2"
              className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground"
            />
          ) : (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          )}
        </div>
        {meta && (
          <span className="font-mono text-xs text-muted tracking-wider">
            {meta}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-secondary text-sm md:text-base mt-4 max-w-[640px] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

