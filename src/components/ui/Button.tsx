import React, { useState, useCallback } from 'react'
import { ExternalLink } from 'pixelarticons/react'
import { useMagneticHover } from '../../hooks/useMagneticHover'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: boolean
  className?: string
  children: React.ReactNode
  /** Enables magnetic cursor gravity on this button */
  magnetic?: boolean
}

type ButtonAsButton = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonAsLink = BaseButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export default function Button({
  variant = 'primary',
  size = 'md',
  icon = false,
  className = '',
  children,
  href,
  magnetic = true,
  ...props
}: ButtonProps) {
  const magnetRef = useMagneticHover(0.24)
  const [isHovered, setIsHovered] = useState(false)
  const [exitDirection, setExitDirection] = useState<'top' | 'bottom'>('bottom')

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-6 py-3 text-sm',
  }

  const variantStyles = {
    primary:
      'bg-accent-bg text-accent-text border border-transparent shadow-2xs',
    secondary:
      'bg-surface text-foreground border border-border shadow-2xs',
    outline:
      'bg-transparent text-foreground border border-border shadow-2xs',
    link:
      'p-0 text-foreground underline-offset-4 hover:underline border-none bg-transparent',
  }

  const isLink = variant === 'link'

  const baseStyles = isLink
    ? 'inline-flex items-center justify-center gap-2 font-mono tracking-wider uppercase font-medium focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none'
    : 'relative inline-flex items-center justify-center gap-2 font-mono tracking-wider uppercase font-medium rounded-xs border overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none transition-transform duration-100 ease-out active:scale-[0.97] group whitespace-nowrap'

  const combinedClasses = `${baseStyles} ${
    isLink ? variantStyles.link : `${sizeStyles[size]} ${variantStyles[variant]}`
  } ${className}`

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const fromTop = e.clientY - rect.top < rect.height / 2
    setExitDirection(fromTop ? 'top' : 'bottom')
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const toTop = e.clientY < rect.top + rect.height / 2
    setExitDirection(toTop ? 'top' : 'bottom')
    setIsHovered(false)
  }, [])

  const isPrimary = variant === 'primary'

  const content = (
    <>
      {/* ── Theme-Matched #EDEDED Liquid Bubble Fill Layer ── */}
      {!isLink && (
        <span
          className={`absolute -inset-x-4 -top-8 -bottom-8 rounded-[50%] pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            isPrimary
              ? 'bg-[#18181B] dark:bg-[#18181B]'
              : 'bg-[#EDEDED] dark:bg-[#EDEDED]'
          }`}
          style={{
            transform: isHovered
              ? 'translate3d(0, 0, 0)'
              : exitDirection === 'top'
                ? 'translate3d(0, -115%, 0)'
                : 'translate3d(0, 115%, 0)',
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Text and Icon Content ── */}
      <span
        className={`relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-200 ${
          !isLink
            ? isPrimary
              ? 'group-hover:text-white dark:group-hover:text-[#EDEDED] font-semibold'
              : 'group-hover:text-black dark:group-hover:text-[#09090B] font-semibold'
            : ''
        }`}
      >
        {children}
        {icon && (
          <ExternalLink
            className="w-3.5 h-3.5 pixel-icon transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
            aria-hidden="true"
          />
        )}
      </span>
    </>
  )

  if (href !== undefined) {
    return (
      <a
        href={href}
        ref={magnetic ? (magnetRef as unknown as React.RefObject<HTMLAnchorElement>) : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={combinedClasses}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={magnetic ? (magnetRef as unknown as React.RefObject<HTMLButtonElement>) : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={combinedClasses}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  )
}
