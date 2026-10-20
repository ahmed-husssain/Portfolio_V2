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
      className={`group relative border bg-surface hover:bg-surface-hover hover:border-border-strong hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.99] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out rounded-sm overflow-hidden flex flex-col pixel-corners ${
        isFlagship ? 'border-border-strong shadow-2xs' : 'border-border'
      } ${className}`}
      style={{ boxShadow: 'var(--hairline-top)' }}
    >
      {/* ─── Emil Kowalski Ambient Spotlight Glow ─── */}
      <div
        className="pointer-events-none absolute -inset-px rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: isHovered
            ? `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 70%)`
            : '',
        }}
        aria-hidden="true"
      />

      {/* ─── Card Header Bar ─── */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-3.5 sm:px-6 py-2 sm:py-2.5 text-micro-caps bg-surface-subtle/60 relative z-20">
        {/* Left: index + slug + (category on desktop only) */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
          {index !== undefined && (
            <span className="text-foreground font-bold shrink-0">
              #{index.toString().padStart(2, '0')}
            </span>
          )}
          <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
          <span className="text-foreground font-semibold truncate">/{project.slug}</span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-muted shrink-0">
            <span className="text-border-strong" aria-hidden="true">·</span>
            <span>{shortCategory(project.category)}</span>
          </span>
        </div>

        {/* Right: commit badge + links */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="SRC CODE ↗"
              className="inline-flex items-center gap-1 text-muted hover:text-foreground active:scale-[0.96] transition-[color,transform] duration-150 ease-out shrink-0"
              aria-label={`View source code for ${project.title}`}
            >
              <Github className="w-3.5 h-3.5 pixel-icon" />
              <span className="hidden sm:inline tracking-wider">SRC</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="LIVE DEMO ↗"
              className="inline-flex items-center gap-0.5 text-foreground font-semibold hover:underline active:scale-[0.96] transition-[color,transform] duration-150 ease-out shrink-0 group/live"
              aria-label={`Visit live site for ${project.title}`}
            >
              <span>LIVE</span>
              <ExternalLink className="w-3 h-3 pixel-icon transition-transform duration-150 ease-out group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* ─── Card Body ─── */}
      <div className="p-4 sm:p-7 flex-1 flex flex-col gap-4 sm:gap-5 relative z-20">

        {/* ── Title + Short Description ── */}
        <div>
          <Link
            to={`/work/${project.slug}`}
            className="group/title inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <h3
              className={`font-bold text-foreground tracking-tight leading-tight group-hover/title:underline transition-all ${
                isFlagship ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
              }`}
            >
              {project.title}
            </h3>
          </Link>
          <p className="font-mono text-xs text-muted mt-1.5 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* ── Description ── */}
        <p className="text-secondary text-sm leading-relaxed">
          {project.description}
        </p>

        {/* ── Flagship: Architecture Highlights ── */}
        {isFlagship && project.architecture && project.architecture.length > 0 && (
          <div className="rounded-sm border border-border bg-page/50 overflow-hidden">
            {/* Section label */}
            <div className="px-4 py-2 border-b border-border flex items-center gap-2 text-[10px] font-mono text-muted tracking-widest uppercase bg-surface-subtle/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
              TECHNICAL IMPLEMENTATION HIGHLIGHTS
            </div>
            {/* Architecture items — one per row, no wrapping surprises */}
            <ul className="divide-y divide-border/50">
              {project.architecture.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-start gap-3 px-4 py-2.5">
                  <span className="text-muted font-mono text-[11px] shrink-0 mt-px select-none pt-0.5">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span className="text-xs text-secondary font-mono leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            {/* Outcome pill */}
            {project.outcome && (
              <div className="px-4 py-2.5 border-t border-border bg-surface-subtle/40 flex items-start gap-2.5">
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest shrink-0 pt-px">
                  OUTCOME:
                </span>
                <span className="text-xs text-foreground font-mono font-medium leading-relaxed">
                  {project.outcome}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Non-Flagship: Role + Outcome row ── */}
        {!isFlagship && (project.role || project.outcome) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-sm border border-border overflow-hidden text-xs font-mono bg-border">
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
        )}

        {/* ── Footer: Stack chips + CTA ── */}
        <div className="pt-1 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
          {/* Tech chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted tracking-widest uppercase mr-0.5">
              STACK:
            </span>
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] px-2 py-0.5 rounded-xs border border-border bg-surface-subtle text-secondary whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="font-mono text-[10px] text-muted">
                +{project.technologies.length - 5}
              </span>
            )}
          </div>

          {/* Action CTAs: Architecture Inspector + Case Study */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 pt-1.5 sm:pt-0">
            {hasArchitectureInspector && (
              <button
                type="button"
                onClick={() => setIsArchModalOpen(true)}
                data-cursor-text="SYSTEM FLOW ⚙"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:py-1 text-[11px] font-mono font-semibold rounded-xs border border-border bg-page text-foreground hover:bg-surface-subtle hover:border-border-strong active:scale-[0.96] transition-[background-color,border-color,transform] duration-150 ease-out cursor-pointer select-none"
                title={
                  project.slug === 'shifamanagement'
                    ? 'Inspect Flutter, Supabase & PostgreSQL flow'
                    : 'Inspect .NET 8 & SQL Server auction flow'
                }
              >
                <Cpu className="w-3.5 h-3.5 pixel-icon text-emerald-500 shrink-0" />
                <span className="truncate">VIEW SYSTEM FLOW</span>
              </button>
            )}

            {/* Case study link */}
            <Link
              to={`/work/${project.slug}`}
              data-cursor-text="CASE STUDY ↗"
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:py-1 text-xs font-mono font-semibold text-foreground hover:underline active:scale-[0.96] transition-[transform,color] duration-150 ease-out shrink-0 select-none group"
              aria-label={`Read case study for ${project.title}`}
            >
              <span>CASE STUDY</span>
              <ArrowRight className="w-3.5 h-3.5 pixel-icon transition-transform duration-150 ease-out group-hover:translate-x-1" aria-hidden="true" />
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
