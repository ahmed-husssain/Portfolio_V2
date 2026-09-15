import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Container from './Container'
import { NAV_ITEMS, AVAILABILITY_STATUS } from '../data/navigation'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const externalLinks = [
    { label: 'GITHUB', href: 'https://github.com/ahmed-husssain' },
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/syed-ahmed-ba9838357/' },
    { label: 'EMAIL', href: 'mailto:aptech356@gmail.com' },
  ]

  return (
    <footer className="border-t border-border bg-surface text-secondary py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <Link
                to="/"
                className="text-sm font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity inline-block mb-3"
              >
                AHMED HUSSAIN
              </Link>
              <p className="text-xs sm:text-sm text-secondary max-w-[420px] leading-relaxed">
                Full-Stack Web Developer focused on building practical web applications, APIs, and scalable backend architectures.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-6 text-xs font-mono text-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span>{AVAILABILITY_STATUS.label}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <span className="text-[11px] font-mono text-muted tracking-widest uppercase mb-2">
              // NAVIGATION
            </span>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-xs font-mono text-secondary hover:text-foreground transition-colors tracking-wider uppercase py-1"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Social / Direct Connect Links */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <span className="text-[11px] font-mono text-muted tracking-widest uppercase mb-2">
              // CONNECT
            </span>
            {externalLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1 text-xs font-mono text-secondary hover:text-foreground transition-colors tracking-wider uppercase py-1"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              </a>
            ))}
            <Link
              to="/review"
              className="inline-flex items-center gap-1 text-xs font-mono text-muted hover:text-foreground transition-colors tracking-wider uppercase py-1 pt-2 mt-1 border-t border-border/40"
            >
              <span>SHARE FEEDBACK</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom Credits & Spec Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <span>&copy; {currentYear} AHMED HUSSAIN. ALL RIGHTS RESERVED.</span>
          <span>PORTFOLIO V2 // MONOCHROME TECHNICAL</span>
        </div>
      </Container>
    </footer>
  )
}
