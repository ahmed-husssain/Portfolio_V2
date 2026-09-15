import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './lib/theme'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Critical Homepage kept in initial bundle
import Home from './pages/Home'

// Route-based code splitting via React.lazy
const Work = lazy(() => import('./pages/Work'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const About = lazy(() => import('./pages/About'))
const Writing = lazy(() => import('./pages/Writing'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const Review = lazy(() => import('./pages/Review'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Minimal, non-intrusive fallback matching Variant C
function PageFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex items-center gap-2 text-xs font-mono text-muted tracking-wider uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" aria-hidden="true" />
        <span>LOADING...</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-page text-foreground flex flex-col selection:bg-accent-bg selection:text-accent-text">
          {/* ─── Fixed Header / Navbar ─── */}
          <Navbar />

          {/* ─── Route Viewport with Code-Split Boundaries ─── */}
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<ProjectDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/writing/:slug" element={<ArticleDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/review" element={<Review />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          {/* ─── Global Footer ─── */}
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
