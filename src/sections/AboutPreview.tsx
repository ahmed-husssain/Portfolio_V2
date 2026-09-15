import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'

export default function AboutPreview() {
  const highlights = [
    { label: 'LOCATION', value: 'Karachi, Pakistan (PKT / UTC+5)' },
    { label: 'DISCIPLINE', value: 'Full-Stack Web & API Architecture' },
    { label: 'CORE PRINCIPLE', value: 'Data integrity & schema consistency first' },
    { label: 'STATUS', value: 'Available for Select Product Engagements' },
  ]

  return (
    <section id="about" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        <SectionHeading
          index="// 03"
          title="About"
          subtitle="Engineering background, technical mindset, and how I approach building maintainable software."
          meta="[ PERSPECTIVE & FOCUS ]"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-snug mb-6">
              I am a full-stack developer who treats web applications as reliable production systems, not just visual surfaces.
            </h3>

            <div className="space-y-4 text-secondary text-sm sm:text-base leading-relaxed mb-8">
              <p>
                My work spans responsive frontends, type-safe API layers, and structured databases. Rather than chasing ephemeral hype, I value understanding how systems behave under load, enforcing clear domain boundaries, and writing code that is straightforward to debug and extend.
              </p>
              <p>
                Whether designing role-based permissions, structuring PostgreSQL relational tables, or tuning client-side bundles, I prioritize practical solutions that deliver measurable value.
              </p>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-foreground hover:text-secondary transition-colors group"
            >
              <span>READ FULL ABOUT & ENGINEERING PRINCIPLES</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-border bg-surface rounded-sm p-6">
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-border text-xs font-mono text-muted">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="text-foreground font-semibold">// PROFILE SNAPSHOT</span>
              </div>

              <dl className="space-y-4 text-xs font-mono">
                {highlights.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1 pb-3 border-b border-border/60 last:border-0 last:pb-0">
                    <dt className="text-muted tracking-wider uppercase text-[10px]">
                      {item.label}
                    </dt>
                    <dd className="text-foreground font-medium text-xs sm:text-sm">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
