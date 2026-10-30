import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import { CAPABILITIES } from '../data/capabilities'

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-12 sm:py-16 md:py-20 border-b border-border">
      <Container>
        {/* ─── Section Header ─── */}
        <SectionHeading
          index="02"
          title="Tools & Daily Stack"
          subtitle="No buzzwords. Just the languages, frameworks, and databases I actually write production code in."
          meta="04 DISCIPLINES · PRODUCTION VERIFIED"
        />

        {/* ─── Buttery Smooth, Crystal-Clear Stack Rows ─── */}
        <div className="border-t border-border divide-y divide-border select-none mt-8">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.index}
              className="py-6 sm:py-7 transition-colors duration-150 ease-out hover:bg-surface-subtle/30 rounded-xs px-2 sm:px-4 group cursor-default"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Index + Clear Title + Clean Readable Human One-Liner */}
                <div className="space-y-1.5 max-w-xl min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-muted group-hover:text-emerald-500 transition-colors shrink-0">
                      #{cap.index}
                    </span>
                    <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground transition-colors">
                      {cap.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-secondary group-hover:text-foreground transition-colors duration-150 leading-relaxed font-sans">
                    {cap.description}
                  </p>
                </div>

                {/* Right: Concrete Stack Chips + Verified Case Study Link */}
                <div className="flex flex-col lg:items-end gap-2.5 shrink-0">
                  <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
                    {cap.stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs px-2.5 py-1 rounded-xs border border-border bg-surface text-secondary group-hover:border-border-strong group-hover:text-foreground transition-colors duration-150"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/work/${cap.projectSlug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-muted group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-semibold transition-colors duration-150 pt-0.5 group/link"
                  >
                    <span>PROVED IN {cap.projectLabel.toUpperCase()}</span>
                    <span
                      className="transition-transform duration-150 ease-out group-hover/link:translate-x-0.5"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Understated Footnote ─── */}
        <div className="mt-8 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted">
          <span>// GROUNDED ARCHITECTURE · ZERO BUZZWORDS</span>
          <span>4 PRODUCTION DISCIPLINES</span>
        </div>
      </Container>
    </section>
  )
}
