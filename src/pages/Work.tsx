import Container from '../components/Container'
import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'
import { PROJECTS, SORTED_PROJECTS } from '../data/projects'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Work() {
  useDocumentTitle('Projects & Systems — Syed Ahmed Hussain | Software Developer in Karachi')

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
      <Container>
        {/* Page Header */}
        <header className="mb-8 sm:mb-12 pb-6 border-b border-border">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] sm:text-xs font-mono text-muted uppercase tracking-wider mb-4">
            <span className="text-foreground font-semibold shrink-0">// WORK CATALOG</span>
            <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
            <span className="shrink-0">[ {PROJECTS.length.toString().padStart(2, '0')} PROJECTS TOTAL ]</span>
            <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
            <span className="text-emerald-500 font-semibold shrink-0">RANKED BY LATEST COMMITS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-5">
            Projects & Case Studies
          </h1>

          <p className="text-secondary text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed">
            A curated record of web applications, APIs, and backend systems I have designed and engineered. Each project highlights the problem, architecture, and practical outcomes.
          </p>
        </header>

        {/* Project List */}
        <div className="flex flex-col gap-12 sm:gap-16">
          {SORTED_PROJECTS.map((project, index) => (
            <Reveal key={project.slug} delay={index * 50}>
              <ProjectCard project={project} index={index + 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  )
}
