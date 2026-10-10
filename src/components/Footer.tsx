import { Link } from 'react-router-dom'
import { ArrowUpRight, FileText } from 'lucide-react'
import Container from './Container'
import { CONTACT_CONFIG } from '../data/contact'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-page text-secondary text-xs font-mono py-8 sm:py-10">
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Identity & Status */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-foreground font-semibold uppercase tracking-wider">
                Syed Ahmed Hussain
              </span>
              <span className="text-border-strong">·</span>
              <span className="text-muted">Karachi, PK</span>
            </div>
            <p className="text-[11px] text-muted">
              Engineering concurrency-safe backends, clinical platforms & distributed systems.
            </p>
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
            <Link to="/contact" className="text-foreground font-semibold hover:text-secondary transition-colors">
              CONTACT →
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <FileText className="w-3 h-3 text-emerald-500" />
              <span>RESUME</span>
              <ArrowUpRight className="w-2.5 h-2.5 text-muted" />
            </a>
            <span className="text-border-strong hidden sm:inline" aria-hidden="true">|</span>
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

        {/* Bottom Micro-Bar */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-muted">
          <span>© {currentYear} Syed Ahmed Hussain. All rights reserved.</span>
          <span>Designed with restraint. Built with React & Vite.</span>
        </div>
      </Container>
    </footer>
  )
}
