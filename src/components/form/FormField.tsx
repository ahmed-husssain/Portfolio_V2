import type { ReactNode } from 'react'

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  counter?: ReactNode
  children: ReactNode
  className?: string
}

export default function FormField({
  id,
  label,
  required,
  error,
  counter,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <label
          htmlFor={id}
          className="block text-xs font-mono text-foreground font-medium uppercase tracking-wider"
        >
          {label} {required && '*'}
        </label>
        {counter}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-mono text-secondary animate-page-in">
          {error}
        </p>
      )}
    </div>
  )
}
