import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Container from './Container'
import ThemeToggle from './ThemeToggle'
import { NAV_ITEMS, AVAILABILITY_STATUS } from '../data/navigation'

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
        scrolled
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
              className="p-2 rounded-sm border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-hover active:scale-95 transition-all duration-150 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* ─── Mobile Menu Drawer ─── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-x-0 top-16 h-[calc(100vh-4rem)] bg-[var(--bg-page)] border-b border-border z-50 md:hidden flex flex-col justify-between p-6 sm:p-8 overflow-y-auto animate-page-in"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col gap-6 pt-4" aria-label="Mobile navigation links">
            {NAV_ITEMS.map((item) => {
              const active = isActiveRoute(item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-mono tracking-wider uppercase pb-4 border-b border-border transition-colors flex items-center justify-between ${
                    active ? 'text-foreground font-semibold' : 'text-secondary hover:text-foreground'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span className="text-xs font-mono text-muted">// ACTIVE</span>}
                </Link>
              )
            })}
          </nav>

          <div className="pt-6 border-t border-border flex items-center justify-between text-xs font-mono text-muted">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span>{AVAILABILITY_STATUS.label}</span>
            </div>
            <span>PORTFOLIO // V2</span>
          </div>
        </div>
      )}
    </header>
  )
}
