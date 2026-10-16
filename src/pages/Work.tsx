import Container from '../components/Container'
import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'
import PageHeader from '../components/ui/PageHeader'
import { PROJECTS } from '../data/projects'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useRankedProjects } from '../lib/github/ranking.ts'

export default function Work() {
  useDocumentTitle('Projects & Systems — Syed Ahmed Hussain | Software Developer in Karachi')
  const { projects } = useRankedProjects({ featuredOnly: false })

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 md:pb-24">
      <Container>
        <PageHeader
          eyebrow={
            <>
              <span className="text-foreground font-semibold shrink-0">// WORK CATALOG</span>
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="shrink-0">[ {PROJECTS.length.toString().padStart(2, '0')} SYSTEMS DOCUMENTED ]</span>
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="text-emerald-500 font-semibold shrink-0">ORDERED BY LATEST PRODUCTION CODE</span>
            </>
          }
          title="Featured Projects & Case Studies"
          description="Full-stack projects detailing real-world problems, tech stacks, and solutions."
        />

        {/* ─── Project List (Elevated Cards with Luminous Hairlines) ─── */}
        <div className="flex flex-col gap-10 sm:gap-14">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 40}>
              <ProjectCard project={project} index={index + 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  )
}
