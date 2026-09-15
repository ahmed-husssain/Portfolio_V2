import { useDocumentTitle } from '../lib/useDocumentTitle'
import Hero from '../sections/Hero'
import SelectedWork from '../sections/SelectedWork'
import Capabilities from '../sections/Capabilities'
import AboutPreview from '../sections/AboutPreview'
import Reviews from '../sections/Reviews'
import WritingPreview from '../sections/WritingPreview'
import ContactCTA from '../sections/ContactCTA'

export default function Home() {
  useDocumentTitle('Full-Stack Web Developer')

  return (
    <>
      <Hero />
      <SelectedWork />
      <Capabilities />
      <AboutPreview />
      <Reviews />
      <WritingPreview />
      <ContactCTA />
    </>
  )
}
