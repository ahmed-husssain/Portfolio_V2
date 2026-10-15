import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Briefcase, User, BookOpen, Mail } from 'pixelarticons/react'
import ThemeToggle from './ThemeToggle'
import { NAV_ITEMS } from '../data/navigation'
import { CONTACT_CONFIG } from '../data/contact'

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

        {/* Mobile Minimal Menu Trigger (At Top of Page) */}
        <div className="flex items-center gap-3 md:hidden pointer-events-auto h-8">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            className="text-xs font-medium uppercase tracking-wider text-foreground px-3.5 py-1.5 rounded-full border border-border bg-page/80 backdrop-blur-xs active:scale-95 transition-transform"
          >
            Menu
          </button>
        </div>
      </header>

      {/* ─── 2. FLOATING MAGNETIC CIRCULAR BUTTON (Trigger on Scroll) ─── */}
      <div
        data-no-cursor="true"
        className={`fixed top-5 right-5 sm:top-8 sm:right-10 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
          scrolled || menuOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        <MagneticItem strength={0.4}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-foreground text-page shadow-xl flex items-center justify-center overflow-hidden cursor-pointer focus-visible:outline-none"
          >
            {/* Liquid Fill Hover Ring */}
            <span
              className="absolute inset-0 rounded-full bg-emerald-500 scale-0 group-hover:scale-100 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              aria-hidden="true"
            />

            {/* Kinetic Hamburger / Close Lines */}
            <div className="relative z-10 w-5 h-4 flex flex-col justify-between items-center pointer-events-none">
              <span
                className={`w-5 h-[1.5px] bg-page rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`w-5 h-[1.5px] bg-page rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-5 h-[1.5px] bg-page rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </MagneticItem>
      </div>

      {/* ─── 3. FULL-SCREEN EDITORIAL MENU OVERLAY (Dennis Snellenberg Style) ─── */}
      <div
        className={`fixed inset-0 z-40 bg-page/95 backdrop-blur-xl flex flex-col justify-between p-8 sm:p-14 md:p-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Top Header of the Overlay */}
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted border-b border-border pb-6">
          <span>// NAVIGATION</span>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">LAHORE, PK</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Center: High-Fashion Typographic Navigation */}
        <nav className="flex flex-col gap-3 sm:gap-5 my-auto" aria-label="Overlay navigation links">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="group flex items-baseline gap-4 sm:gap-6 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground transition-transform duration-300 hover:translate-x-3"
          >
            <span className="text-xs sm:text-sm font-mono font-normal text-muted group-hover:text-emerald-500 transition-colors">
              01
            </span>
            <span>Home</span>
          </Link>

          {NAV_LINKS.map((item, idx) => {
            const active = isActiveRoute(item.href)
            const iconConfig = NAV_ICON_MAP[item.href]
            const IconComponent = iconConfig?.icon

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={`group flex items-baseline gap-4 sm:gap-6 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight transition-transform duration-300 hover:translate-x-3 ${
                  active ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <span className={`text-xs sm:text-sm font-mono font-normal transition-colors ${
                  active ? 'text-emerald-500' : 'text-muted group-hover:text-emerald-500'
                }`}>
                  0{idx + 2}
                </span>
                <span className="flex items-center gap-3">
                  <span>{item.label}</span>
                  {IconComponent && (
                    <IconComponent className="w-6 h-6 pixel-icon opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  )}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom: Socials & Direct Connect */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-muted">
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${CONTACT_CONFIG.email}`}
              className="text-foreground hover:text-emerald-500 transition-colors"
            >
              {CONTACT_CONFIG.email}
            </a>
            <a
              href={CONTACT_CONFIG.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href={CONTACT_CONFIG.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn ↗
            </a>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AVAILABLE FOR SELECT CLIENTS</span>
          </div>
        </div>
      </div>
    </>
  )
}
