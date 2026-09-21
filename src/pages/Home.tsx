import { useDocumentTitle } from '../lib/useDocumentTitle'
import Hero from '../sections/Hero'
import SelectedWork from '../sections/SelectedWork'
import Capabilities from '../sections/Capabilities'
import AboutPreview from '../sections/AboutPreview'
import Reviews from '../sections/Reviews'
import WritingPreview from '../sections/WritingPreview'
import ContactCTA from '../sections/ContactCTA'
import Reveal from '../components/Reveal'

export default function Home() {
  useDocumentTitle('Backend-Focused .NET Developer')

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
        <AboutPreview />
      </Reveal>
      <Reveal>
        <Reviews />
      </Reveal>
      <Reveal>
        <WritingPreview />
      </Reveal>
      <Reveal>
        <ContactCTA />
      </Reveal>
    </>
  )
}
