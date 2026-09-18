import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from './Container'
import { CONTACT_LINKS } from '../data/contact'

interface ConnectProps {
  className?: string
  withContainer?: boolean
}

export default function Connect({ className = '', withContainer = true }: ConnectProps) {
  const content = (
    <div className={`border-t border-border pt-6 sm:pt-8 pb-8 sm:pb-10 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="text-xs font-mono uppercase tracking-widest text-muted">
          // CONNECT
        </div>

        <nav aria-label="Connect links" className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-mono">
          <a
            href={CONTACT_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile (opens in new tab)"
            className="group inline-flex items-center gap-1.5 py-1 text-secondary hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xs"
          >
            <span className="tracking-wider">GITHUB</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden="true"
            />
          </a>

          <a
            href={CONTACT_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile (opens in new tab)"
            className="group inline-flex items-center gap-1.5 py-1 text-secondary hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xs"
          >
            <span className="tracking-wider">LINKEDIN</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden="true"
            />
          </a>

          <a
            href={`mailto:${CONTACT_LINKS.email}`}
            aria-label={`Send an email to ${CONTACT_LINKS.email}`}
            className="group inline-flex items-center gap-1.5 py-1 text-secondary hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xs"
          >
            <span className="tracking-wider">EMAIL</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden="true"
            />
          </a>

          <Link
            to={CONTACT_LINKS.review}
            aria-label="Share feedback or submit a review"
            className="group inline-flex items-center gap-1.5 py-1 text-secondary hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xs"
          >
            <span className="tracking-wider">SHARE FEEDBACK</span>
            <span
              className="text-muted text-sm font-semibold transition-transform duration-200 group-hover:scale-125 group-hover:text-foreground inline-block"
              aria-hidden="true"
            >
              +
            </span>
          </Link>
        </nav>
      </div>
    </div>
  )

  if (withContainer) {
    return <Container>{content}</Container>
  }

  return content
}
