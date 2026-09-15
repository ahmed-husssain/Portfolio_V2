import { ThemeProvider } from './lib/theme'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import ProjectPreview from './sections/ProjectPreview'
import Container from './components/Container'

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-page text-foreground flex flex-col selection:bg-accent-bg selection:text-accent-text">
        {/* ─── Fixed Navbar ─── */}
        <Navbar />

        {/* ─── Main Content ─── */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          <Hero />
          <ProjectPreview />
        </main>

        {/* ─── Foundation Phase Shell Footer ─── */}
        <footer className="py-12 border-t border-border bg-surface text-secondary">
          <Container>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span>PORTFOLIO V2 // PHASE 1: FOUNDATION</span>
              </div>
              <p className="text-muted">
                DESIGNED WITH MINIMALISM & PERFORMANCE IN MIND.
              </p>
            </div>
          </Container>
        </footer>
      </div>
    </ThemeProvider>
  )
}
