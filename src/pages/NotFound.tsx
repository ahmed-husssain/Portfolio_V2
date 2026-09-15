import { ArrowLeft, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('404 — Page Not Found | Ahmed')

  return (
    <div className="py-24 sm:py-36 min-h-[60vh] flex items-center">
      <Container>
        <div className="border border-border bg-surface rounded-sm p-8 sm:p-14 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
            <span>ERROR 404 // ROUTE UNRESOLVED</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight mb-4">
            Page Not Found
          </h1>

          <p className="text-secondary text-sm sm:text-base leading-relaxed mb-8">
            The requested route does not exist or has been relocated. You can return to the portfolio homepage or explore the full engineering catalog.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono font-semibold">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page hover:bg-secondary transition-colors rounded-sm"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>RETURN TO HOMEPAGE</span>
            </Link>

            <Link
              to="/work"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-surface text-foreground hover:border-border-strong transition-colors rounded-sm"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>BROWSE ALL WORK</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
