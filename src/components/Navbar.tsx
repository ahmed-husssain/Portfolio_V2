import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { NAV_ITEMS } from '../data/navigation'
import { CONTACT_CONFIG } from '../data/contact'

// Reusable native magnetic wrapper (Dennis Snellenberg spring physics)
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

  // Exclude Home/Index from nav links since it is covered by the left logo
  const navLinks = NAV_ITEMS.filter((item) => item.href !== '/')

  // ─── Gliding Magnetic Hover Dot State ───
  const [dotPos, setDotPos] = useState<{ left: number; opacity: number }>({
    left: 0,
    opacity: 0,
  })
  const navContainerRef = useRef<HTMLDivElement>(null)
  const linksMapRef = useRef<Map<string, HTMLAnchorElement>>(new Map())

  const isActiveRoute = useCallback(
    (path: string) => {
      if (path === '/') return location.pathname === '/'
      return location.pathname.startsWith(path)
    },
    [location.pathname]
  )

  const updateDotToActive = useCallback(() => {
    const activeItem = navLinks.find((item) => isActiveRoute(item.href))
    if (activeItem) {
      const el = linksMapRef.current.get(activeItem.href)
      const container = navContainerRef.current
      if (el && container) {
        const containerRect = container.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()
        const center = elRect.left - containerRect.left + elRect.width / 2
        setDotPos({ left: center, opacity: 1 })
        return
      }
    }
    setDotPos((prev) => ({ ...prev, opacity: 0 }))
  }, [isActiveRoute, navLinks])

  useEffect(() => {
    updateDotToActive()
  }, [updateDotToActive])

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
      {/* ─── 1. TOP AMBIENT NAVIGATION (Dennis Snellenberg Style) ─── */}
      <header
        className={`fixed top-0 inset-x-0 z-40 px-6 sm:px-10 md:px-14 py-7 sm:py-8 flex items-center justify-between transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none select-none ${
          scrolled ? '-translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Left: Brand with Dennis Snellenberg Signature Horizontal Roll */}
        <div className="pointer-events-auto">
          <MagneticItem strength={0.25}>
            <Link
              to="/"
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-medium tracking-tight text-foreground focus-visible:outline-none"
            >
              <span className="text-muted font-normal select-none">©</span>
              <span className="relative inline-flex items-center overflow-hidden h-[20px] w-[132px]">
                {/* State 1: "Code by Ahmed" */}
                <span className="absolute inset-0 flex items-center whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[115%]">
                  Code by Ahmed
                </span>
                {/* State 2: "Ahmed Hussain" */}
                <span className="absolute inset-0 flex items-center whitespace-nowrap font-semibold text-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-[115%] group-hover:translate-x-0">
                  Ahmed Hussain
                </span>
              </span>
            </Link>
          </MagneticItem>
        </div>

        {/* Right: Pure Text Links with Magnetic Hover & Gliding Dot */}
        <nav
          ref={navContainerRef}
          onMouseLeave={updateDotToActive}
          className="hidden md:flex items-center gap-8 relative pointer-events-auto"
          aria-label="Main navigation"
        >
          {navLinks.map((item) => {
            const active = isActiveRoute(item.href)
            return (
              <MagneticItem key={item.href} strength={0.3}>
                <Link
                  ref={(el) => {
                    if (el) linksMapRef.current.set(item.href, el)
                    else linksMapRef.current.delete(item.href)
                  }}
                  to={item.href}
                  onMouseEnter={(e) => {
                    const container = navContainerRef.current
                    if (container) {
                      const containerRect = container.getBoundingClientRect()
                      const elRect = e.currentTarget.getBoundingClientRect()
                      const center = elRect.left - containerRect.left + elRect.width / 2
                      setDotPos({ left: center, opacity: 1 })
                    }
                  }}
                  className={`text-xs sm:text-sm font-medium tracking-normal transition-colors duration-200 py-1 ${
                    active ? 'text-foreground font-semibold' : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              </MagneticItem>
            )
          })}

          <div className="pl-2">
            <ThemeToggle />
          </div>

          {/* Gliding Magnetic Hover Dot */}
          <span
            className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-foreground pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: `translate3d(${dotPos.left - 3}px, 0, 0)`,
              opacity: dotPos.opacity,
            }}
          />
        </nav>

        {/* Mobile Minimal Menu Trigger (At Top of Page) */}
        <div className="flex items-center gap-3 md:hidden pointer-events-auto">
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

          {navLinks.map((item, idx) => {
            const active = isActiveRoute(item.href)
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
                <span>{item.label}</span>
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
