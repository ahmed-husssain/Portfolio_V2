import type { ReactNode } from 'react'
import { WarningDiamond } from 'pixelarticons/react'

interface FormAlertProps {
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export default function FormAlert({
  children,
  icon = <WarningDiamond className="w-4 h-4 text-foreground shrink-0 mt-0.5 pixel-icon" aria-hidden="true" />,
  className = '',
}: FormAlertProps) {
  return (
    <div
      role="alert"
      className={`p-4 mb-6 border border-border bg-page text-foreground text-xs sm:text-sm rounded-sm flex items-start gap-2.5 animate-page-in pixel-corners ${className}`}
    >
      {icon}
      <span>{children}</span>
    </div>
  )
}
