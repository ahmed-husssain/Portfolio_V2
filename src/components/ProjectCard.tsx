import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, ArrowRight, Cpu, GitCommit, Github } from 'pixelarticons/react'
import type { Project } from '../data/projects'
import { useGitHubCommit } from '../hooks/useGitHubCommit'
import ArchitectureModal from './ArchitectureModal'

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

interface ProjectCardProps {
  project: Project
  className?: string
  index?: number
}

export default function ProjectCard({ project, className = '', index }: ProjectCardProps) {
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

  return (
    <>
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor-text="VIEW CASE STUDY ↗"
      className={`project-card group relative border bg-surface hover:bg-surface-hover hover:border-border-strong hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-[0.99] transition-[transform,background-color,border-color,box-shadow,opacity] duration-250 ease-out rounded-sm overflow-hidden flex flex-col lg:flex-row pixel-corners ${
        isFlagship ? 'border-border-strong shadow-2xs' : 'border-border'
      } ${className}`}
      style={{ boxShadow: 'var(--hairline-top)' }}
    >
      {/* ─── Ambient Spotlight Glow ─── */}
      <div
        className="pointer-events-none absolute -inset-px rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: isHovered
            ? `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 70%)`
            : '',
        }}
        aria-hidden="true"
      />

      {/* ─── LEFT COLUMN: Authentic Screenshot Preview (Dennis Snellenberg Visual Anchor) ─── */}
      <div className="lg:w-5/12 bg-surface-subtle/50 border-b lg:border-b-0 lg:border-r border-border relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 z-20">
        <Link
          to={`/work/${project.slug}`}
          className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-xs overflow-hidden border border-border/80 bg-page block group/img focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          tabIndex={-1}
          aria-hidden="true"
        >
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} screenshot preview`}
              loading="lazy"
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
            {project.slug === 'online-art-gallery' && '● SignalR WebSocket Stream'}
            {project.slug === 'shifamanagement' && '● PostgreSQL Row-Level Security'}
            {project.slug === 'mockrithm' && '★ Aptech Vision 2025 Runner-Up'}
            {project.slug === 'amber-property-corner' && '● Indexed PostgreSQL Engine'}
            {project.slug === 'e-books' && '● MySQL Relational Schema'}
            {!['online-art-gallery', 'shifamanagement', 'mockrithm', 'amber-property-corner', 'e-books'].includes(project.slug) && (
              `● ${shortCategory(project.category)}`
            )}
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

      {/* ─── RIGHT COLUMN: Engineering Datasheet (The Source of Truth) ─── */}
      <div className="lg:w-7/12 p-5 sm:p-7 flex flex-col justify-between gap-5 relative z-20">

        {/* ── Header: Index + Slug + Verified Commit ── */}
        <div className="flex items-center justify-between gap-2 border-b border-border pb-3 text-micro-caps">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
            {index !== undefined && (
              <span className="text-emerald-500 font-bold shrink-0">
                #{index.toString().padStart(2, '0')}
              </span>
            )}
            <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
            <span className="text-foreground font-semibold truncate">/{project.slug}</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-muted shrink-0">
              <span className="text-border-strong" aria-hidden="true">·</span>
              <span>{shortCategory(project.category)}</span>
            </span>
          </div>

          {/* Verified Commit Telemetry Badge */}
          {commitLabel && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-2xs border border-border/80 bg-surface/90 text-[10px] font-mono text-secondary shrink-0"
              title={`Last commit: ${commitLabel}`}
            >
              <GitCommit className="w-3.5 h-3.5 pixel-icon text-emerald-500 shrink-0" />
              <span className="text-muted hidden md:inline">COMMIT:</span>
              <span className="text-foreground font-semibold sm:hidden">{formatCompactDate(commitLabel)}</span>
              <span className="text-foreground font-semibold hidden sm:inline">{commitLabel}</span>
            </span>
          )}
        </div>

        {/* ── Title + Short Description ── */}
        <div className="space-y-1.5">
          <Link
            to={`/work/${project.slug}`}
            className="group/title inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <h3
              className={`font-bold text-foreground tracking-tight leading-tight group-hover/title:text-emerald-500 transition-colors ${
                isFlagship ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
              }`}
            >
              {project.title}
            </h3>
          </Link>
          <p className="font-mono text-xs text-muted leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* ── Architecture Specification Table (Proof Points) ── */}
        {isFlagship && project.architecture && project.architecture.length > 0 ? (
          <div className="rounded-xs border border-border bg-page/50 divide-y divide-border/60 text-xs font-mono overflow-hidden">
            <div className="p-3 flex items-start gap-3">
              <span className="text-[10px] text-muted uppercase tracking-wider shrink-0 w-24 pt-px">
                {project.slug === 'online-art-gallery' ? 'CONCURRENCY' : 'SAFEGUARD'}
              </span>
              <span className="text-secondary leading-relaxed">
                {project.architecture[0]}
              </span>
            </div>
            {project.architecture[1] && (
              <div className="p-3 flex items-start gap-3">
                <span className="text-[10px] text-muted uppercase tracking-wider shrink-0 w-24 pt-px">
                  {project.slug === 'online-art-gallery' ? 'IDEMPOTENCY' : 'ARCHITECTURE'}
                </span>
                <span className="text-secondary leading-relaxed">
                  {project.architecture[1]}
                </span>
              </div>
            )}
            {project.outcome && (
              <div className="p-3 flex items-start gap-3 bg-surface-subtle/40 border-t border-border">
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider shrink-0 w-24 pt-px">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-xs border border-border overflow-hidden text-xs font-mono bg-border">
              {project.role && (
                <div className="bg-page/60 px-4 py-3 space-y-0.5">
                  <span className="text-[10px] text-muted uppercase tracking-widest block">ROLE</span>
                  <span className="text-foreground font-medium leading-snug block">{project.role}</span>
                </div>
              )}
              {project.outcome && (
                <div className="bg-page/60 px-4 py-3 space-y-0.5">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest block">OUTCOME</span>
                  <span className="text-foreground font-medium leading-snug block">{project.outcome}</span>
                </div>
              )}
            </div>
          )
        )}

        {/* ── Footer: Stack Chips + CTAs ── */}
        <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3 mt-auto text-xs font-mono">
          {/* Tech chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted tracking-widest uppercase mr-0.5">
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
              <span className="font-mono text-[10px] text-muted">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            {hasArchitectureInspector && (
              <button
                type="button"
                onClick={() => setIsArchModalOpen(true)}
                data-cursor-text="SYSTEM FLOW ⚙"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-semibold rounded-xs border border-border bg-page text-foreground hover:bg-surface-subtle hover:border-border-strong active:scale-[0.96] transition-all cursor-pointer select-none"
                title="Inspect real sequence and concurrency flow"
              >
                <Cpu className="w-3.5 h-3.5 pixel-icon text-emerald-500 shrink-0" />
                <span>VIEW SYSTEM FLOW</span>
              </button>
            )}

            <Link
              to={`/work/${project.slug}`}
              data-cursor-text="CASE STUDY ↗"
              className="inline-flex items-center gap-1 text-foreground font-semibold hover:text-emerald-500 active:scale-[0.96] transition-colors group/cta"
              aria-label={`Read case study for ${project.title}`}
            >
              <span>CASE STUDY</span>
              <ArrowRight className="w-3.5 h-3.5 pixel-icon transition-transform duration-150 ease-out group-hover/cta:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </article>

    {/* Architecture Inspection Modal */}
    {hasArchitectureInspector && (
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
        projectSlug={project.slug}
        initialFlowId={project.slug === 'shifamanagement' ? 'shifa-architecture' : 'auction-concurrency'}
      />
    )}
    </>
  )
}
