import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Briefcase, User, BookOpen, Mail } from 'pixelarticons/react'
import ThemeToggle from '../ui/ThemeToggle'
import { NAV_ITEMS } from '../../data/navigation'
import { CONTACT_CONFIG } from '../../data/contact'

// Map each nav route to its prefix (word minus last letter) and pixelify icon
const NAV_ICON_MAP: Record<
  string,
  { prefix: string; icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }> }
> = {
  '/work': { prefix: 'Wor', icon: Briefcase },
  '/about': { prefix: 'Abou', icon: User },
  '/writing': { prefix: 'Writin', icon: BookOpen },
  '/contact': { prefix: 'Contac', icon: Mail },
}

// Stable module-level nav links list to prevent infinite render loops
const NAV_LINKS = NAV_ITEMS.filter((item) => item.href !== '/')

// Reusable native magnetic wrapper for floating action buttons
function MagneticItem({
  children,
  className = '',
  strength = 0.35,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const isHovered = useRef(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength
    setOffset({ x, y })
  }

  const handleMouseEnter = () => {
    isHovered.current = true
  }

  const handleMouseLeave = () => {
    isHovered.current = false
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-block will-change-transform ${className}`}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition:
          offset.x === 0 && offset.y === 0
            ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // ─── Razor-thin Kinetic Gliding Underline State (Zero Boxes) ───
  const [underline, setUnderline] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  })
  const navContainerRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<Map<string, HTMLAnchorElement>>(new Map())

  const isActiveRoute = useCallback(
    (path: string) => {
      if (path === '/') return location.pathname === '/'
      return location.pathname.startsWith(path)
    },
    [location.pathname]
  )

  const updateUnderlineToActive = useCallback(() => {
    const activeItem = NAV_LINKS.find((item) => isActiveRoute(item.href))
    if (activeItem) {
      const el = linksRef.current.get(activeItem.href)
      const container = navContainerRef.current
      if (el && container) {
        const containerRect = container.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()
        setUnderline({
          left: elRect.left - containerRect.left,
          width: elRect.width,
          opacity: 1,
        })
        return
      }
    }
    setUnderline((prev) => ({ ...prev, opacity: 0 }))
  }, [isActiveRoute])

  useEffect(() => {
    updateUnderlineToActive()
  }, [updateUnderlineToActive])

  // Scroll listener for disappearing header & floating circle trigger
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      {/* ─── 1. TOP AMBIENT NAVIGATION (Zero Boxes, Pure Optical Alignment) ─── */}
      <header
        className={`fixed top-0 inset-x-0 z-40 px-6 sm:px-10 md:px-14 py-7 sm:py-8 flex items-center justify-between transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none select-none ${
          scrolled ? '-translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Left: Brand with Slower 750ms Horizontal Roll (Aligned to 32px h-8 baseline) */}
        <div className="pointer-events-auto flex items-center h-8">
          <Link
            to="/"
            className="group flex items-center gap-1.5 h-8 text-xs sm:text-sm font-medium tracking-tight text-foreground focus-visible:outline-none"
          >
            <span className="text-muted font-normal select-none flex items-center leading-none">©</span>
            <span className="relative inline-flex items-center overflow-hidden h-8 w-[136px]">
              {/* State 1: "Code by Ahmed" */}
              <span className="absolute inset-0 flex items-center whitespace-nowrap transition-transform duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[115%] will-change-transform leading-none">
                Code by Ahmed
              </span>
              {/* State 2: "Ahmed Hussain" */}
              <span className="absolute inset-0 flex items-center whitespace-nowrap font-semibold text-foreground transition-transform duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-[115%] group-hover:translate-x-0 will-change-transform leading-none">
                Ahmed Hussain
              </span>
            </span>
          </Link>
        </div>

        {/* Right: Pure Typographic Nav Links + Theme Toggle (Aligned to identical 32px h-8 baseline) */}
        <nav
          ref={navContainerRef}
          onMouseLeave={updateUnderlineToActive}
          className="hidden md:flex items-center h-8 gap-7 sm:gap-8 relative pointer-events-auto"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((item) => {
            const active = isActiveRoute(item.href)
            const iconConfig = NAV_ICON_MAP[item.href]
            const IconComponent = iconConfig?.icon

            return (
              <Link
                key={item.href}
                ref={(el) => {
                  if (el) linksRef.current.set(item.href, el)
                  else linksRef.current.delete(item.href)
                }}
                to={item.href}
                onMouseEnter={(e) => {
                  const container = navContainerRef.current
                  if (container) {
                    const containerRect = container.getBoundingClientRect()
                    const elRect = e.currentTarget.getBoundingClientRect()
                    setUnderline({
                      left: elRect.left - containerRect.left,
                      width: elRect.width,
                      opacity: 1,
                    })
                  }
                }}
                className={`group relative h-8 flex items-center text-xs sm:text-sm font-medium tracking-normal transition-colors duration-200 select-none cursor-pointer ${
                  active ? 'text-foreground font-semibold' : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                {/* Responsive Self-Sizing Mask Container */}
                <span className="relative inline-flex flex-col h-8 overflow-hidden justify-center leading-none">
                  {/* Invisible sizer row guarantees parent width perfectly accommodates widest state */}
                  <span
                    className="invisible h-0 overflow-hidden flex items-center select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    <span>{iconConfig?.prefix || item.label}</span>
                    <span className="w-4 h-4 ml-0.5 shrink-0" />
                  </span>

                  {/* State 1 (At rest): Clean full word */}
                  <span className="h-8 flex items-center whitespace-nowrap transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full motion-reduce:transition-none will-change-transform leading-none">
                    {item.label}
                  </span>

                  {/* State 2 (On hover): Prefix + Pixelify Icon replacing the trailing letter */}
                  <span className="absolute top-full left-0 h-8 flex items-center whitespace-nowrap transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full motion-reduce:transition-none will-change-transform font-semibold text-foreground leading-none">
                    {iconConfig && IconComponent ? (
                      <span className="inline-flex items-center">
                        <span>{iconConfig.prefix}</span>
                        <span className="w-4 h-4 inline-flex items-center justify-center shrink-0 ml-0.5">
                          <IconComponent className="w-3.5 h-3.5 pixel-icon text-foreground" aria-hidden="true" />
                        </span>
                      </span>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </span>
                </span>
              </Link>
            )
          })}

          <div className="pl-1 flex items-center h-8">
            <ThemeToggle />
          </div>

          {/* Razor-thin kinetic gliding underline (1.5px hairline, aligned to exact bottom of 32px line) */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 h-[1.5px] bg-foreground pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
            style={{
              transform: `translate3d(${underline.left}px, 0, 0)`,
              width: `${underline.width}px`,
              opacity: underline.opacity,
            }}
          />
        </nav>

        {/* Mobile Minimal Menu Trigger (At Top of Page) - Gracefully fades out when drawer is open */}
        <div
          className={`flex items-center gap-3 md:hidden pointer-events-auto h-8 transition-opacity duration-200 ${
            menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-foreground px-3.5 py-1.5 rounded-full border border-border bg-surface/90 hover:border-border-strong active:scale-95 transition-all shadow-2xs"
            style={{ boxShadow: 'var(--hairline-top)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
            <span>Menu</span>
          </button>
        </div>
      </header>

      {/* ─── 2. FLOATING MAGNETIC CIRCULAR BUTTON (Trigger on Scroll & Menu Close) ─── */}
      <div
        data-no-cursor="true"
        className={`fixed top-4 right-4 sm:top-6 sm:right-8 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
          scrolled || menuOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        <MagneticItem strength={0.35}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="group relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-surface text-foreground border border-border hover:border-border-strong shadow-lg flex items-center justify-center overflow-hidden cursor-pointer focus-visible:outline-none active:scale-95 transition-all"
          >
            {/* Liquid Fill Hover Ring */}
            <span
              className="absolute inset-0 rounded-full bg-foreground scale-0 group-hover:scale-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              aria-hidden="true"
            />

            {/* Kinetic Hamburger / Close Lines */}
            <div className="relative z-10 w-4 h-3.5 flex flex-col justify-between items-center pointer-events-none">
              <span
                className={`w-4 h-[1.5px] bg-foreground group-hover:bg-page rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? 'translate-y-[6px] rotate-45' : ''
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-foreground group-hover:bg-page rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-foreground group-hover:bg-page rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? '-translate-y-[6px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </MagneticItem>
      </div>

      {/* ─── 3. AMBIENT BACKDROP SCRIM ─── */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* ─── 4. EDITORIAL SLIDE-OVER DRAWER (Dennis Snellenberg Style) ─── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className="fixed top-0 right-0 bottom-0 z-40 w-full sm:w-[480px] md:w-[540px] bg-page border-l border-border/80 shadow-2xl flex flex-col justify-between p-6 sm:p-10 md:p-12 transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform"
        style={{
          transform: menuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(calc(100% + 100px), 0, 0)',
        }}
      >
        {/* Trailing Organic Curved SVG Edge (Dennis Snellenberg signature) */}
        <div
          className="absolute top-0 -left-[79px] sm:-left-[99px] w-[80px] sm:w-[100px] h-full pointer-events-none overflow-hidden select-none -mr-px hidden sm:block"
          style={{ color: 'var(--bg-page)' }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 100 1000"
            fill="currentColor"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path d="M100,0 L100,1000 Q0,500 100,0 Z" />
          </svg>
        </div>

        {/* Top Header of the Overlay */}
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted border-b border-border pb-4 sm:pb-6 pr-12 sm:pr-16">
          <div className="flex items-center gap-2.5">
            <span className="text-secondary font-semibold">// NAVIGATION</span>
            <span className="text-border-strong hidden xs:inline" aria-hidden="true">·</span>
            <span className="text-foreground hidden xs:inline font-mono">KARACHI, PK</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Center: High-Fashion Typographic Navigation with Staggered Slide-Up */}
        <nav className="flex flex-col gap-2 sm:gap-3.5 my-auto py-4" aria-label="Overlay navigation links">
          {(() => {
            const isHomeActive = location.pathname === '/'
            return (
              <div className="overflow-hidden py-1">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={`group flex items-baseline gap-4 sm:gap-6 py-1 transition-all duration-300 hover:translate-x-2.5 active:scale-[0.98] ${
                    isHomeActive ? 'text-foreground font-semibold' : 'text-foreground/75 hover:text-foreground'
                  }`}
                  style={{
                    transform: menuOpen ? 'translate3d(0, 0, 0) rotate(0deg)' : 'translate3d(0, 120%, 0) rotate(3deg)',
                    opacity: menuOpen ? 1 : 0,
                    transition: menuOpen
                      ? 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1) 120ms, opacity 400ms ease 120ms'
                      : 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 160ms ease-out',
                  }}
                >
                  <span className={`text-xs sm:text-sm font-mono tracking-wider transition-colors ${
                    isHomeActive ? 'text-emerald-500 font-bold' : 'text-muted group-hover:text-foreground'
                  }`}>
                    01
                  </span>
                  <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none flex items-center gap-3">
                    <span>Home</span>
                    {isHomeActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" aria-label="Current page" />
                    )}
                  </span>
                </Link>
              </div>
            )
          })()}

          {NAV_LINKS.map((item, idx) => {
            const active = isActiveRoute(item.href)
            const iconConfig = NAV_ICON_MAP[item.href]
            const IconComponent = iconConfig?.icon
            const delay = (idx + 1) * 55 + 120

            return (
              <div key={item.href} className="overflow-hidden py-1">
                <Link
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`group flex items-baseline gap-4 sm:gap-6 py-1 transition-all duration-300 hover:translate-x-2.5 active:scale-[0.98] ${
                    active ? 'text-foreground font-semibold' : 'text-foreground/75 hover:text-foreground'
                  }`}
                  style={{
                    transform: menuOpen ? 'translate3d(0, 0, 0) rotate(0deg)' : 'translate3d(0, 120%, 0) rotate(3deg)',
                    opacity: menuOpen ? 1 : 0,
                    transition: menuOpen
                      ? `transform 550ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 400ms ease ${delay}ms`
                      : 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 160ms ease-out',
                  }}
                >
                  <span className={`text-xs sm:text-sm font-mono tracking-wider transition-colors ${
                    active ? 'text-emerald-500 font-bold' : 'text-muted group-hover:text-foreground'
                  }`}>
                    0{idx + 2}
                  </span>
                  <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none flex items-center gap-3">
                    <span>{item.label}</span>
                    {active && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" aria-label="Current page" />
                    )}
                    {IconComponent && !active && (
                      <IconComponent className="w-5 h-5 pixel-icon text-muted opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block" aria-hidden="true" />
                    )}
                  </span>
                </Link>
              </div>
            )
          })}
        </nav>

        {/* Bottom: Socials & Direct Connect (Zero Mid-Word Splitting) */}
        <div
          className="pt-5 border-t border-border flex flex-col gap-3.5 text-xs font-mono text-muted"
          style={{
            transform: menuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, 30px, 0)',
            opacity: menuOpen ? 1 : 0,
            transition: menuOpen
              ? 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1) 400ms, opacity 400ms ease 400ms'
              : 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1), opacity 150ms ease-out',
          }}
        >
          {/* Row 1: Direct Email on its own line */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted tracking-wider uppercase">// CONTACT</span>
            <a
              href={`mailto:${CONTACT_CONFIG.email}`}
              className="text-foreground hover:text-emerald-500 transition-colors text-xs sm:text-sm font-mono font-medium truncate"
            >
              {CONTACT_CONFIG.email}
            </a>
          </div>

          {/* Row 2: Social Links + Availability Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-secondary">
              <a
                href={CONTACT_CONFIG.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <span>GitHub</span>
                <span aria-hidden="true">↗</span>
              </a>
              <span className="text-border-strong" aria-hidden="true">·</span>
              <a
                href={CONTACT_CONFIG.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>AVAILABLE FOR ROLES</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
