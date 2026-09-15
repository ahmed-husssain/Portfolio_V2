import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function About() {
  useDocumentTitle('About — Ahmed | Full-Stack Web Developer')

  const metadata = [
    { label: 'LOCATION', value: 'Karachi, Pakistan (PKT / UTC+5)' },
    { label: 'DISCIPLINE', value: 'Full-Stack Web & API Development' },
    { label: 'CORE STACK', value: 'React, Next.js, Node.js, PostgreSQL, TypeScript' },
    { label: 'DATABASE FOCUS', value: 'Relational Schema Design & Prisma ORM' },
    { label: 'ARCHITECTURE', value: 'REST APIs, RBAC, Clean Modular Architecture' },
    { label: 'AVAILABILITY', value: 'Open to Select Full-Stack Roles & Contracts' },
  ]

  const principles = [
    {
      index: '01',
      title: 'SYSTEM-FIRST THINKING',
      detail:
        'Prioritizing database modeling, schema normalization, and robust API contracts before building client interfaces. A reliable backend creates an intuitive, predictable frontend.',
    },
    {
      index: '02',
      title: 'PRAGMATIC TOOLING',
      detail:
        'Selecting proven, dependable technologies (Next.js, Node.js, SQL, TypeScript) that directly address project requirements without introducing needless complexity or unstable dependencies.',
    },
    {
      index: '03',
      title: 'MAINTAINABLE CODE',
      detail:
        'Writing readable, strictly typed code with explicit boundaries that teammates can audit, debug, and build upon without tribal knowledge.',
    },
    {
      index: '04',
      title: 'PERFORMANCE AWARENESS',
      detail:
        'Keeping client payloads minimal, optimizing query execution paths, and eliminating decorative runtime overhead to deliver snappy, accessible web experiences.',
    },
  ]

  return (
    <div className="py-16 sm:py-24 md:py-32">
      <Container>
        {/* Page Header */}
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
            I build production-grade web applications, APIs, and digital tools with an emphasis on data integrity, maintainability, and clean architecture.
          </p>
        </header>

        {/* Narrative & Specification Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 sm:mb-24">
          {/* Main Narrative */}
          <div className="lg:col-span-7 space-y-6 text-secondary text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-4">
              Background & Focus
            </h2>

            <p>
              I am a full-stack web developer who enjoys working through the full lifecycle of a digital product—from modeling database relationships and designing RESTful endpoints to crafting fast, accessible, responsive user interfaces.
            </p>

            <p>
              When approaching a new project, I focus on how data moves through the application rather than just how the interface looks. That means spending time understanding user authorization requirements, schema indexing, payload efficiency, and edge cases before writing presentation code.
            </p>

            <p>
              My recent work includes architecting <strong className="text-foreground font-medium">Mockrithm</strong> (an AI-powered technical interview preparation system) and engineering <strong className="text-foreground font-medium">Amber Property Corner</strong> (a multi-role real estate platform built on Next.js, PostgreSQL, and Prisma). In each project, the focus was on solving concrete user problems with dependable, maintainable software.
            </p>

            <div className="pt-6 flex flex-wrap items-center gap-4 text-xs font-mono">
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

          {/* Profile Spec Card */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 pb-3 mb-6 border-b border-border text-xs font-mono text-muted">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="text-foreground font-semibold">// DEVELOPER SPECIFICATION</span>
              </div>

              <dl className="space-y-4 text-xs font-mono">
                {metadata.map((item) => (
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

        {/* Core Principles Section */}
        <section className="pt-12 sm:pt-16 border-t border-border">
          <div className="mb-10 sm:mb-14 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-2">
              <span className="text-foreground font-semibold">// ENGINEERING PERSPECTIVE</span>
              <span>·</span>
              <span>FOUR GUIDING PILLARS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              How I Approach Software Engineering
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
                    <span className="uppercase tracking-wider">PRINCIPLE</span>
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
      </Container>
    </div>
  )
}
