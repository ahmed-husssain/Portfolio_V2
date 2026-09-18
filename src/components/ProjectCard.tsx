import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import type { Project } from '../data/projects'

function GithubIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

/** Shorten a category string to a compact label for the header bar */
function shortCategory(cat: string): string {
  // Strip common suffix words to keep it tight
  return cat
    .replace(/\s*\/\s*Full-Stack Web Application/i, '')
    .replace(/\s*\/\s*Web Application/i, '')
    .replace(/\s*\/\s*Mobile Application/i, '')
    .replace(/Full-Stack\s*/i, '')
    .trim()
    .toUpperCase()
}

interface ProjectCardProps {
  project: Project
  className?: string
  index?: number
}

export default function ProjectCard({ project, className = '', index }: ProjectCardProps) {
  const isFlagship = Boolean(project.featured)

  return (
    <article
      className={`group border bg-surface hover:bg-surface-hover hover:border-border-strong transition-all duration-200 rounded-sm overflow-hidden flex flex-col ${isFlagship ? 'border-border-strong shadow-xs' : 'border-border'
        } ${className}`}
    >
      {/* ─── Card Header Bar ─── */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 sm:px-6 py-2.5 text-[11px] font-mono bg-surface-subtle/60">
        {/* Left: index + slug + category (compact) */}
        <div className="flex items-center gap-2 min-w-0">
          {index !== undefined && (
            <span className="text-foreground font-bold shrink-0">
              #{index.toString().padStart(2, '0')}
            </span>
          )}
          <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
          <span className="text-foreground font-semibold shrink-0 truncate">/{project.slug}</span>
          <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
          <span className="text-muted tracking-wider uppercase truncate hidden xs:block sm:block">
            {shortCategory(project.category)}
          </span>
        </div>

        {/* Right: year + links */}
        <div className="flex items-center gap-3 shrink-0">
          {project.year && (
            <span className="text-muted hidden sm:inline">{project.year}</span>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted hover:text-foreground transition-colors"
              aria-label={`View source code for ${project.title}`}
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline tracking-wider">SRC</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-foreground font-semibold hover:underline transition-all"
              aria-label={`Visit live site for ${project.title}`}
            >
              <span>LIVE</span>
              <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* ─── Card Body ─── */}
      <div className="p-5 sm:p-7 flex-1 flex flex-col gap-5">

        {/* ── Title + Short Description ── */}
        <div>
          <Link
            to={`/work/${project.slug}`}
            className="group/title inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <h3
              className={`font-bold text-foreground tracking-tight leading-tight group-hover/title:underline transition-all ${isFlagship ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
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
              <span className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" aria-hidden="true" />
              ARCHITECTURAL HIGHLIGHTS
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
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest shrink-0 pt-px">
                  OUT:
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
                <span className="text-[10px] text-muted uppercase tracking-widest block">OUTCOME</span>
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

          {/* Case study link — placed to right bottom on mobile and desktop */}
          <Link
            to={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground hover:underline shrink-0 self-end sm:self-auto"
            aria-label={`Read case study for ${project.title}`}
          >
            <span>CASE STUDY</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
