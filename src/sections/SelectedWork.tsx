import { ArrowRight } from 'pixelarticons/react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import { PROJECTS } from '../data/projects'
import { useRankedProjects } from '../lib/github/ranking.ts'

export default function SelectedWork() {
  const { projects: featuredProjects } = useRankedProjects({ featuredOnly: true })

  return (
    <section id="work" className="py-12 sm:py-16 md:py-20 border-b border-border">
      <Container>
        <SectionHeading
          index="01"
          title="Selected Work"
          subtitle="Web applications and APIs built with a focus on clean code, database integrity, and practical problem solving."
          meta={`${featuredProjects.length.toString().padStart(2, '0')} FEATURED · ${PROJECTS.length.toString().padStart(2, '0')} TOTAL`}
        />

        <div className="flex flex-col gap-10 sm:gap-14 cards-focus-group">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index + 1} />
          ))}
        </div>

        {/* View All Projects Link */}
        <div className="mt-14 pt-8 border-t border-border flex justify-between items-center flex-wrap gap-4">
          <p className="text-xs font-mono text-secondary">
            SHOWING {featuredProjects.length} FEATURED PROJECTS WITH CASE STUDIES.
          </p>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-foreground hover:text-secondary transition-colors group"
          >
            <span>VIEW ALL PROJECTS ({PROJECTS.length})</span>
            <ArrowRight className="w-4 h-4 pixel-icon transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
