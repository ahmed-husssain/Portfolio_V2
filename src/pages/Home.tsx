import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Hero from '../sections/Hero'
import SelectedWork from '../sections/SelectedWork'
import Capabilities from '../sections/Capabilities'
import Reviews from '../sections/Reviews'
import Reveal from '../components/motion/Reveal'

import Container from '../components/ui/Container'
import ContinuityBridge from '../components/ui/ContinuityBridge'

export default function Home() {
  useDocumentTitle('Syed Ahmed Hussain — Software & Website Developer in Karachi')

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
          description="In-depth technical breakdowns of full-stack systems, ASP.NET Core APIs, and production database architectures."
          to="/work"
          actionLabel="EXPLORE WORK CATALOG"
          className="mt-6 sm:mt-10"
        />
      </Container>
    </>
  )
}
