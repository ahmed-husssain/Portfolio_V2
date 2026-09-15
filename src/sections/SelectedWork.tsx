import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import { PROJECTS } from '../data/projects'

export default function SelectedWork() {
  return (
    <section id="work" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        <SectionHeading
          index="// 01"
          title="Selected Work"
          subtitle="Production web applications, mobile tools, and backend platforms engineered with a focus on real-world utility, reliability, and clean architecture."
          meta="[ 04 PROJECTS ]"
        />

        <div className="flex flex-col gap-10 sm:gap-14">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  )
}
