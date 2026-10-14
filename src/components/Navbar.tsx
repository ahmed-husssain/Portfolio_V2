import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Close, ArrowRight, ExternalLink, Mail, FileText } from 'pixelarticons/react'
import Container from './Container'
import Button from './Button'
import ThemeToggle from './ThemeToggle'
import KarachiClock from './KarachiClock'
import { NAV_ITEMS, AVAILABILITY_STATUS } from '../data/navigation'
import { CONTACT_CONFIG } from '../data/contact'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // ─── Gliding Magic Pill Indicator State ───
  const [indicator, setIndicator] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  })
  const linksRef = useRef<Map<string, HTMLAnchorElement>>(new Map())

  const isActiveRoute = useCallback(
    (path: string) => {
      if (path === '/') return location.pathname === '/'
      return location.pathname.startsWith(path)
    },
    [location.pathname]
  )

  const updateToActive = useCallback(() => {
    const activeItem = NAV_ITEMS.find((item) => isActiveRoute(item.href))
    if (activeItem) {
      const el = linksRef.current.get(activeItem.href)
      if (el) {
        setIndicator({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        })
        return
      }
    }
    setIndicator((prev) => ({ ...prev, opacity: 0 }))
  }, [isActiveRoute])

  useEffect(() => {
    updateToActive()
  }, [updateToActive])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={`fixed z-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        mobileMenuOpen
          ? 'top-0 inset-x-0 bg-page border-b border-border shadow-none'
          : scrolled
            ? 'top-2 inset-x-2 sm:inset-x-4 max-w-5xl mx-auto rounded-xs border border-border material-frosted shadow-sm'
            : 'top-0 inset-x-0 border-b border-border/60 material-frosted'
      }`}
      style={{ boxShadow: 'var(--hairline-top)' }}
    >
      <Container>
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* ─── Brand / Name with Editorial Kinetic Roll ─── */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="group flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-tight text-foreground focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none"
            >
              <span className="font-mono text-muted text-xs group-hover:text-emerald-500 transition-colors">//</span>
              <span className="relative inline-flex flex-col h-[18px] overflow-hidden leading-tight font-semibold">
                <span className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                  AHMED HUSSAIN
                </span>
                <span className="absolute top-full left-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full text-foreground">
                  AHMED HUSSAIN
                </span>
              </span>
            </Link>

            {/* Zone 2: Karachi Clock (Desktop Telemetry) */}
            <div className="hidden lg:flex items-center pl-3 border-l border-border">
              <KarachiClock showIcon format="full" />
            </div>

            <div className="hidden sm:flex lg:hidden items-center gap-2 pl-3 border-l border-border text-micro-caps text-muted">
              <span className="pixel-beacon" aria-hidden="true" />
              <span>{AVAILABILITY_STATUS.label}</span>
            </div>
          </div>

          {/* ─── Desktop Nav Links & Controls (Gliding Spotlight Dock) ─── */}
          <nav
            className="hidden md:flex items-center gap-3 lg:gap-4"
            aria-label="Main navigation"
          >
            {/* Gliding Magic Pill Dock */}
            <div
              onMouseLeave={updateToActive}
              className="relative flex items-center p-1 rounded-xs bg-surface-subtle/70 border border-border/70 backdrop-blur-xs select-none"
            >
              {/* Dynamic Sliding Capsule Indicator */}
              <div
                className="absolute top-1 bottom-1 rounded-2xs bg-surface border border-border shadow-2xs transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none motion-reduce:transition-none"
                style={{
                  transform: `translate3d(${indicator.left}px, 0, 0)`,
                  width: `${indicator.width}px`,
                  opacity: indicator.opacity,
                }}
              />

              {NAV_ITEMS.map((item) => {
                const active = isActiveRoute(item.href)
                return (
                  <Link
                    key={item.href}
                    ref={(el) => {
                      if (el) linksRef.current.set(item.href, el)
                      else linksRef.current.delete(item.href)
                    }}
                    to={item.href}
                    onMouseEnter={(e) => {
                      setIndicator({
                        left: e.currentTarget.offsetLeft,
                        width: e.currentTarget.offsetWidth,
                        opacity: 1,
                      })
                    }}
                    className={`relative z-10 px-3 py-1 text-micro-caps transition-colors duration-150 select-none ${
                      active
                        ? 'text-foreground font-semibold'
                        : 'text-secondary hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Liquid Bubble "GET IN TOUCH" Button */}
            <Button
              href="/contact"
              variant="secondary"
              size="sm"
              style={{ boxShadow: 'var(--hairline-top)' }}
              className="text-micro-caps font-semibold"
            >
              <span>GET IN TOUCH</span>
              <span className="text-muted text-[10px] group-hover:text-black">↗</span>
            </Button>

            <div className="pl-1 border-l border-border">
              <ThemeToggle />
            </div>
          </nav>

          {/* ─── Mobile Controls (Theme Toggle + Menu Button) ─── */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-xs border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-hover active:scale-95 transition-all duration-150 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? (
                <Close className="w-5 h-5 pixel-icon text-foreground" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5 pixel-icon" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* ─── Modern Mobile Navigation Drawer ─── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] bg-page border-b border-border z-50 md:hidden flex flex-col justify-between p-4 sm:p-6 overflow-y-auto animate-page-in font-sans"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Top: Structured Interactive Navigation Items */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted px-1 mb-0.5">
              // NAVIGATION
            </span>
            <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation links">
              {NAV_ITEMS.map((item, idx) => {
                const active = isActiveRoute(item.href)
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-xs border transition-all flex items-center justify-between group active:scale-[0.99] ${active
                        ? 'bg-surface border-border-strong shadow-2xs'
                        : 'bg-page/70 border-border hover:bg-surface hover:border-border-strong'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-[11px] font-mono font-bold shrink-0 ${active ? 'text-emerald-500' : 'text-muted'
                        }`}>
                        0{idx + 1}
                      </span>
                      <div className="flex flex-col text-left min-w-0">
                        <span className={`text-sm font-semibold tracking-tight ${active ? 'text-foreground' : 'text-secondary group-hover:text-foreground'
                          }`}>
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="text-[11px] text-muted font-mono leading-tight truncate">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {active ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-2xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px] font-mono font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ACTIVE
                        </span>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Middle: Direct Connect Card (Eliminates the empty void) */}
          <div className="my-3 p-3.5 rounded-xs border border-border bg-surface-subtle/50 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted uppercase">
              <span>DIRECT CONNECT</span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                <span className="pixel-beacon" />
                AVAILABLE
              </span>
            </div>

            <a
              href={`mailto:${CONTACT_CONFIG.email}`}
              className="p-2.5 rounded-2xs border border-border bg-page flex items-center justify-between text-xs font-mono text-foreground hover:bg-surface active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 pixel-icon text-muted shrink-0" />
                <span className="truncate">{CONTACT_CONFIG.email}</span>
              </div>
              <ExternalLink className="w-3 h-3 pixel-icon text-muted shrink-0 ml-1" />
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-2xs border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-500/15 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 pixel-icon text-emerald-500" />
                <span>OFFICIAL RESUME (PDF)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 pixel-icon" />
            </a>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <a
                href={CONTACT_CONFIG.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-2xs border border-border bg-page text-secondary hover:text-foreground flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>GITHUB</span>
                <ExternalLink className="w-3 h-3 pixel-icon text-muted" />
              </a>
              <a
                href={CONTACT_CONFIG.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-2xs border border-border bg-page text-secondary hover:text-foreground flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>LINKEDIN</span>
                <ExternalLink className="w-3 h-3 pixel-icon text-muted" />
              </a>
            </div>
          </div>

          {/* Bottom: Clean Single-Line Status Bar */}
          <div className="pt-2.5 border-t border-border flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-muted shrink-0">
            <div className="flex items-center gap-2 text-secondary truncate">
              <span className="pixel-beacon shrink-0" aria-hidden="true" />
              <span className="truncate">Karachi, Pakistan (Remote & On-site)</span>
            </div>
            <span className="text-muted shrink-0 ml-2">PORTFOLIO // V2</span>
          </div>
        </div>
      )}
    </header>
  )
}
