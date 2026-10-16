import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  id?: string
  as?: React.ElementType
}

export default function Container({
  children,
  className = '',
  id,
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component
      id={id}
      className={`max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 ${className}`}
    >
      {children}
    </Component>
  )
}
