import { ArrowRight, ExternalLink, Trophy, FileText } from 'pixelarticons/react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function About() {
  useDocumentTitle('About — Syed Ahmed Hussain | Software & Website Developer in Karachi')

  const metadata = [
    { label: 'BASED IN', value: 'Karachi, Pakistan (Remote & On-site)' },
    { label: 'FOCUS', value: 'Software & Website Development (.NET, Full-Stack)' },
    { label: 'CORE STACK', value: 'C#, ASP.NET Core, EF Core, SQL Server, React, TypeScript' },
    { label: 'RECOGNITION', value: 'Runner-Up – Aptech Vision 2025 (Project: Mockrithm)' },
    { label: 'AVAILABILITY', value: 'Open for Backend & Full-Stack Engineering Roles' },
    { label: 'RESUME / CV', value: 'Official Resume (PDF)', href: '/resume.pdf' },
  ]

  const buildSteps = [
    {
      step: '01',
      title: 'Understand Requirements',
      detail: 'Clarify core constraints, data volume, and user flows before writing any code.',
    },
    {
      step: '02',
      title: 'Design Schema & APIs',
      detail: 'Model relational database tables, foreign keys, indexing, and typed API endpoints.',
    },
    {
      step: '03',
      title: 'Build Modular Logic',
      detail: 'Implement controllers, services, and business rules with clean separation of concerns.',
    },
    {
      step: '04',
      title: 'Test, Optimize & Deploy',
      detail: 'Validate endpoints, optimize query performance, and ensure production reliability.',
    },
  ]

  const principles = [
    {
      index: '01',
      title: 'CLEAN ARCHITECTURE',
      detail:
        'Keeping controllers lean, business logic modular, and data access decoupled for easy maintenance.',
    },
    {
      index: '02',
      title: 'DATA INTEGRITY',
      detail:
        'Designing relational schemas with proper normalization, foreign keys, and indexing to ensure query speed.',
    },
    {
      index: '03',
      title: 'SECURE BY DEFAULT',
      detail:
        'Implementing OAuth 2.0 multi-provider authentication and role-based access control (RBAC) securely.',
    },
    {
      index: '04',
      title: 'PRAGMATIC DISCIPLINE',
      detail:
        'Writing readable, maintainable code with clear error handling instead of unnecessary complexity.',
    },
  ]

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
      <Container>
        {/* ─── 1. Page Header & Short Introduction ─── */}
        <header className="mb-8 sm:mb-12 pb-6 border-b border-border">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] sm:text-xs font-mono text-muted uppercase tracking-wider mb-4">
            <span className="text-foreground font-semibold shrink-0">// ABOUT AHMED</span>
            <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
            <span className="shrink-0">BACKEND-FOCUSED .NET DEVELOPER</span>
          </div>

          <h1 className="text-display text-foreground mb-5 sm:mb-6 max-w-3xl">
            Building reliable web applications and clean APIs with modern tools.
          </h1>

          <p className="text-body-lead text-secondary max-w-3xl mb-2">
            Full-stack and backend developer working with C#, ASP.NET Core, SQL Server, and Flutter. I enjoy taking features from database schema design and business logic all the way to a clean, usable frontend.
          </p>
        </header>

        {/* ─── 2. Perspective ─── */}
        <Reveal>
          <section className="mb-16 sm:mb-24">
            <div className="max-w-3xl space-y-6 text-secondary text-sm sm:text-base leading-relaxed">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <span className="text-foreground font-semibold">// PERSPECTIVE</span>
                <span className="text-micro-caps text-secondary">HOW I BUILD SOFTWARE</span>
              </div>

              <h2 className="text-title-1 text-foreground">
                Understanding the complete system under the hood.
              </h2>

              <p className="text-secondary leading-relaxed">
                I focus on building software that is dependable, well-structured, and easy to maintain. Whether preventing race conditions in a live auction app or structuring database tables for healthcare records, I care deeply about getting the fundamentals right: solid data models, clear API contracts, and responsive user experiences.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3.5 text-xs font-mono">
                <Link
                  to="/work"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page font-semibold rounded-xs hover:bg-secondary active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out select-none shadow-2xs group"
                  style={{ boxShadow: 'var(--hairline-top)' }}
                >
                  <span>EXPLORE PROJECTS</span>
                  <ArrowRight className="w-4 h-4 pixel-icon transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-surface text-foreground font-semibold rounded-xs hover:border-border-strong active:scale-[0.96] transition-[background-color,border-color,transform] duration-150 ease-out select-none shadow-2xs group"
                  style={{ boxShadow: 'var(--hairline-top)' }}
                >
                  <FileText className="w-4 h-4 text-emerald-500 pixel-icon" />
                  <span>OFFICIAL RESUME (PDF)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-foreground pixel-icon transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
                <a
                  href="https://github.com/ahmed-husssain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-border bg-surface text-secondary hover:text-foreground font-semibold rounded-xs hover:border-border-strong active:scale-[0.96] transition-[background-color,border-color,transform] duration-150 ease-out select-none shadow-2xs group"
                  style={{ boxShadow: 'var(--hairline-top)' }}
                >
                  <span>GITHUB PROFILE</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-foreground pixel-icon transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ─── 3. Recognition & Award (Only Aptech Vision 2025 as requested) ─── */}
        <Reveal>
          <section className="mb-16 sm:mb-24 pt-12 border-t border-border">
            <div className="mb-8 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-2">
                <span className="text-foreground font-semibold">// RECOGNITION</span>
                <span>·</span>
                <span>KEY ACHIEVEMENT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                Honors & Recognition
              </h2>
            </div>

            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 max-w-2xl hover:border-border-strong transition-colors duration-200 pixel-corners">
              <div className="flex items-center gap-3 text-xs font-mono text-muted pb-3 mb-4 border-b border-border">
                <Trophy className="w-4 h-4 text-emerald-500 pixel-icon" aria-hidden="true" />
                <span className="text-foreground font-semibold uppercase">AWARD</span>
                <span>·</span>
                <span>APTECH VISION 2025</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-2">
                Runner-Up – Aptech Vision 2025
              </h3>
              <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                Project: <strong className="text-foreground font-medium">Mockrithm</strong> — Awarded Runner-Up out of multiple competing software projects for developing an AI-driven interview preparation web platform designed to help students practice technical interviews.
              </p>
            </div>
          </section>
        </Reveal>

        {/* ─── 4. How I Build ─── */}
        <Reveal>
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
                A practical sequence for turning requirements into maintainable, production-ready software.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buildSteps.map((b) => (
                <div
                  key={b.step}
                  className="border border-border bg-surface rounded-sm p-6 flex flex-col justify-between hover:border-border-strong transition-colors duration-200 pixel-corners"
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
        </Reveal>

        {/* ─── 5. Engineering Principles ─── */}
        <Reveal>
          <section className="mb-16 sm:mb-24 pt-12 border-t border-border">
            <div className="mb-10 sm:mb-12 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-2">
                <span className="text-foreground font-semibold">// PRINCIPLES</span>
                <span>·</span>
                <span>CORE PILLARS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                Core Engineering Principles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {principles.map((p) => (
                <div
                  key={p.index}
                  className="border border-border bg-surface rounded-sm p-6 sm:p-8 flex flex-col justify-between hover:border-border-strong transition-colors duration-200 pixel-corners"
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
        </Reveal>

        {/* ─── 6. Developer Profile Metadata ─── */}
        <Reveal>
          <section className="pt-12 border-t border-border">
            <div className="max-w-2xl">
              <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 pixel-corners">
                <div className="flex items-center gap-2 pb-3 mb-6 border-b border-border text-xs font-mono text-muted">
                  <span className="pixel-beacon bg-emerald-500" aria-hidden="true" />
                  <span className="text-foreground font-semibold">// DEVELOPER METADATA</span>
                </div>

                <dl className="space-y-4 text-xs font-mono">
                  {metadata.map((item) => (
                    <div key={item.label} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pb-3 border-b border-border/60 last:border-0 last:pb-0">
                      <dt className="text-muted tracking-wider uppercase text-[10px]">
                        {item.label}
                      </dt>
                      <dd className="text-foreground font-medium text-xs sm:text-sm">
                        {'href' in item && item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-foreground hover:underline font-semibold text-emerald-600 dark:text-emerald-400 group"
                          >
                            <FileText className="w-3.5 h-3.5 pixel-icon" />
                            <span>{item.value}</span>
                            <ExternalLink className="w-3 h-3 text-muted group-hover:text-foreground pixel-icon transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </a>
                        ) : (
                          item.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        </Reveal>
      </Container>
    </div>
  )
}
