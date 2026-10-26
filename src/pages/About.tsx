import {
  ExternalLink,
  FileText,
  Calendar,
  Github,
  User,
  ArrowRight,
} from 'pixelarticons/react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import Reveal from '../components/motion/Reveal'
import PageHeader from '../components/ui/PageHeader'
import ContinuityBridge from '../components/ui/ContinuityBridge'
import CopyButton from '../components/ui/CopyButton'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function About() {
  useDocumentTitle('About Ahmed — Software & Backend Developer in Karachi')

  const timelineItems = [
    {
      period: 'APR 2026 – PRESENT',
      role: 'Software Developer (Remote)',
      entity: 'Shifa Healthcare Karachi',
      badge: 'CURRENT ROLE · REMOTE',
      points: [
        'Engineering cross-platform clinical operations, dynamic fee billing, and 14-day renewal alerts.',
        'Engineered automated WhatsApp invoice PDF generation & verified API dispatch pipeline.',
        'Architected PostgreSQL Row-Level Security (RLS) & atomic row locking for zero duplicate invoices.',
      ],
      tag: 'C# · Flutter · Supabase · PostgreSQL · Riverpod',
    },
    {
      period: 'JAN 2025',
      role: 'Runner-Up – Aptech Vision 2025',
      entity: 'Aptech Vision Software Competition',
      badge: 'COMPETITIVE AWARD · SINDH',
      points: [
        'Awarded Runner-Up out of competing regional software engineering teams across Sindh.',
        'Engineered Mockrithm: AI technical interview platform with speech evaluation and in-browser code editor.',
      ],
      tag: 'AI Simulator · Aptech Vision Award · Next.js · TypeScript',
    },
    {
      period: '2023 – 2025',
      role: 'Software Engineering Diploma',
      entity: 'Aptech Computer Education Karachi',
      badge: 'ACADEMIC CREDENTIAL',
      points: [
        'Rigorous diploma training in C#, object-oriented programming, and ASP.NET Core MVC/API.',
        'Extensive practice in relational database design (3NF), SQL Server indexing, and ACID transactions.',
      ],
      tag: 'C# · ASP.NET Core · SQL Server · RDBMS Modeling',
    },
    {
      period: 'PRESENT',
      role: 'Available for Engineering Roles',
      entity: 'Full-Stack & Backend Positions',
      badge: 'STATUS: AVAILABLE',
      points: [
        'Open for full-time backend and full-stack software engineering positions.',
        'Available for remote roles worldwide and on-site engineering in Karachi.',
      ],
      tag: 'Remote Worldwide · Karachi On-Site · Full-Time / Contract',
    },
  ]

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
      <Container>
        {/* ─── 1. Header (Direct Dossier Vitals) ─── */}
        <PageHeader
          className="mb-8 sm:mb-10 pb-6 border-b border-border"
          titleSize="display"
          eyebrow={
            <>
              <span className="text-foreground font-semibold shrink-0">ENGINEER DOSSIER</span>
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                SYED AHMED HUSSAIN
              </span>
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="shrink-0">KARACHI, PK</span>
            </>
          }
          title="About Ahmed Hussain"
          description="Software Developer currently working remotely for Shifa Healthcare Karachi. Specialized in C# / .NET 8, relational database architecture, and verified full-stack systems."
        />

        {/* ─── 2. Current Status & Vitals HUD (Open & Immediate) ─── */}
        <Reveal>
          <section className="mb-14 sm:mb-20">
            <div className="border border-border bg-surface rounded-sm overflow-hidden pixel-corners shadow-sm">
              <div className="flex items-center justify-between border-b border-border bg-surface-subtle/50 px-4 py-2.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-foreground font-semibold">DEVELOPER VITALS</span>
                  <span className="text-border-strong">·</span>
                  <span>CURRENT REMOTE SETUP</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-2xs border border-emerald-500/20">
                  ● ACTIVE DEV
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xs border border-border/80 bg-page/50 space-y-1">
                    <span className="text-[10px] text-muted uppercase tracking-widest block">
                      CURRENT ROLE
                    </span>
                    <span className="text-foreground font-semibold text-sm block">
                      Software Developer (Remote)
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium block">
                      Shifa Healthcare Karachi (Apr 2026 – Present)
                    </span>
                  </div>

                  <div className="p-4 rounded-xs border border-border/80 bg-page/50 space-y-1">
                    <span className="text-[10px] text-muted uppercase tracking-widest block">
                      LOCATION & TIMEZONE
                    </span>
                    <span className="text-foreground font-semibold text-sm block">
                      Karachi, Pakistan (PK)
                    </span>
                    <span className="text-secondary text-xs block">
                      PKT (UTC+5) · Remote Worldwide & On-site
                    </span>
                  </div>

                  <div className="p-4 rounded-xs border border-border/80 bg-page/50 space-y-1">
                    <span className="text-[10px] text-muted uppercase tracking-widest block">
                      CORE SPECIALIZATION
                    </span>
                    <span className="text-foreground font-semibold text-sm block">
                      Backend & Full-Stack Systems
                    </span>
                    <span className="text-secondary text-xs block">
                      C#, ASP.NET Core, SQL Server, PostgreSQL, Flutter
                    </span>
                  </div>

                  <div className="p-4 rounded-xs border border-border/80 bg-page/50 space-y-1">
                    <span className="text-[10px] text-muted uppercase tracking-widest block">
                      EMPLOYMENT AVAILABILITY
                    </span>
                    <span className="text-foreground font-semibold text-sm block flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Open for Engineering Roles
                    </span>
                    <span className="text-secondary text-xs block">
                      Full-Time, Contract, Remote & On-Site
                    </span>
                  </div>
                </div>

                {/* 1-Click Verification Links & Copy Email */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-foreground text-page font-semibold hover:bg-secondary active:scale-[0.96] transition-all shadow-2xs"
                  >
                    <FileText className="w-4 h-4 pixel-icon" />
                    <span>OFFICIAL RESUME (PDF)</span>
                    <span className="text-[10px]">↓</span>
                  </a>

                  <CopyButton
                    text="ahmedhusssain.dev@gmail.com"
                    label="COPY EMAIL"
                    copiedLabel="EMAIL COPIED ✓"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xs border border-border bg-page text-foreground font-semibold hover:border-border-strong active:scale-[0.96] transition-all cursor-pointer"
                  />

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xs border border-border bg-page text-secondary hover:text-foreground font-semibold hover:border-border-strong active:scale-[0.96] transition-all"
                  >
                    <span>CONTACT FORM</span>
                    <ArrowRight className="w-3.5 h-3.5 pixel-icon text-emerald-500" />
                  </Link>

                  <a
                    href="https://github.com/ahmed-husssain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xs border border-border bg-page text-secondary hover:text-foreground font-semibold hover:border-border-strong active:scale-[0.96] transition-all"
                  >
                    <Github className="w-3.5 h-3.5 pixel-icon" />
                    <span>GITHUB @ahmed-husssain</span>
                    <ExternalLink className="w-3 h-3 text-muted" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ─── 3. Verifiable Career & Credential Timeline ─── */}
        <Reveal>
          <section className="mb-16 sm:mb-24">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                <Calendar className="w-3.5 h-3.5 pixel-icon text-emerald-500" />
                <span className="text-foreground font-semibold">CAREER TRAJECTORY</span>
                <span>·</span>
                <span>VERIFIABLE MILESTONES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                Experience & Credentials
              </h2>
            </div>

            {/* Vertical Timeline Stream */}
            <div className="relative pl-6 sm:pl-8 border-l border-border/80 space-y-8 sm:space-y-10">
              {timelineItems.map((item, idx) => (
                <div key={item.period} className="relative group">
                  {/* Glowing Timeline Node */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-page ${
                      idx === 0
                        ? 'bg-emerald-500 ring-4 ring-emerald-500/20'
                        : idx === 1
                        ? 'bg-amber-500'
                        : 'bg-border-strong'
                    }`}
                    aria-hidden="true"
                  />

                  {/* Card Container */}
                  <div className="border border-border bg-surface rounded-sm p-5 sm:p-6 hover:border-border-strong transition-all pixel-corners">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3 mb-3 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.period}
                        </span>
                        <span className="text-border-strong">·</span>
                        <span className="text-muted text-[10px] uppercase font-semibold">
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted">{item.tag}</span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground tracking-tight mb-0.5">
                      {item.role}
                    </h3>
                    <p className="text-xs font-mono text-secondary mb-3">
                      {item.entity}
                    </p>

                    <ul className="space-y-1.5 text-xs font-mono text-secondary">
                      {item.points.map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <span className="text-emerald-500 shrink-0 select-none">›</span>
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ─── 4. Direct Action & Verification Dock ─── */}
        <Reveal>
          <section className="mb-14 sm:mb-20 pt-8 border-t border-border">
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 pixel-corners">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-1">
                    <User className="w-3.5 h-3.5 pixel-icon text-emerald-500" />
                    <span className="text-foreground font-semibold">DIRECT CONTACT & RECRUITMENT</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                    Hire Ahmed for Your Engineering Team
                  </h3>
                  <p className="text-xs font-mono text-secondary mt-1 max-w-xl">
                    Available for full-time backend and full-stack software engineering roles.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs shrink-0">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-page font-semibold rounded-xs hover:bg-secondary active:scale-[0.96] transition-all shadow-2xs"
                  >
                    <FileText className="w-4 h-4 pixel-icon" />
                    <span>DOWNLOAD CV (PDF)</span>
                  </a>

                  <CopyButton
                    text="ahmedhusssain.dev@gmail.com"
                    label="COPY EMAIL"
                    copiedLabel="COPIED ✓"
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-page text-foreground font-semibold rounded-xs hover:border-border-strong active:scale-[0.96] transition-all cursor-pointer"
                  />

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-page text-secondary hover:text-foreground font-semibold hover:border-border-strong active:scale-[0.96] transition-all"
                  >
                    <span>CONTACT FORM</span>
                    <ArrowRight className="w-3.5 h-3.5 pixel-icon text-emerald-500" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ─── 5. Forward Continuity Bridge to Work ─── */}
        <ContinuityBridge
          kicker="PROJECT CATALOG"
          title="Explore Production Systems & Case Studies"
          description="Inspect live systems, SignalR concurrency diagrams, and clinical workflows built by Ahmed."
          to="/work"
          actionLabel="EXPLORE PRODUCTION CODE"
          className="mt-10 sm:mt-14"
        />
      </Container>
    </div>
  )
}
