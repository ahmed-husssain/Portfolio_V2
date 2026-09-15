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

interface ProjectCardProps {
  project: Project
  className?: string
  index?: number
}

export default function ProjectCard({ project, className = '', index }: ProjectCardProps) {
  const isFlagship = Boolean(project.featured)

  return (
    <article
      className={`border bg-surface hover:bg-surface-hover transition-all duration-200 rounded-sm overflow-hidden flex flex-col ${
        isFlagship ? 'border-border-strong shadow-xs' : 'border-border'
      } ${className}`}
    >
      {/* ─── Card Header Metadata Bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 sm:px-6 py-3 text-xs font-mono text-muted bg-surface-subtle/60">
        <div className="flex items-center gap-2.5">
          {index !== undefined && (
            <>
              <span className="text-foreground font-semibold">#{index.toString().padStart(2, '0')}</span>
              <span className="text-border-strong" aria-hidden="true">|</span>
            </>
          )}
          <span className="text-foreground font-semibold">/{project.slug}</span>
          <span className="text-border-strong" aria-hidden="true">|</span>
          <span className="tracking-wider uppercase">{project.category}</span>
          {project.year && (
            <>
              <span className="text-border-strong hidden sm:inline" aria-hidden="true">|</span>
              <span className="hidden sm:inline">{project.year}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-secondary hover:text-foreground transition-colors"
              aria-label={`View GitHub source code for ${project.title}`}
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SOURCE</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-foreground font-medium hover:underline transition-all"
              aria-label={`Visit live deployment for ${project.title}`}
            >
              <span>LIVE</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* ─── Card Body ─── */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Title Linking to Case Study */}
          <div className="mb-3">
            <Link
              to={`/work/${project.slug}`}
              className="group/title inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            >
              <h3
                className={`font-semibold text-foreground tracking-tight group-hover/title:underline transition-all ${
                  isFlagship ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}
              >
                {project.title}
              </h3>
            </Link>
            <p className="font-mono text-xs text-muted mt-1 tracking-wide">
              {project.shortDescription}
            </p>
          </div>

          {/* Detailed Narrative */}
          <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
            {project.description}
          </p>

          {/* ─── Highlights / Architectural Breakdown for Flagship Projects ─── */}
          {isFlagship && project.architecture && project.architecture.length > 0 && (
            <div className="mb-6 p-4 sm:p-5 rounded-sm border border-border bg-page/50">
              <div className="text-[11px] font-mono text-muted tracking-widest uppercase mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" aria-hidden="true" />
                <span>ARCHITECTURAL HIGHLIGHTS</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-secondary font-mono leading-relaxed">
                {project.architecture.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-muted select-none" aria-hidden="true">↳</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {project.outcome && (
                <div className="mt-3 pt-3 border-t border-border flex items-baseline gap-2 text-xs font-mono">
                  <span className="text-muted uppercase">OUTCOME:</span>
                  <span className="text-foreground font-medium">{project.outcome}</span>
                </div>
              )}
            </div>
          )}

          {/* ─── Non-Flagship Concise Specs ─── */}
          {!isFlagship && (project.role || project.outcome) && (
            <div className="mb-6 p-3.5 rounded-sm border border-border bg-page/40 text-xs font-mono space-y-1.5">
              {project.role && (
                <div className="flex items-baseline gap-2">
                  <span className="text-muted uppercase tracking-wider">ROLE:</span>
                  <span className="text-foreground">{project.role}</span>
                </div>
              )}
              {project.outcome && (
                <div className="flex items-baseline gap-2">
                  <span className="text-muted uppercase tracking-wider">OUTCOME:</span>
                  <span className="text-foreground">{project.outcome}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Footer with Tech Chips & Case Study Link ─── */}
        <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-muted tracking-widest uppercase mr-1">
              STACK:
            </span>
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] px-2.5 py-0.5 rounded-xs border border-border bg-surface-subtle text-secondary"
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

          <Link
            to={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-foreground hover:underline"
            aria-label={`Read case study for ${project.title}`}
          >
            <span>CASE STUDY</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
