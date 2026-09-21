import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import { PROJECTS } from '../data/projects'

export default function SelectedWork() {
  const featuredProjects = PROJECTS.filter((p) => p.featured)

  return (
    <section id="work" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        <SectionHeading
          index="// 01"
          title="Selected Work"
          subtitle="Web applications, APIs, and platforms engineered with a focus on reliability, database performance, and clean architecture."
          meta={`[ ${featuredProjects.length.toString().padStart(2, '0')} FEATURED OF ${PROJECTS.length.toString().padStart(2, '0')} TOTAL ]`}
        />

        <div className="flex flex-col gap-10 sm:gap-14">
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
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
