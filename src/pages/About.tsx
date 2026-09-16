import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function About() {
  useDocumentTitle('About — Ahmed | Full-Stack Web Developer')

  const metadata = [
    { label: 'BASED IN', value: 'Karachi, Pakistan' },
    { label: 'FOCUS', value: 'Full-Stack Development' },
    { label: 'CORE STACK', value: 'Next.js, React, TypeScript, PostgreSQL, Prisma, Tailwind CSS' },
    { label: 'INTERESTS', value: 'Backend · System Design · Performance' },
    { label: 'AVAILABILITY', value: 'Open for Full-Stack Engineering Roles & Select Work' },
  ]

  const buildSteps = [
    {
      step: '01',
      title: 'Understand the Requirements',
      detail: 'Clarify core constraints, data volume, and user flows before writing any code.',
    },
    {
      step: '02',
      title: 'Design Data & Application Structure',
      detail: 'Model relational schemas, database constraints, and typed API contracts upfront.',
    },
    {
      step: '03',
      title: 'Build Core Functionality',
      detail: 'Implement the primary workflow with clean, modular code rather than prematurely optimizing edge cases.',
    },
    {
      step: '04',
      title: 'Validate Inputs & Handle Failures',
      detail: 'Implement strict schema validation at API boundaries and handle error states gracefully.',
    },
    {
      step: '05',
      title: 'Test Important Flows',
      detail: 'Verify authentication guards, database queries, and key user actions under realistic conditions.',
    },
    {
      step: '06',
      title: 'Improve Performance Where It Matters',
      detail: 'Audit client bundles, tune database indexing, and eliminate redundant network roundtrips.',
    },
    {
      step: '07',
      title: 'Deploy & Maintain the System',
      detail: 'Configure automated builds, environment variables, and monitor operational health over time.',
    },
  ]

  const principles = [
    {
      index: '01',
      title: 'UNDERSTAND THE SYSTEM',
      detail:
        'Understand how data, APIs, authentication, and application logic connect before changing them. A reliable backend creates a predictable, intuitive frontend.',
    },
    {
      index: '02',
      title: 'KEEP THINGS MAINTAINABLE',
      detail:
        'Prefer clear structures and predictable code over unnecessary abstraction. Writing strictly typed code that teammates can read and debug is far more valuable than clever one-liners.',
    },
    {
      index: '03',
      title: 'BUILD FOR REAL USAGE',
      detail:
        'Think about validation, security, performance, and failure cases—not only whether the happy path works. Production software is defined by how gracefully it handles bad input and system errors.',
    },
    {
      index: '04',
      title: 'IMPROVE CONTINUOUSLY',
      detail:
        'Treat projects as systems that can be measured, reviewed, and improved over time. Measure bottlenecks with real metrics before optimizing.',
    },
  ]

  const currentFocusAreas = [
    {
      area: 'Backend Engineering & API Design',
      note: 'Currently deepening my understanding of modular service boundaries, schema validation, and resilient error handling across RESTful APIs.',
    },
    {
      area: 'Database Architecture & Indexing',
      note: 'Currently deepening my understanding of relational normalization, composite indexing strategies, and query planning in PostgreSQL.',
    },
    {
      area: 'Distributed Systems & Caching Concepts',
      note: 'Currently studying cache-aside patterns, cache invalidation race conditions, and message queues in multi-service environments.',
    },
    {
      area: 'System Performance & Profiling',
      note: 'Currently focusing on minimizing client-side JavaScript execution, eliminating layout shifts, and keeping payload sizes strictly restrained.',
    },
  ]

  return (
    <div className="py-16 sm:py-24 md:py-32">
      <Container>
        {/* ─── 1. Page Header & Short Introduction ─── */}
        <header className="mb-14 sm:mb-20 pb-8 border-b border-border">
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-3">
            <span className="text-foreground font-semibold">// ABOUT AHMED</span>
            <span>·</span>
            <span>FULL-STACK WEB DEVELOPER</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-5">
            Engineering software with system-first thinking and practical discipline.
          </h1>

          <p className="text-secondary text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
            I am a full-stack web developer focused on building real digital products, web applications, and backend systems. I work across frontend interfaces, APIs, relational databases, authentication, and deployment—aiming for software that is reliable, maintainable, and fast.
          </p>
        </header>

        {/* ─── 2. How I Think About Software ─── */}
        <section className="mb-16 sm:mb-24">
          <div className="max-w-3xl space-y-6 text-secondary text-sm sm:text-base leading-relaxed">
            <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
              <span className="text-foreground font-semibold">// PERSPECTIVE</span>
              <span className="uppercase tracking-wider">HOW I THINK ABOUT SOFTWARE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Understanding the complete system, not just the surface.
            </h2>

            <p>
              I do not treat the frontend, API, database, and authentication as isolated pieces. Instead, I focus on understanding how data moves through the entire system and how each technical decision affects reliability, performance, and long-term maintainability.
            </p>

            <p>
              When an interface behaves unexpectedly, the root cause is rarely just CSS or component state—it is often a mismatch between client expectations and database guarantees, an ambiguous API contract, or an unhandled edge case in data validation. By thinking about data integrity and schema consistency first, frontend code becomes simpler, more predictable, and much easier to debug.
            </p>

            <p>
              In production projects like <strong className="text-foreground font-medium">Mockrithm</strong> (an AI-powered technical interview preparation system) and <strong className="text-foreground font-medium">Amber Property Corner</strong> (a multi-role real estate platform), my focus was on architecting reliable workflows where authentication, authorization, and data lookups behave predictably under load.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
              <Link
                to="/work"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page font-semibold rounded-sm hover:bg-secondary transition-colors"
              >
                <span>EXPLORE CASE STUDIES</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="https://github.com/ahmed-husssain"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-border bg-surface text-foreground font-semibold rounded-sm hover:border-border-strong transition-colors"
              >
                <span>GITHUB PROFILE</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* ─── 3. How I Build ─── */}
        <section className="mb-16 sm:mb-24 pt-12 border-t border-border">
          <div className="mb-10 sm:mb-12 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-2">
              <span className="text-foreground font-semibold">// WORKFLOW</span>
              <span>·</span>
              <span>ENGINEERING APPROACH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              How I Approach Building
            </h2>
            <p className="text-secondary text-sm sm:text-base mt-2 leading-relaxed">
              A practical, disciplined sequence for turning requirements into maintainable software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildSteps.map((b) => (
              <div
                key={b.step}
                className="border border-border bg-surface rounded-sm p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted pb-3 mb-3 border-b border-border">
                    <span className="text-foreground font-semibold">STEP {b.step}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight mb-2">
                    {b.title}
                  </h3>
                  <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                    {b.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 4. Engineering Principles ─── */}
        <section className="mb-16 sm:mb-24 pt-12 border-t border-border">
          <div className="mb-10 sm:mb-12 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-2">
              <span className="text-foreground font-semibold">// PRINCIPLES</span>
              <span>·</span>
              <span>FOUR GUIDING PILLARS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Core Engineering Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {principles.map((p) => (
              <div
                key={p.index}
                className="border border-border bg-surface rounded-sm p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted mb-4 pb-3 border-b border-border">
                    <span className="text-foreground font-semibold">#{p.index}</span>
                    <span className="uppercase tracking-wider">PILLAR</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight mb-3">
                    {p.title}
                  </h3>

                  <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                    {p.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. Current Focus ─── */}
        <section className="mb-16 sm:mb-24 pt-12 border-t border-border">
          <div className="mb-10 sm:mb-12 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-2">
              <span className="text-foreground font-semibold">// CONTINUOUS GROWTH</span>
              <span>·</span>
              <span>AREAS OF ACTIVE STUDY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Current Technical Focus
            </h2>
            <p className="text-secondary text-sm sm:text-base mt-2 leading-relaxed">
              Topics and system concepts I am actively studying, implementing in side projects, and working to improve.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentFocusAreas.map((f) => (
              <div
                key={f.area}
                className="border border-border bg-surface rounded-sm p-6"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-muted pb-3 mb-3 border-b border-border">
                  <CheckCircle2 className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                  <span className="text-foreground font-semibold uppercase">FOCUS AREA</span>
                </div>
                <h3 className="text-base font-semibold text-foreground tracking-tight mb-2">
                  {f.area}
                </h3>
                <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                  {f.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 6. Developer Profile Metadata ─── */}
        <section className="pt-12 border-t border-border">
          <div className="max-w-2xl">
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 pb-3 mb-6 border-b border-border text-xs font-mono text-muted">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="text-foreground font-semibold">// DEVELOPER METADATA</span>
              </div>

              <dl className="space-y-4 text-xs font-mono">
                {metadata.map((item) => (
                  <div key={item.label} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pb-3 border-b border-border/60 last:border-0 last:pb-0">
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
        </section>
      </Container>
    </div>
  )
}
