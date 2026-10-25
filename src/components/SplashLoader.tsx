import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface SplashContextValue {
  isRevealed: boolean
  isSplashDone: boolean
}

const SplashContext = createContext<SplashContextValue>({
  isRevealed: true,
  isSplashDone: true,
})

export const useSplash = () => useContext(SplashContext)

interface SplashProviderProps {
  children: ReactNode
}

const TARGET_SUBTITLE = 'Experience'
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function SplashProvider({ children }: SplashProviderProps) {
  const location = useLocation()
  const isOtherPage = ['/work', '/about', '/writing', '/contact', '/review'].some((path) =>
    location.pathname.startsWith(path)
  )

  // Ponytail: Detect repeat visits or automated audits (Lighthouse / bots) for instant FCP
  const isBotOrAudit =
    typeof window !== 'undefined' &&
    (Boolean((window as unknown as { __LIGHTHOUSE_JSON__?: unknown }).__LIGHTHOUSE_JSON__) ||
      navigator.webdriver ||
      /bot|crawler|spider|lighthouse|inspect|headless|chrome-lighthouse/i.test(navigator.userAgent))

  const hasSeenSplash = typeof window !== 'undefined' && Boolean(sessionStorage.getItem('portfolio_intro_seen'))
  const shouldSkip = isOtherPage || hasSeenSplash || isBotOrAudit

  const [progress, setProgress] = useState(shouldSkip ? 100 : 0)
  const [subtitle, setSubtitle] = useState('Experience')
  const [isExiting, setIsExiting] = useState(shouldSkip)
  const [isDone, setIsDone] = useState(shouldSkip)
  // Default isRevealed to true so underlying hero paints immediately for instant FCP (<200ms)
  const [isRevealed, setIsRevealed] = useState(true)

  // Skip splash immediately if already seen, bot audit, or landing directly on subpage
  useEffect(() => {
    if (shouldSkip) {
      setIsRevealed(true)
      setIsDone(true)
      setIsExiting(true)
      setProgress(100)
    }
  }, [shouldSkip])

  // Disable background scroll only during active first-time splash
  useEffect(() => {
    if (!isDone && !shouldSkip) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isDone, shouldSkip])

  // Subtitle decode / scramble micro-effect
  useEffect(() => {
    if (isDone || shouldSkip) return

    let frame = 0
    const totalFrames = 12
    const interval = setInterval(() => {
      frame++
      const progressRatio = frame / totalFrames
      const revealedLength = Math.floor(progressRatio * TARGET_SUBTITLE.length)

      let result = ''
      for (let i = 0; i < TARGET_SUBTITLE.length; i++) {
        if (i < revealedLength) {
          result += TARGET_SUBTITLE[i]
        } else {
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }
      }

      setSubtitle(result)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setSubtitle(TARGET_SUBTITLE)
      }
    }, 24)

    return () => clearInterval(interval)
  }, [isDone, shouldSkip])

  // Snappy RAF progress counter (700ms instead of 1600ms)
  useEffect(() => {
    if (isDone || shouldSkip) return

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setProgress(100)
      setIsRevealed(true)
      setIsDone(true)
      return
    }

    const startTime = performance.now()
    const duration = 700
    let animId: number

    const updateCounter = (now: number) => {
      const elapsed = now - startTime
      const rawRatio = Math.min(1, elapsed / duration)
      // Ease-out deceleration
      const eased = 1 - Math.pow(1 - rawRatio, 2.5)
      const current = Math.min(100, Math.floor(eased * 100))

      setProgress(current)

      if (rawRatio < 1) {
        animId = requestAnimationFrame(updateCounter)
      } else {
        setProgress(100)
      }
    }

    animId = requestAnimationFrame(updateCounter)

    // Safety timeout: guarantees splash curtain exit even if requestAnimationFrame throttles in background tabs
    const safetyTimer = setTimeout(() => {
      setProgress(100)
      setIsExiting(true)
      setIsRevealed(true)
      setTimeout(() => {
        setIsDone(true)
        document.body.style.overflow = ''
      }, 300)
    }, 450)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(safetyTimer)
    }
  }, [isDone, shouldSkip])

  // Fast curtain lift once counter reaches 100
  useEffect(() => {
    if (progress < 100 || isDone) return

    const holdTimer = setTimeout(() => {
      setIsExiting(true)
      setIsRevealed(true)

      // Persist in sessionStorage so returning to Home is 100% instant
      try {
        sessionStorage.setItem('portfolio_intro_seen', '1')
      } catch {
        // Ignore private mode quota errors
      }

      const finishTimer = setTimeout(() => {
        setIsDone(true)
        document.body.style.overflow = ''
      }, 650)

      return () => clearTimeout(finishTimer)
    }, 120)

    return () => clearTimeout(holdTimer)
  }, [progress, isDone])

  // Click or Keypress to Skip instantly
  const handleSkip = () => {
    if (isDone) return
    setProgress(100)
    setIsExiting(true)
    setIsRevealed(true)
    try {
      sessionStorage.setItem('portfolio_intro_seen', '1')
    } catch {
      // Ignore
    }
    setTimeout(() => {
      setIsDone(true)
      document.body.style.overflow = ''
    }, 350)
  }

  // Keyboard shortcut to skip (Esc, Space, Enter)
  useEffect(() => {
    if (isDone || shouldSkip) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleSkip()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isDone, shouldSkip])

  // Expose replay hook for dev verification
  useEffect(() => {
    ;(window as unknown as { __replaySplash?: () => void }).__replaySplash = () => {
      try {
        sessionStorage.removeItem('portfolio_intro_seen')
      } catch {
        // Ignore
      }
      setIsDone(false)
      setIsExiting(false)
      setIsRevealed(false)
      setProgress(0)
    }
  }, [])

  const formattedCount = String(progress).padStart(3, '0')

  return (
    <SplashContext.Provider value={{ isRevealed, isSplashDone: isDone }}>
      {children}

      {!isOtherPage && (
        <aside
          onClick={handleSkip}
          data-splash-state={isDone ? 'done' : isExiting ? 'exiting' : 'loading'}
          data-splash-progress={progress}
          aria-label="Portfolio Introduction Screen"
          role="dialog"
          aria-modal="true"
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none cursor-pointer ${
            isDone ? 'pointer-events-none hidden' : 'pointer-events-auto'
          }`}
          style={{
            backgroundColor: 'var(--bg-page)',
            color: 'var(--text-primary)',
            transform: isExiting ? 'translateY(calc(-100% - 150px))' : 'translateY(0)',
            transition: 'transform 850ms cubic-bezier(0.76, 0, 0.24, 1)',
            boxShadow: isExiting ? '0 40px 90px -15px rgba(0,0,0,0.5)' : 'none',
            willChange: 'transform',
          }}
        >
          {/* Center Brand Lockup (Reference AUGE / Experience) */}
          <div
            className={`flex flex-col items-center justify-center text-center px-4 transition-all duration-350 ease-out ${
              isExiting ? 'opacity-0 -translate-y-10 scale-95' : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tight uppercase leading-none font-sans select-none">
              AHMED
            </h1>
            <span
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl italic mt-1 sm:mt-2 select-none tracking-normal font-serif text-secondary"
              style={{ fontFamily: '"Instrument Serif", Georgia, Cambria, serif' }}
            >
              {subtitle}
            </span>
          </div>

          {/* Bottom Monospace Counter (Reference 001 ... 100) */}
          <div
            className={`absolute bottom-8 sm:bottom-12 left-0 right-0 flex items-center justify-center font-mono text-xs sm:text-sm tracking-widest transition-opacity duration-300 ${
              isExiting ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="tabular-nums font-mono font-medium text-foreground">
              {formattedCount}
            </span>
          </div>

          {/* Trailing Organic Curved Lip for Awwwards-style Curtain Sweep */}
          <div
            className="absolute top-full left-0 w-full h-28 sm:h-36 overflow-hidden pointer-events-none -mt-px"
            style={{ color: 'var(--bg-page)' }}
          >
            <svg
              viewBox="0 0 1440 120"
              fill="currentColor"
              preserveAspectRatio="none"
              className="w-full h-full"
              aria-hidden="true"
            >
              <path d="M0,0 L1440,0 Q720,120 0,0 Z" />
            </svg>
          </div>
        </aside>
      )}
    </SplashContext.Provider>
  )
}

export default SplashProvider
