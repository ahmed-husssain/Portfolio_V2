import { ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import Connect from '../components/Connect'
import { CONTACT_CONFIG } from '../data/contact'

export default function ContactCTA() {
  return (
    <section id="contact" className="pt-20 sm:pt-28 md:pt-36 pb-0">
      <Container>
        <SectionHeading
          index="// 06"
          title="Contact"
          subtitle="Open for backend engineering roles, .NET development, and full-stack projects."
          meta="[ GET IN TOUCH ]"
        />

        <div className="border border-border bg-surface rounded-sm p-6 sm:p-10 md:p-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span>CURRENT STATUS: {CONTACT_CONFIG.availability.status}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-tight mb-6">
              Have a web application, API system, or project to build?
            </h3>

            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-8">
              Whether you need to build a scalable ASP.NET Core API, design a clean relational database schema, or engineer a reliable web application, let's discuss your goals.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
              <a
                href={`mailto:${CONTACT_CONFIG.email}`}
                className="inline-flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-mono font-semibold bg-foreground text-page hover:bg-secondary transition-colors rounded-sm"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>{CONTACT_CONFIG.email.toUpperCase()}</span>
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-mono font-semibold border border-border hover:border-border-strong text-foreground transition-colors rounded-sm group"
              >
                <span>VISIT CONTACT PAGE</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Minimal Connect System */}
        <Connect withContainer={false} className="mt-12 sm:mt-16" />
      </Container>
    </section>
  )
}
