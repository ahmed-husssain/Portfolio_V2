import { useEffect } from 'react'
import {
  ExternalLink,
  FileText,
  Calendar,
  Github,
  Mail,
} from 'pixelarticons/react'
import { useLocation } from 'react-router-dom'
import Container from '../components/ui/Container'
import Reveal from '../components/motion/Reveal'
import PageHeader from '../components/ui/PageHeader'
import ContinuityBridge from '../components/ui/ContinuityBridge'
import CopyButton from '../components/ui/CopyButton'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { CONTACT_CONFIG } from '../data/contact'

export default function About() {
  useDocumentTitle('About Ahmed — Software & Backend Developer in Karachi')

  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#contact') {
      const el = document.getElementById('contact')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location.hash])

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

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xs border border-border bg-page text-secondary hover:text-foreground font-semibold hover:border-border-strong active:scale-[0.96] transition-all"
                  >
                    <span>DIRECT CHANNELS</span>
                    <span className="text-emerald-500 font-mono">↓</span>
                  </a>

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

        {/* ─── 4. Connect & Direct Channels (4-Column Horizontal Strip) ─── */}
        <Reveal>
          <section id="contact" className="mb-16 sm:mb-24 pt-8 border-t border-border scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-1">
                  <span className="text-emerald-500 font-bold">// 04</span>
                  <span className="text-border-strong">·</span>
                  <span className="text-foreground font-semibold">DIRECT CHANNELS & CONTACT</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                  Get in Touch
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted">
                <span>📍 {CONTACT_CONFIG.location.city}, {CONTACT_CONFIG.location.country} (PKT / UTC+5)</span>
                <span className="text-border-strong hidden sm:inline">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-2xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                  Active Inbox &lt; 24H
                </span>
              </div>
            </div>

            {/* 4 Columns Sitting Side-by-Side in 1 Horizontal Line */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              {/* Col 1: Direct Email */}
              <div className="p-4 border border-border bg-surface rounded-xs pixel-corners flex flex-col justify-between h-40 hover:border-border-strong transition-all">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-muted uppercase tracking-wider mb-2 font-semibold">
                    <span className="text-foreground">PRIMARY INBOX</span>
                    <Mail className="w-3.5 h-3.5 text-emerald-500 pixel-icon" aria-hidden="true" />
                  </div>
                  <div className="text-xs font-bold text-foreground truncate" title={CONTACT_CONFIG.email}>
                    {CONTACT_CONFIG.email}
                  </div>
                  <div className="text-[10px] text-secondary mt-1">Direct inquiries & opportunities</div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <a
                    href={`mailto:${CONTACT_CONFIG.email}`}
                    className="flex-1 py-1.5 text-center bg-foreground text-page font-bold text-[11px] rounded-xs hover:bg-secondary transition-colors"
                  >
                    SEND ↗
                  </a>
                  <CopyButton
                    text={CONTACT_CONFIG.email}
                    label="COPY"
                    copiedLabel="COPIED ✓"
                    className="px-2.5 py-1.5 border border-border bg-page text-foreground hover:border-border-strong text-[11px] font-semibold rounded-xs active:scale-95 transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Col 2: LinkedIn */}
              <a
                href={CONTACT_CONFIG.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-border bg-surface rounded-xs pixel-corners flex flex-col justify-between h-40 group hover:border-border-strong transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-muted uppercase tracking-wider mb-2 font-semibold">
                    <span className="text-foreground">LINKEDIN</span>
                    <span className="text-foreground font-mono font-bold text-xs">in</span>
                  </div>
                  <div className="text-xs font-bold text-foreground group-hover:text-emerald-500 transition-colors truncate">
                    {CONTACT_CONFIG.linkedin.handle}
                  </div>
                  <div className="text-[10px] text-secondary mt-1">Experience, background & network</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] text-foreground font-semibold">
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500 pixel-icon transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </a>

              {/* Col 3: GitHub */}
              <a
                href={CONTACT_CONFIG.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-border bg-surface rounded-xs pixel-corners flex flex-col justify-between h-40 group hover:border-border-strong transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-muted uppercase tracking-wider mb-2 font-semibold">
                    <span className="text-foreground">GITHUB</span>
                    <Github className="w-3.5 h-3.5 text-foreground pixel-icon" aria-hidden="true" />
                  </div>
                  <div className="text-xs font-bold text-foreground group-hover:text-emerald-500 transition-colors truncate">
                    {CONTACT_CONFIG.github.handle}
                  </div>
                  <div className="text-[10px] text-secondary mt-1">Production code & repositories</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] text-foreground font-semibold">
                  <span>Inspect Repositories</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500 pixel-icon transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </a>

              {/* Col 4: Official Resume */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xs pixel-corners flex flex-col justify-between h-40 group hover:border-emerald-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 font-semibold">
                    <span>OFFICIAL RESUME</span>
                    <span className="font-mono text-[9px] px-1 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xs">PDF</span>
                  </div>
                  <div className="text-xs font-bold text-foreground group-hover:text-emerald-500 transition-colors truncate">
                    syed_ahmed_hussain
                  </div>
                  <div className="text-[10px] text-secondary mt-1">C#, .NET 8, SQL Server, PostgreSQL</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Download Official CV</span>
                  <span className="text-xs transition-transform group-hover:translate-y-0.5" aria-hidden="true">↓</span>
                </div>
              </a>
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
