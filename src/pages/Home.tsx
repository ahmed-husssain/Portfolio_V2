import { useDocumentTitle } from '../lib/useDocumentTitle'
import Hero from '../sections/Hero'
import SelectedWork from '../sections/SelectedWork'
import Capabilities from '../sections/Capabilities'
import Reviews from '../sections/Reviews'
import Reveal from '../components/Reveal'

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
    </>
  )
}
