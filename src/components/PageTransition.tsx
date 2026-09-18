import React from 'react'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: React.ReactNode
}

/**
 * Subtle page-entry transition wrapper.
 * Applies a 220ms ease-out fade/translate on route changes.
 * Bypasses cleanly when prefers-reduced-motion is active.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  return (
    <div key={location.pathname} className="animate-page-in">
      {children}
    </div>
  )
}
