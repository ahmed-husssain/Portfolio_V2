import Container from '../components/Container'
import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'
import { PROJECTS } from '../data/projects'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Work() {
  useDocumentTitle('Work — Ahmed | Backend-Focused .NET Developer')

  return (
    <div className="py-16 sm:py-24 md:py-32">
      <Container>
        {/* Page Header */}
        <header className="mb-14 sm:mb-20 pb-8 border-b border-border">
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-3">
            <span className="text-foreground font-semibold">// WORK CATALOG</span>
            <span>·</span>
            <span>[ {PROJECTS.length.toString().padStart(2, '0')} PROJECTS TOTAL ]</span>
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
          {PROJECTS.map((project, index) => (
            <Reveal key={project.slug} delay={index * 50}>
              <ProjectCard project={project} index={index + 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  )
}
