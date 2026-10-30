import { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import { CAPABILITIES } from '../data/capabilities'

export default function Capabilities() {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)

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

        {/* ─── The Silent Monolith: Hairline-Separated Human Stack ─── */}
        <div
          className="border-t border-border divide-y divide-border select-none mt-8"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {CAPABILITIES.map((cap) => {
            const isHovered = hoveredIndex === cap.index
            const hasAnyHover = hoveredIndex !== null

            return (
              <div
                key={cap.index}
                onMouseEnter={() => setHoveredIndex(cap.index)}
                onFocus={() => setHoveredIndex(cap.index)}
                onBlur={() => setHoveredIndex(null)}
                tabIndex={0}
                className={`py-6 sm:py-7 transition-[opacity,background-color] duration-200 ease-out focus:outline-none focus-visible:bg-surface-subtle/40 rounded-xs px-2 sm:px-4 cursor-default ${
                  hasAnyHover && !isHovered
                    ? 'opacity-30'
                    : 'opacity-100 hover:bg-surface-subtle/25'
                }`}
              >
                {/* ── Desktop & Tablet Main Row ── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                  {/* Left: Index + Clean Discipline Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`font-mono text-xs font-semibold shrink-0 transition-colors duration-150 ${
                        isHovered ? 'text-emerald-500' : 'text-muted'
                      }`}
                    >
                      #{cap.index}
                    </span>
                    <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
                    <h3
                      className={`text-xl sm:text-2xl font-semibold tracking-tight transition-colors duration-150 ${
                        isHovered ? 'text-foreground' : 'text-foreground/90'
                      }`}
                    >
                      {cap.title}
                    </h3>
                  </div>

                  {/* Right: Concrete Stack Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
                    {cap.stack.map((tech) => (
                      <span
                        key={tech}
                        className={`font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded-xs border transition-colors duration-150 ${
                          isHovered
                            ? 'border-emerald-500/40 bg-emerald-500/[0.06] text-foreground font-medium'
                            : 'border-border bg-surface text-secondary'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── Desktop Zero-Jank Whisper Reveal (Clean Sans Typography) ── */}
                <div
                  className={`hidden lg:grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isHovered
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between gap-4">
                      <p className="font-sans text-xs sm:text-sm text-foreground/90 font-normal leading-relaxed">
                        {cap.description}
                      </p>
                      <Link
                        to={`/work/${cap.projectSlug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 group/link py-0.5"
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

                {/* ── Mobile Direct Explanation (Clean Sans, Zero Hover Dependency) ── */}
                <div className="lg:hidden mt-3 pt-2.5 border-t border-border/40 flex flex-col gap-1.5">
                  <p className="font-sans text-xs text-secondary leading-relaxed">
                    {cap.description}
                  </p>
                  <Link
                    to={`/work/${cap.projectSlug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5"
                  >
                    <span>PROVED IN {cap.projectLabel.toUpperCase()} ↗</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* ─── Understated Footnote ─── */}
        <div className="mt-8 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted">
          <span>// GROUNDED ARCHITECTURE · ZERO BUZZWORDS</span>
          <span className="hidden sm:inline">HOVER A DISCIPLINE TO FOCUS</span>
        </div>
      </Container>
    </section>
  )
}
