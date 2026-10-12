import Container from '../components/Container'
import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'
import { PROJECTS, SORTED_PROJECTS } from '../data/projects'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Work() {
  useDocumentTitle('Projects & Systems — Syed Ahmed Hussain | Software Developer in Karachi')

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 md:pb-24">
      <Container>
        {/* ─── Page Header (Apple Optical Hierarchy) ─── */}
        <header className="mb-10 sm:mb-14 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-micro-caps text-muted mb-4">
            <span className="text-foreground font-semibold shrink-0">// WORK CATALOG</span>
            <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
            <span className="shrink-0">[ {PROJECTS.length.toString().padStart(2, '0')} SYSTEMS DOCUMENTED ]</span>
            <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
            <span className="text-emerald-500 font-semibold shrink-0">ORDERED BY LATEST PRODUCTION CODE</span>
          </div>

          <h1 className="text-title-1 text-foreground mb-4 sm:mb-5">
            Featured Projects & Case Studies
          </h1>

          <p className="text-body-lead text-secondary max-w-3xl font-normal">
            Full-stack projects detailing real-world problems, tech stacks, and solutions.
          </p>
        </header>

        {/* ─── Project List (Elevated Cards with Luminous Hairlines) ─── */}
        <div className="flex flex-col gap-10 sm:gap-14">
          {SORTED_PROJECTS.map((project, index) => (
            <Reveal key={project.slug} delay={index * 40}>
              <ProjectCard project={project} index={index + 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  )
}
