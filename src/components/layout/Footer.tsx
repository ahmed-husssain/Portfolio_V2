import { Link } from 'react-router-dom'
import { ExternalLink, FileText } from 'pixelarticons/react'
import { toast } from 'sonner'
import Container from '../ui/Container'
import { CONTACT_CONFIG } from '../../data/contact'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const showMessage = () => {
    toast('🍪 Terms & Conditions', {
      description: 'You deserve a cookie! But… it’s a virtual one 😋',
      duration: 2500,
    })
  }

  return (
    <footer className="border-t border-border bg-page text-secondary text-xs font-mono py-8 sm:py-10">
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Identity & Status (Layout 3: Unified with Year & Terms) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="pixel-beacon bg-emerald-500" aria-hidden="true" />
              <span className="text-foreground font-semibold uppercase tracking-wider">
                Syed Ahmed Hussain
              </span>
              <span className="text-border-strong">·</span>
              <span className="text-muted">Karachi, PK</span>
              <span className="text-border-strong">·</span>
              <span className="text-muted">{currentYear}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
              <span>Web, mobile, and backend systems built to last.</span>
              <span className="text-border-strong" aria-hidden="true">·</span>
              <button
                type="button"
                onClick={showMessage}
                className="hover:text-foreground transition-colors hover:underline decoration-border-strong underline-offset-4 cursor-pointer focus:outline-none focus-visible:text-foreground"
              >
                Terms 🍪
              </button>
            </div>
          </div>

          {/* Quick Nav & Social Links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <Link to="/work" className="hover:text-foreground transition-colors">
              WORK
            </Link>
            <Link to="/about" className="hover:text-foreground transition-colors">
              ABOUT
            </Link>
            <Link to="/writing" className="hover:text-foreground transition-colors">
              WRITING
            </Link>
            <Link to="/about#contact" className="text-foreground font-semibold hover:text-secondary transition-colors">
              CONTACT →
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors group"
            >
              <FileText className="w-3.5 h-3.5 text-muted group-hover:text-foreground pixel-icon transition-colors" />
              <span>RESUME</span>
              <ExternalLink className="w-3 h-3 text-muted group-hover:text-foreground pixel-icon transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <span className="text-border-strong hidden sm:inline" aria-hidden="true">·</span>
            <a
              href={CONTACT_CONFIG.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GITHUB
            </a>
            <a
              href={CONTACT_CONFIG.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LINKEDIN
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
