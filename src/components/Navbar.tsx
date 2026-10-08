import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, ArrowUpRight, Mail } from 'lucide-react'
import Container from './Container'
import ThemeToggle from './ThemeToggle'
import { NAV_ITEMS, AVAILABILITY_STATUS } from '../data/navigation'
import { CONTACT_CONFIG } from '../data/contact'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

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

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 border-b ${
        mobileMenuOpen
          ? 'bg-page border-border shadow-none'
          : scrolled
            ? 'bg-[var(--bg-page)]/90 backdrop-blur-md border-border shadow-xs'
            : 'bg-[var(--bg-page)]/70 backdrop-blur-sm border-border/60'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* ─── Brand / Name Linking to Home ─── */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none"
            >
              AHMED HUSSAIN
            </Link>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border text-[11px] font-mono text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span>{AVAILABILITY_STATUS.label}</span>
            </div>
          </div>

          {/* ─── Desktop Nav Links & Controls ─── */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActiveRoute(item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative text-xs font-mono tracking-wider uppercase transition-colors duration-150 py-1.5 ${
                    active
                      ? 'text-foreground font-semibold'
                      : 'text-secondary hover:text-foreground'
                  } focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-foreground after:transition-transform after:duration-150 ${
                    active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100 after:opacity-40'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="pl-2 border-l border-border">
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
                <X className="w-5 h-5 text-foreground" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
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
                    className={`p-3 rounded-xs border transition-all flex items-center justify-between group active:scale-[0.99] ${
                      active
                        ? 'bg-surface border-border-strong shadow-2xs'
                        : 'bg-page/70 border-border hover:bg-surface hover:border-border-strong'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-[11px] font-mono font-bold shrink-0 ${
                        active ? 'text-emerald-500' : 'text-muted'
                      }`}>
                        0{idx + 1}
                      </span>
                      <div className="flex flex-col text-left min-w-0">
                        <span className={`text-sm font-semibold tracking-tight ${
                          active ? 'text-foreground' : 'text-secondary group-hover:text-foreground'
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
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AVAILABLE
              </span>
            </div>

            <a
              href={`mailto:${CONTACT_CONFIG.email}`}
              className="p-2.5 rounded-2xs border border-border bg-page flex items-center justify-between text-xs font-mono text-foreground hover:bg-surface active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-muted shrink-0" />
                <span className="truncate">{CONTACT_CONFIG.email}</span>
              </div>
              <ArrowUpRight className="w-3 h-3 text-muted shrink-0 ml-1" />
            </a>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <a
                href={CONTACT_CONFIG.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-2xs border border-border bg-page text-secondary hover:text-foreground flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>GITHUB</span>
                <ArrowUpRight className="w-3 h-3 text-muted" />
              </a>
              <a
                href={CONTACT_CONFIG.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-2xs border border-border bg-page text-secondary hover:text-foreground flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>LINKEDIN</span>
                <ArrowUpRight className="w-3 h-3 text-muted" />
              </a>
            </div>
          </div>

          {/* Bottom: Clean Single-Line Status Bar */}
          <div className="pt-2.5 border-t border-border flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-muted shrink-0">
            <div className="flex items-center gap-1.5 text-secondary truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" aria-hidden="true" />
              <span className="truncate">Karachi, Pakistan (Remote & On-site)</span>
            </div>
            <span className="text-muted shrink-0 ml-2">PORTFOLIO // V2</span>
          </div>
        </div>
      )}
    </header>
  )
}
