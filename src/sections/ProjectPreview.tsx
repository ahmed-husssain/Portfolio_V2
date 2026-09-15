import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import { PREVIEW_PROJECTS } from '../data/projects'

export default function ProjectPreview() {
  return (
    <section id="work" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        <SectionHeading
          index="// 01"
          title="Selected Work"
          subtitle="Featured client and full-stack projects emphasizing clean architecture, high throughput, and seamless end-user experience."
          meta="[ 02 FEATURED ]"
        />

        <div className="flex flex-col gap-8 md:gap-12">
          {PREVIEW_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  )
}
