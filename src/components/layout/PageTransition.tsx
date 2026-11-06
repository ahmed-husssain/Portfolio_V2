import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { sound } from '../../lib/sound/soundEngine'

interface PageTransitionProps {
  children: React.ReactNode
}

/**
 * Subtle page-entry transition wrapper.
 * Applies a 220ms ease-out fade/translate on route changes and triggers
 * whisper-quiet tactile sound on page navigation.
 * Bypasses cleanly when prefers-reduced-motion is active.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    sound.playTap()
  }, [location.pathname])

  return (
    <div key={location.pathname} className="animate-page-in">
      {children}
    </div>
  )
}
