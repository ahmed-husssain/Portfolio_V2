import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Hero from '../sections/Hero'
import SelectedWork from '../sections/SelectedWork'
import Capabilities from '../sections/Capabilities'
import Reviews from '../sections/Reviews'
import Reveal from '../components/motion/Reveal'

import Container from '../components/ui/Container'
import ContinuityBridge from '../components/ui/ContinuityBridge'

export default function Home() {
  useDocumentTitle('Ahmed Hussain — Software & Website Developer in Karachi')

  return (
    <>
      <Hero />
      <Reveal>
        <SelectedWork />
      </Reveal>
      <Reveal>
        <Capabilities />
      </Reveal>
      <Reveal>
        <Reviews />
      </Reveal>
      <Container className="pb-16 sm:pb-24">
        <ContinuityBridge
          kicker="WORK CATALOG"
          title="Explore All Systems & Case Studies"
          description="Case studies of full-stack web applications, ASP.NET Core APIs, and relational database systems."
          to="/work"
          actionLabel="EXPLORE WORK CATALOG"
          className="mt-6 sm:mt-10"
        />
      </Container>
    </>
  )
}
