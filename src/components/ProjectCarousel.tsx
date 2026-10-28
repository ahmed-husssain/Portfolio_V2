import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  Layers,
} from 'lucide-react'

export interface CarouselSlide {
  image: string
  title: string
  description?: string
  tag?: string
}

interface ProjectCarouselProps {
  slides: CarouselSlide[]
  projectTitle: string
}

export default function ProjectCarousel({ slides, projectTitle }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const autoplayRef = useRef<number | null>(null)

  const total = slides.length
  const currentSlide = slides[activeIndex]

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Autoplay management (pauses when user interacts or hover)
  useEffect(() => {
    if (isPlaying && !isLightboxOpen) {
      autoplayRef.current = window.setInterval(nextSlide, 4500)
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [isPlaying, isLightboxOpen, nextSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, isLightboxOpen])

  // Scroll and Lenis lock when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        ;(window as any).__lenis.stop()
      }
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        ;(window as any).__lenis.start()
      }
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }

    return () => {
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        ;(window as any).__lenis.start()
      }
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isLightboxOpen])

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0]?.clientX ?? null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? null)
  }

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return
    const distance = touchStart - touchEnd
    const isSwipe = Math.abs(distance) > 50
    if (isSwipe) {
      if (distance > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  if (!slides || slides.length === 0) return null

  return (
    <div
      className="space-y-4 select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${projectTitle} interactive interface carousel`}
    >
      {/* ── Main Viewport Stage ── */}
      <div
        className="group relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-sm overflow-hidden border border-border bg-page shadow-sm pixel-corners focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
        tabIndex={0}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => isPlaying && setIsPlaying(false)}
      >
        {/* Slide Images Container - Click to open full-resolution lightbox */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          data-cursor-text="EXPAND ↗"
          className="relative w-full h-full overflow-hidden bg-black/40 cursor-zoom-in group/stage"
          title="Click to view full screen"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex
            return (
              <div
                key={slide.image}
                className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? 'opacity-100 scale-100 pointer-events-auto z-10'
                    : 'opacity-0 scale-[1.03] pointer-events-none z-0'
                }`}
                aria-hidden={!isActive}
              >
                <img
                  src={slide.image}
                  alt={`${projectTitle} — ${slide.title}`}
                  className="w-full h-full object-cover object-top group-hover/stage:scale-[1.015] transition-transform duration-500 ease-out"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  width="1024"
                  height="576"
                />
              </div>
            )
          })}

          {/* Hover Expand Badge */}
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/stage:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center justify-center z-15">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 text-white border border-white/20 text-xs font-mono font-semibold backdrop-blur-md shadow-lg">
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>CLICK TO EXPAND FULLSCREEN</span>
            </span>
          </div>
        </div>

        {/* Floating Top Header Badges */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-20"
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xs bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-foreground font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">
              0{activeIndex + 1}
            </span>
            <span className="text-white/40">/</span>
            <span className="text-white/80">0{total}</span>
            {currentSlide?.tag && (
              <>
                <span className="text-white/30">·</span>
                <span className="text-white/90 uppercase tracking-wider text-[9px] font-bold">
                  {currentSlide.tag}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Play / Pause Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsPlaying(!isPlaying)
              }}
              className="p-1.5 rounded-2xs bg-black/80 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/95 active:scale-95 transition-all cursor-pointer"
              aria-label={isPlaying ? 'Pause slideshow' : 'Start slideshow'}
              title={isPlaying ? 'Pause auto-advance' : 'Auto-play slides'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Lightbox Trigger */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsLightboxOpen(true)
              }}
              className="p-1.5 rounded-2xs bg-black/80 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/95 active:scale-95 transition-all cursor-pointer"
              aria-label="Inspect screenshot in full screen"
              title="Expand full resolution"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Previous & Next Floating Buttons */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            prevSlide()
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-xs bg-black/75 hover:bg-black/95 backdrop-blur-md border border-white/15 text-white shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 active:scale-90 transition-all duration-200 z-20 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            nextSlide()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-xs bg-black/75 hover:bg-black/95 backdrop-blur-md border border-white/15 text-white shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 active:scale-90 transition-all duration-200 z-20 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Interactive Expanded Pill Indicators */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-20 pointer-events-auto"
        >
          {slides.map((_, idx) => {
            const isCurrent = idx === activeIndex
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex(idx)
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'w-7 bg-emerald-400 shadow-sm shadow-emerald-400/50'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Jump to slide ${idx + 1}`}
                aria-current={isCurrent ? 'true' : 'false'}
              />
            )
          })}
        </div>
      </div>

      {/* ── Active Slide Caption & Architectural Note ── */}
      <div className="p-4 rounded-sm border border-border bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono pixel-corners">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              SLIDE 0{activeIndex + 1}
            </span>
            <span className="text-border-strong" aria-hidden="true">·</span>
            <h3 className="font-bold text-foreground text-sm tracking-tight">
              {currentSlide?.title}
            </h3>
          </div>
          {currentSlide?.description && (
            <p className="text-secondary text-xs sm:text-[13px] leading-relaxed max-w-2xl font-sans">
              {currentSlide.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-border bg-page text-foreground hover:bg-surface-subtle active:scale-95 transition-all text-[11px] font-mono font-semibold cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>FULL RESOLUTION</span>
          </button>
        </div>
      </div>

      {/* ── Interactive Filmstrip Thumbnails ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {slides.map((slide, idx) => {
          const isCurrent = idx === activeIndex
          return (
            <button
              key={slide.image}
              type="button"
              onClick={() => {
                if (isCurrent) {
                  setIsLightboxOpen(true)
                } else {
                  setActiveIndex(idx)
                }
              }}
              data-cursor-text={isCurrent ? 'EXPAND ↗' : `SLIDE 0${idx + 1}`}
              className={`group/thumb relative aspect-[16/10] rounded-xs overflow-hidden border text-left transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs'
                  : 'border-border/80 opacity-65 hover:opacity-100 hover:border-border-strong'
              }`}
              aria-label={isCurrent ? `Expand slide ${idx + 1}: ${slide.title}` : `Select slide ${idx + 1}: ${slide.title}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-top group-hover/thumb:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
                width="256"
                height="144"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2">
                <span className="text-[9px] font-mono font-bold text-white tracking-wider line-clamp-1">
                  0{idx + 1} · {slide.title}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── High-Resolution Lightbox Modal (Portaled directly to document.body) ── */}
      {isLightboxOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 bg-neutral-950/95 backdrop-blur-2xl select-none"
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} screenshot preview`}
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar Controls */}
          <div
            className="w-full max-w-6xl flex items-center justify-between pb-3 text-white text-xs font-mono border-b border-white/10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 truncate pr-4">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold tracking-tight text-white">{projectTitle}</span>
              <span className="text-white/40">·</span>
              <span className="text-emerald-400 font-semibold shrink-0">
                0{activeIndex + 1} / 0{total}
              </span>
              <span className="text-white/80 hidden sm:inline truncate">— {currentSlide?.title}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] text-white/50 hidden md:inline">
                [ESC] or click outside to close
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xs bg-white/10 hover:bg-white/25 active:scale-95 text-white transition-all cursor-pointer flex items-center justify-center border border-white/20"
                aria-label="Close full resolution viewer"
                title="Close [ESC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Image Display */}
          <div
            className="relative w-full max-w-6xl flex-1 my-3 sm:my-4 flex items-center justify-center overflow-hidden min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-full max-h-full rounded-sm overflow-hidden border border-white/15 bg-black shadow-2xl flex items-center justify-center">
              <img
                src={currentSlide?.image}
                alt={currentSlide?.title}
                className="max-w-full max-h-[72vh] sm:max-h-[78vh] w-auto h-auto object-contain select-none"
              />
            </div>

            {/* Modal Navigation Arrows */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prevSlide()
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-black/85 hover:bg-black border border-white/20 text-white shadow-2xl active:scale-95 transition-all cursor-pointer z-30"
              aria-label="Previous slide"
              title="Previous [←]"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                nextSlide()
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-black/85 hover:bg-black border border-white/20 text-white shadow-2xl active:scale-95 transition-all cursor-pointer z-30"
              aria-label="Next slide"
              title="Next [→]"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Modal Bottom Caption & Indicator Dots */}
          <div
            className="w-full max-w-6xl pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-white/80 border-t border-white/10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-center sm:text-left text-white/90 line-clamp-2 max-w-3xl">
              {currentSlide?.description || currentSlide?.title}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-6 bg-emerald-400'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
