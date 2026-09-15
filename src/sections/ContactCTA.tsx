import { ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'

export default function ContactCTA() {
  return (
    <section id="contact" className="py-20 sm:py-28 md:py-36">
      <Container>
        <SectionHeading
          index="// 06"
          title="Contact"
          subtitle="Open for select full-stack product contracts, backend engineering roles, and technical architecture consulting."
          meta="[ GET IN TOUCH ]"
        />

        <div className="border border-border bg-surface rounded-sm p-6 sm:p-10 md:p-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span>CURRENT STATUS: AVAILABLE FOR SELECT WORK</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-tight mb-6">
              Have a web application, API system, or technical product to build?
            </h3>

            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-8">
              Whether you need to architect a new product from the database up, build a resilient full-stack application, or overhaul an existing system for better performance and maintainability, let's discuss your requirements.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
              <a
                href="mailto:ahmedhussain.dev@gmail.com"
                className="inline-flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-mono font-semibold bg-foreground text-page hover:bg-secondary transition-colors rounded-sm"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>AHMEDHUSSAIN.DEV@GMAIL.COM</span>
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
      </Container>
    </section>
  )
}
