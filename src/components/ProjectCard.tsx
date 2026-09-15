import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'

interface ProjectCardProps {
  project: Project
  className?: string
}

export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <article
      className={`border border-border bg-surface hover:border-border-strong hover:bg-surface-hover transition-all duration-200 rounded-sm overflow-hidden flex flex-col ${className}`}
    >
      {/* ─── Top Metadata Header ─── */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3 text-xs font-mono text-muted bg-surface-subtle/50">
        <div className="flex items-center gap-2.5">
          <span className="text-foreground font-medium">#{project.index}</span>
          <span className="text-border-strong" aria-hidden="true">|</span>
          <span className="tracking-wider uppercase">{project.tagline}</span>
        </div>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-foreground hover:text-secondary transition-colors"
            aria-label={`View live project for ${project.title}`}
          >
            <span>LIVE</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        )}
      </div>

      {/* ─── Main Content ─── */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            {project.title}
          </h3>
          <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
            {project.description}
          </p>
        </div>

        {/* ─── Technical Specifications Table / Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-border mb-6">
          {project.specs.map((spec, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
                {spec.label}
              </span>
              <span className="font-mono text-xs text-foreground font-medium truncate">
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Tech Stack Chips ─── */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[11px] px-2.5 py-1 rounded-xs border border-border bg-surface-subtle text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
