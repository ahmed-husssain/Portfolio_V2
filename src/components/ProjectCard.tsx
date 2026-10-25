import { useState, useRef, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ExternalLink, ArrowRight, Cpu, GitCommit, Github } from 'pixelarticons/react'
import type { Project } from '../data/projects'
import { useGitHubCommit } from '../hooks/useGitHubCommit'

// Lazy-load heavy simulation engine only when requested
const ArchitectureModal = lazy(() => import('./ArchitectureModal'))

/** Shorten a category string to a compact label for the header bar */
function shortCategory(cat: string): string {
  return cat
    .replace(/\s*\/\s*Full-Stack Web Application/i, '')
    .replace(/\s*\/\s*Web Application/i, '')
    .replace(/\s*\/\s*Mobile Application/i, '')
    .replace(/Full-Stack\s*/i, '')
    .trim()
    .toUpperCase()
}

function formatCompactDate(label?: string): string {
  if (!label) return ''
  const trimmed = label.trim()

  const withDayMatch = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/)
  if (withDayMatch) {
    const [, month, day, year] = withDayMatch
    if (year === '2026' || year === new Date().getFullYear().toString()) {
      return `${month} ${day}`
    }
    return `${month} '${year.slice(-2)}`
  }

  const monthYearMatch = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (monthYearMatch) {
    const [, month, year] = monthYearMatch
    return `${month} '${year.slice(-2)}`
  }

  return trimmed
}

/** Editorial serif italic subtitle accent (Snellenberg boutique design) */
function getProjectEditorialSubtitle(slug: string): string {
  switch (slug) {
    case 'online-art-gallery':
      return 'Live Concurrency'
    case 'shifamanagement':
      return 'Atomic Billing'
    case 'mockrithm':
      return 'Aptech Vision Runner-Up'
    case 'amber-property-corner':
      return 'Indexed Queries'
    case 'e-books':
      return 'Relational Library'
    default:
      return 'Production System'
  }
}

/** Live status telemetry badge text */
function getProjectLiveBadge(project: Project): string {
  switch (project.slug) {
    case 'online-art-gallery':
      return 'SignalR WebSocket Stream'
    case 'shifamanagement':
      return 'PostgreSQL Row-Level Security'
    case 'mockrithm':
      return 'Aptech Vision 2025 Runner-Up'
    case 'amber-property-corner':
      return 'Indexed PostgreSQL Engine'
    case 'e-books':
      return 'MySQL Relational Schema'
    default:
      return shortCategory(project.category)
  }
}

/** Micro-tag for mobile cover vignette */
function getProjectCategoryTag(project: Project): string {
  switch (project.slug) {
    case 'online-art-gallery':
      return '// CONCURRENCY & STREAMING ENGINE'
    case 'shifamanagement':
      return '// CLINICAL OPERATIONS & RLS'
    case 'mockrithm':
      return '// AI CONVERSATIONAL SIMULATOR'
    case 'amber-property-corner':
      return '// INDEXED SEARCH ENGINE'
    case 'e-books':
      return '// NORMALIZED RELATIONAL LIBRARY'
    default:
      return `// ${shortCategory(project.category)}`
  }
}

/** Micro safeguard headline */
function getSafeguardLabel(slug: string): string {
  switch (slug) {
    case 'online-art-gallery':
      return 'CONCURRENCY SAFEGUARD'
    case 'shifamanagement':
      return 'ATOMIC SAFEGUARD'
    case 'mockrithm':
      return 'SYSTEM SPECIFICATION'
    case 'amber-property-corner':
      return 'DATABASE TUNING'
    case 'e-books':
      return 'RELATIONAL ARCHITECTURE'
    default:
      return 'CORE SAFEGUARD'
  }
}

/** Specification table Row 1 label */
function getSpecLabel1(slug: string): string {
  switch (slug) {
    case 'online-art-gallery':
      return 'CONCURRENCY'
    case 'mockrithm':
      return 'AI SIMULATOR'
    case 'amber-property-corner':
      return 'DATA MODEL'
    case 'e-books':
      return 'AUTH & SESSIONS'
    default:
      return 'SAFEGUARD'
  }
}

/** Specification table Row 2 label */
function getSpecLabel2(slug: string): string {
  switch (slug) {
    case 'online-art-gallery':
      return 'IDEMPOTENCY'
    case 'mockrithm':
      return 'EVALUATION'
    case 'amber-property-corner':
      return 'INDEX TUNING'
    case 'e-books':
      return 'SCHEMA KERNEL'
    default:
      return 'ARCHITECTURE'
  }
}

interface ProjectCardProps {
  project: Project
  className?: string
  index?: number
}

export default function ProjectCard({ project, className = '', index }: ProjectCardProps) {
  const navigate = useNavigate()
  const isFlagship = Boolean(project.featured)
  const [isArchModalOpen, setIsArchModalOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const hasArchitectureInspector =
    project.slug === 'online-art-gallery' || project.slug === 'shifamanagement'

  const { commitLabel } = useGitHubCommit(
    project.githubUrl,
    project.lastCommitLabel,
    project.lastCommitDate
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    // Ignore clicks on child links, buttons, or action triggers
    if (target.closest('a, button, input, [role="button"], [data-no-card-click]')) {
      return
    }
    navigate(`/work/${project.slug}`)
  }

  const editorialSubtitle = getProjectEditorialSubtitle(project.slug)
  const liveBadgeText = getProjectLiveBadge(project)
  const categoryTag = getProjectCategoryTag(project)
  const safeguardLabel = getSafeguardLabel(project.slug)

  return (
    <>
    <article
      ref={cardRef}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor-text="VIEW CASE STUDY ↗"
      className={`project-card group relative border bg-surface hover:bg-surface-hover hover:border-border-strong hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-[0.99] transition-[transform,background-color,border-color,box-shadow,opacity] duration-250 ease-out rounded-sm overflow-hidden flex flex-col lg:flex-row pixel-corners cursor-pointer ${
        isFlagship ? 'border-border-strong shadow-2xs' : 'border-border'
      } ${className}`}
      style={{ boxShadow: 'var(--hairline-top)' }}
    >
      {/* ─── Ambient Spotlight Glow (Desktop Hover) ─── */}
      <div
        className="pointer-events-none absolute -inset-px rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden lg:block"
        style={{
          background: isHovered
            ? `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 70%)`
            : '',
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE VIEW (<1024px): Apple Design Clean Frame (Zero-Overlap)
          1. Header + Title + Italic Accent in dedicated typographic whitespace
          2. Pure Screenshot Preview Window (no text fighting screenshot text)
          3. Hairline Safeguard Callout with full-width text wrapping
          4. Dedicated Tech Stack Chips Row (no button collision)
          5. Generous 40px Touch Action Dock (50/50 split, zero overlapping)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden w-full flex flex-col">
        {/* ── Top Header Bar (Dedicated Whitespace, Zero Text Overlap) ── */}
        <div className="p-4 pb-3 flex flex-col gap-1.5 border-b border-border/60 bg-surface">
          <div className="flex items-center justify-between gap-2 text-micro-caps">
            <div className="flex items-center gap-1.5 min-w-0">
              {index !== undefined && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  #{index.toString().padStart(2, '0')}
                </span>
              )}
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate font-mono text-[10px]">
                {categoryTag}
              </span>
            </div>

            {commitLabel && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-2xs border border-border/80 bg-surface/90 text-[10px] font-mono text-secondary shrink-0">
                <GitCommit className="w-3 h-3 pixel-icon text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-foreground font-semibold">{formatCompactDate(commitLabel)}</span>
              </span>
            )}
          </div>

          {/* Project Title + Editorial Italic Accent */}
          <Link
            to={`/work/${project.slug}`}
            className="group/title inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <h3 className="font-bold text-foreground text-xl leading-snug tracking-tight mt-0.5 group-hover/title:text-emerald-500 transition-colors">
              {project.title}{' '}
              <span className="font-serif italic font-normal text-muted group-hover/title:text-emerald-500/80 transition-colors">
                {editorialSubtitle}
              </span>
            </h3>
          </Link>
        </div>

        {/* ── Pure Screenshot Preview Window (Dedicated Bezel, Zero Text Colliding Over Preview) ── */}
        <div className="px-4 pt-3.5 bg-surface-subtle/30">
          <Link
            to={`/work/${project.slug}`}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xs border border-border/80 bg-page block overflow-hidden group/img focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            tabIndex={-1}
            aria-hidden="true"
          >
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} screenshot preview`}
                loading={index === 1 ? 'eager' : 'lazy'}
                fetchPriority={index === 1 ? 'high' : 'auto'}
                decoding="async"
                width="640"
                height="400"
                className="w-full h-full object-cover object-top group-hover/img:scale-105 group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center text-xs font-mono text-muted">
                <span>{project.title}</span>
              </div>
            )}

            {/* Subtle bottom vignette to frame the screenshot cleanly */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Floating Live Telemetry Badge inside screenshot bezel */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-2xs bg-black/85 backdrop-blur-md border border-white/15 text-[9px] font-mono font-semibold uppercase tracking-wider text-emerald-400 shadow-xs flex items-center gap-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                project.slug === 'mockrithm' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
              }`} />
              <span className="truncate max-w-[200px]">{liveBadgeText}</span>
            </div>
          </Link>
        </div>

        {/* ── Mobile Body Content ── */}
        <div className="p-4 flex flex-col gap-3.5 z-20 bg-surface">
          <p className="font-mono text-xs text-muted leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Emerald Hairline Architectural Safeguard */}
          <div className="border-l-2 border-emerald-500 pl-3 py-1.5 bg-emerald-500/[0.04] rounded-r-xs flex flex-col gap-0.5">
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
              // {safeguardLabel}
            </span>
            <span className="text-xs text-foreground/90 font-mono leading-relaxed">
              {project.architecture ? project.architecture[0] : (project.role || project.shortDescription)}
            </span>
          </div>

          {/* Verified Outcome */}
          {project.outcome && (
            <div className="flex items-start gap-2 text-xs font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-[10px] uppercase tracking-wider pt-px">
                OUTCOME:
              </span>
              <span className="text-secondary leading-snug">
                {project.outcome}
              </span>
            </div>
          )}

          {/* Dedicated Stack Chips Row (Full Width, Zero Collision with Buttons!) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[9px] font-mono text-muted tracking-widest uppercase mr-0.5">
              STACK:
            </span>
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="font-mono text-[10px] px-2 py-0.5 rounded-xs border border-border bg-surface-subtle text-secondary whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="font-mono text-[10px] text-muted">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Dedicated Bottom Action Dock (Full Width Grid, 40px Touch Targets, Zero Overlap) */}
          <div className="pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs font-mono mt-1">
            {hasArchitectureInspector ? (
              <button
                type="button"
                onClick={() => setIsArchModalOpen(true)}
                data-cursor-text="SYSTEM FLOW ⚙"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] text-[11px] font-mono font-semibold rounded-xs border border-border bg-page text-foreground hover:bg-surface-subtle hover:border-border-strong active:scale-[0.97] transition-all cursor-pointer select-none"
                title="Inspect real sequence and concurrency flow"
              >
                <Cpu className="w-3.5 h-3.5 pixel-icon text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>SYSTEM FLOW</span>
              </button>
            ) : project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-text="LIVE DEMO ↗"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] text-[11px] font-mono font-semibold rounded-xs border border-border bg-page text-foreground hover:bg-surface-subtle hover:border-border-strong active:scale-[0.97] transition-all"
                aria-label={`LIVE DEMO: Visit live site for ${project.title}`}
              >
                <span>LIVE DEMO</span>
                <ExternalLink className="w-3.5 h-3.5 pixel-icon text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
              </a>
            ) : (
              <div className="flex items-center justify-center text-[10px] font-mono text-muted border border-border/50 rounded-xs bg-page/50">
                ● PROD DEPLOYED
              </div>
            )}

            <Link
              to={`/work/${project.slug}`}
              data-cursor-text="CASE STUDY ↗"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] text-[11px] font-mono font-bold rounded-xs bg-foreground text-page hover:bg-foreground/90 active:scale-[0.97] transition-all group/cta shadow-xs"
              aria-label={`CASE STUDY: Read case study for ${project.title}`}
            >
              <span>CASE STUDY</span>
              <ArrowRight className="w-3.5 h-3.5 pixel-icon transition-transform duration-150 ease-out group-hover/cta:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP VIEW (>=1024px): 2-Column Editorial Datasheet
          Preserves the 2-column layout with enhanced Instrument Serif typography.
         ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex w-full flex-row">
        {/* ─── LEFT COLUMN: Screenshot Preview + Deployment Bar ─── */}
        <div className="lg:w-5/12 bg-surface-subtle/50 border-r border-border relative overflow-hidden flex flex-col justify-between p-6 z-20">
          <Link
            to={`/work/${project.slug}`}
            className="relative w-full aspect-[16/10] rounded-xs overflow-hidden border border-border/80 bg-page block group/img focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            tabIndex={-1}
            aria-hidden="true"
          >
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} screenshot preview`}
                loading={index === 1 ? 'eager' : 'lazy'}
                fetchPriority={index === 1 ? 'high' : 'auto'}
                decoding="async"
                width="640"
                height="400"
                className="w-full h-full object-cover object-top group-hover/img:scale-105 group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center text-xs font-mono text-muted">
                <span>{project.title}</span>
              </div>
            )}

            {/* Ambient subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Dynamic Technical Status Badge over image */}
            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-2xs bg-black/80 backdrop-blur-xs border border-white/10 text-[9px] font-mono text-emerald-400 font-semibold uppercase tracking-wider select-none">
              ● {liveBadgeText}
            </div>
          </Link>

          {/* Live Deployment Links Bar */}
          <div className="mt-4 flex items-center justify-between text-xs font-mono pt-1">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-text="LIVE DEMO ↗"
                className="inline-flex items-center gap-1.5 text-foreground hover:text-emerald-500 font-semibold active:scale-95 transition-all group/live"
                aria-label={`Visit live site for ${project.title}`}
              >
                <span>LIVE PRODUCTION</span>
                <ExternalLink className="w-3.5 h-3.5 pixel-icon text-emerald-500 transition-transform duration-150 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5" aria-hidden="true" />
              </a>
            ) : (
              <span className="text-muted text-[11px] font-mono">
                ● INTERNAL / PROD DEPLOYED
              </span>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-text="SRC CODE ↗"
                className="inline-flex items-center gap-1 text-muted hover:text-foreground active:scale-95 transition-colors"
                aria-label={`View source code for ${project.title}`}
              >
                <Github className="w-3.5 h-3.5 pixel-icon" />
                <span>SOURCE CODE</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Engineering Datasheet ─── */}
        <div className="lg:w-7/12 p-7 flex flex-col justify-between gap-5 relative z-20">

          {/* ── Header: Index + Slug + Telemetry Badges ── */}
          <div className="flex items-center justify-between gap-2 border-b border-border pb-3 text-micro-caps">
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              {index !== undefined && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  #{index.toString().padStart(2, '0')}
                </span>
              )}
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="text-foreground font-semibold truncate">/{project.slug}</span>
              <span className="inline-flex items-center gap-1.5 text-muted shrink-0">
                <span className="text-border-strong" aria-hidden="true">·</span>
                <span>{shortCategory(project.category)}</span>
              </span>
            </div>

            {/* Right Telemetry Badges: System Flow Trigger + Commit */}
            <div className="flex items-center gap-2 shrink-0">
              {hasArchitectureInspector && (
                <button
                  type="button"
                  onClick={() => setIsArchModalOpen(true)}
                  data-cursor-text="SYSTEM FLOW ⚙"
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-2xs border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold active:scale-[0.96] transition-all cursor-pointer select-none"
                  title="Inspect real sequence and concurrency flow"
                  aria-label={`SYSTEM FLOW: Inspect real sequence and concurrency flow for ${project.title}`}
                >
                  <Cpu className="w-3 h-3 pixel-icon text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>SYSTEM FLOW</span>
                  <span className="text-[9px]" aria-hidden="true">↗</span>
                </button>
              )}

              {commitLabel && (
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-2xs border border-border/80 bg-surface/90 text-[10px] font-mono text-secondary shrink-0"
                  title={`Last commit: ${commitLabel}`}
                >
                  <GitCommit className="w-3.5 h-3.5 pixel-icon text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-muted">COMMIT:</span>
                  <span className="text-foreground font-semibold">{commitLabel}</span>
                </span>
              )}
            </div>
          </div>

          {/* ── Title + Editorial Serif Italic Accent + Short Description ── */}
          <div className="space-y-1.5">
            <Link
              to={`/work/${project.slug}`}
              className="group/title inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            >
              <h3 className="font-bold text-foreground text-2xl sm:text-3xl tracking-tight leading-tight group-hover/title:text-emerald-500 transition-colors">
                {project.title}{' '}
                <span className="font-serif italic font-normal text-muted group-hover/title:text-emerald-500/80 transition-colors">
                  {editorialSubtitle}
                </span>
              </h3>
            </Link>
            <p className="font-mono text-xs text-muted leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* ── Architecture Specification Table (Proof Points) ── */}
          {project.architecture && project.architecture.length > 0 ? (
            <div className="rounded-xs border border-border bg-page/50 divide-y divide-border/60 text-xs font-mono overflow-hidden">
              <div className="p-3 flex items-start gap-3">
                <span className="text-[10px] text-muted uppercase tracking-wider shrink-0 w-24 pt-px">
                  {getSpecLabel1(project.slug)}
                </span>
                <span className="text-secondary leading-relaxed">
                  {project.architecture[0]}
                </span>
              </div>
              {project.architecture[1] && (
                <div className="p-3 flex items-start gap-3">
                  <span className="text-[10px] text-muted uppercase tracking-wider shrink-0 w-24 pt-px">
                    {getSpecLabel2(project.slug)}
                  </span>
                  <span className="text-secondary leading-relaxed">
                    {project.architecture[1]}
                  </span>
                </div>
              )}
              {project.outcome && (
                <div className="p-3 flex items-start gap-3 bg-surface-subtle/40 border-t border-border">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider shrink-0 w-24 pt-px">
                    VERIFIED OUTCOME
                  </span>
                  <span className="text-foreground font-medium leading-relaxed">
                    {project.outcome}
                  </span>
                </div>
              )}
            </div>
          ) : (
            (project.role || project.outcome) && (
              <div className="grid grid-cols-2 gap-px rounded-xs border border-border overflow-hidden text-xs font-mono bg-border">
                {project.role && (
                  <div className="bg-page/60 px-4 py-3 space-y-0.5">
                    <span className="text-[10px] text-muted uppercase tracking-widest block">ROLE</span>
                    <span className="text-foreground font-medium leading-snug block">{project.role}</span>
                  </div>
                )}
                {project.outcome && (
                  <div className="bg-page/60 px-4 py-3 space-y-0.5">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest block">OUTCOME</span>
                    <span className="text-foreground font-medium leading-snug block">{project.outcome}</span>
                  </div>
                )}
              </div>
            )
          )}

          {/* ── Footer: Stack Chips + Case Study CTA (Single-Line Disciplined Rhythm) ── */}
          <div className="pt-2 border-t border-border flex items-center justify-between gap-3 mt-auto text-xs font-mono">
            {/* Tech chips */}
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-mono text-muted tracking-widest uppercase mr-0.5 shrink-0">
                STACK:
              </span>
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[11px] px-2 py-0.5 rounded-xs border border-border bg-surface-subtle text-secondary whitespace-nowrap"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="font-mono text-[10px] text-muted shrink-0">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>

            {/* Action CTA */}
            <Link
              to={`/work/${project.slug}`}
              data-cursor-text="CASE STUDY ↗"
              className="inline-flex items-center gap-1.5 text-foreground font-semibold hover:text-emerald-500 active:scale-[0.96] transition-all group/cta shrink-0 px-2 py-1 rounded-xs hover:bg-surface-subtle"
              aria-label={`CASE STUDY: Read full case study for ${project.title}`}
            >
              <span>CASE STUDY</span>
              <ArrowRight className="w-3.5 h-3.5 pixel-icon transition-transform duration-150 ease-out group-hover/cta:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

        </div>
      </div>
    </article>

    {/* Architecture Inspection Modal (Loaded on Demand) */}
    {hasArchitectureInspector && isArchModalOpen && (
      <Suspense fallback={null}>
        <ArchitectureModal
          isOpen={isArchModalOpen}
          onClose={() => setIsArchModalOpen(false)}
          projectSlug={project.slug}
          initialFlowId={project.slug === 'shifamanagement' ? 'shifa-architecture' : 'auction-concurrency'}
        />
      </Suspense>
    )}
    </>
  )
}

