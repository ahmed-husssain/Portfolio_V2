import { ArrowRight, ArrowUpRight, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function About() {
  useDocumentTitle('About — Ahmed | Backend-Focused .NET Developer')

  const metadata = [
    { label: 'BASED IN', value: 'Karachi, Pakistan' },
    { label: 'FOCUS', value: 'Backend & Web Development (.NET)' },
    { label: 'CORE STACK', value: 'C#, ASP.NET Core, EF Core, SQL Server, MySQL, React, Tailwind CSS' },
    { label: 'RECOGNITION', value: 'Runner-Up – Aptech Vision 2025 (Project: Mockrithm)' },
    { label: 'AVAILABILITY', value: 'Open for Backend & Full-Stack Engineering Roles' },
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
    <div className="py-16 sm:py-24 md:py-32">
      <Container>
        {/* ─── 1. Page Header & Short Introduction ─── */}
        <header className="mb-14 sm:mb-20 pb-8 border-b border-border">
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-3">
            <span className="text-foreground font-semibold">// ABOUT AHMED</span>
            <span>·</span>
            <span>BACKEND-FOCUSED .NET DEVELOPER</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-5">
            Building scalable web applications and reliable APIs with clean architecture.
          </h1>

          <p className="text-secondary text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
            Backend-focused .NET Developer with hands-on experience building web applications using C#, ASP.NET Core MVC, Web API, Entity Framework Core, and SQL Server. I focus on clean architecture, query performance, and reliable database design.
          </p>
        </header>

        {/* ─── 2. Perspective ─── */}
        <Reveal>
          <section className="mb-16 sm:mb-24">
            <div className="max-w-3xl space-y-6 text-secondary text-sm sm:text-base leading-relaxed">
              <div className="flex items-center gap-2 text-xs font-mono text-muted pb-2 border-b border-border">
                <span className="text-foreground font-semibold">// PERSPECTIVE</span>
                <span className="uppercase tracking-wider">HOW I BUILD SOFTWARE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                Understanding the complete system under the hood.
              </h2>

              <p>
                I build software with a focus on data integrity, clear domain boundaries, and predictable API behavior. Rather than only focusing on visual appearance, I prioritize understanding how data moves through the database, how endpoints respond under load, and how security is enforced.
              </p>

              <p>
                From architecting automated bidding engines and multi-provider OAuth 2.0 authentication in <strong className="text-foreground font-medium">Online Art Gallery</strong> to engineering <strong className="text-foreground font-medium">Mockrithm</strong> and <strong className="text-foreground font-medium">E-Books</strong>, I strive to write software that is dependable, readable, and easy to scale.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                <Link
                  to="/work"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page font-semibold rounded-sm hover:bg-secondary active:scale-[0.98] transition-all"
                >
                  <span>EXPLORE PROJECTS</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <a
                  href="https://github.com/ahmed-husssain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-border bg-surface text-foreground font-semibold rounded-sm hover:border-border-strong active:scale-[0.98] transition-all"
                >
                  <span>GITHUB PROFILE</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
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

            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 max-w-2xl hover:border-border-strong transition-colors duration-200">
              <div className="flex items-center gap-3 text-xs font-mono text-muted pb-3 mb-4 border-b border-border">
                <Trophy className="w-4 h-4 text-emerald-500" aria-hidden="true" />
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
                  className="border border-border bg-surface rounded-sm p-6 flex flex-col justify-between hover:border-border-strong transition-colors duration-200"
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
                  className="border border-border bg-surface rounded-sm p-6 sm:p-8 flex flex-col justify-between hover:border-border-strong transition-colors duration-200"
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
        </Reveal>
      </Container>
    </div>
  )
}
