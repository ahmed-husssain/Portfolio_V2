import React from 'react'
import { ArrowUpRight } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: boolean
  className?: string
  children: React.ReactNode
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
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-6 py-3 text-sm',
  }

  const variantStyles = {
    primary:
      'bg-accent-bg text-accent-text border border-transparent hover:opacity-90 active:scale-[0.99]',
    secondary:
      'bg-surface text-foreground border border-border hover:bg-surface-hover hover:border-border-strong active:scale-[0.99]',
    outline:
      'bg-transparent text-foreground border border-border hover:border-border-strong hover:bg-surface active:scale-[0.99]',
    link:
      'p-0 text-foreground underline-offset-4 hover:underline border-none bg-transparent',
  }

  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-mono tracking-wider uppercase font-medium rounded-sm transition-all duration-150 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const combinedClasses = `${baseStyles} ${
    variant === 'link' ? variantStyles.link : `${sizeStyles[size]} ${variantStyles[variant]}`
  } ${className}`

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </>
  )

  if (href !== undefined) {
    return (
      <a
        href={href}
        className={`group ${combinedClasses}`}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      className={`group ${combinedClasses}`}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  )
}
