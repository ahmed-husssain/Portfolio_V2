import { ArrowUpRight, Clock, Mail, MapPin } from 'lucide-react'
import Container from '../components/Container'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// GitHub inline SVG icon
function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export default function Contact() {
  useDocumentTitle('Contact — Ahmed | Full-Stack Web Developer')

  return (
    <div className="py-16 sm:py-24 md:py-32">
      <Container>
        {/* Page Header */}
        <header className="mb-14 sm:mb-20 pb-8 border-b border-border">
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-3">
            <span className="text-foreground font-semibold">// CONTACT CHANNELS</span>
            <span>·</span>
            <span>INITIATE DIRECT DIALOGUE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-5">
            Let's discuss your product, system architecture, or engineering role.
          </h1>

          <p className="text-secondary text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
            I am currently open for select full-stack product contracts, backend engineering roles, and system consulting engagements. Feel free to reach out directly.
          </p>
        </header>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Direct Channels */}
          <div className="lg:col-span-7 space-y-8">
            {/* Primary Email Card */}
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-4 border-b border-border">
                <Mail className="w-4 h-4 text-foreground" aria-hidden="true" />
                <span className="text-foreground font-semibold">PRIMARY COMMUNICATION</span>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-2">
                Direct Email
              </h2>

              <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-6">
                For project proposals, architecture discussions, or employment opportunities, email is the fastest and most direct channel.
              </p>

              <a
                href="mailto:ahmedhussain.dev@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-page text-xs sm:text-sm font-mono font-semibold rounded-sm hover:bg-secondary transition-colors"
              >
                <span>AHMEDHUSSAIN.DEV@GMAIL.COM</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>

            {/* Public Repositories & Profiles */}
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-5 border-b border-border">
                <span className="text-foreground font-semibold">// PROFESSIONAL LINKS</span>
              </div>

              <div className="space-y-4">
                <a
                  href="https://github.com/ahmed-husssain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-border bg-page hover:border-border-strong rounded-sm transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <GithubIcon className="w-5 h-5 text-foreground" />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground block">
                        GitHub Profile
                      </span>
                      <span className="text-[11px] font-mono text-secondary">
                        @ahmed-husssain · Repositories & Commit History
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" aria-hidden="true" />
                </a>

                <a
                  href="https://linkedin.com/in/ahmed-husssain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-border bg-page hover:border-border-strong rounded-sm transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center font-bold text-sm text-foreground">in</span>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground block">
                        LinkedIn Profile
                      </span>
                      <span className="text-[11px] font-mono text-secondary">
                        Connect for professional opportunities & networking
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Operational Details Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Availability & Location Card */}
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-5 border-b border-border">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="text-foreground font-semibold">LOGISTICS & AVAILABILITY</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">LOCATION</span>
                    <span className="text-foreground font-medium">Karachi, Pakistan</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">TIMEZONE</span>
                    <span className="text-foreground font-medium">Pakistan Standard Time (PKT / UTC+5)</span>
                    <span className="text-secondary block text-[11px] mt-0.5">Experienced with asynchronous distributed workflows</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Protocol Box */}
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-4 border-b border-border">
                <span className="text-foreground font-semibold">// ENGAGEMENT GUIDELINES</span>
              </div>

              <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-4">
                When reaching out regarding a project, please include:
              </p>

              <ul className="space-y-2 text-xs font-mono text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" aria-hidden="true" />
                  <span>Brief project overview or problem description</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" aria-hidden="true" />
                  <span>Current architecture or preferred tech stack</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" aria-hidden="true" />
                  <span>Target launch timeline and engagement scope</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
