import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './lib/theme'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Page Components
import Home from './pages/Home'
import Work from './pages/Work'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Writing from './pages/Writing'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-page text-foreground flex flex-col selection:bg-accent-bg selection:text-accent-text">
          {/* ─── Fixed Header / Navbar ─── */}
          <Navbar />

          {/* ─── Route Viewport ─── */}
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/writing" element={<Writing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* ─── Global Footer ─── */}
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
