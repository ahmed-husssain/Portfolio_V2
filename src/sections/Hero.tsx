import { FileText, ExternalLink } from 'pixelarticons/react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import KineticHeadline from '../components/motion/KineticHeadline'
import KarachiClock from '../components/KarachiClock'
import { useSplash } from '../components/SplashLoader'

interface HeroProps {
  isRevealed?: boolean
}

export default function Hero({ isRevealed: propIsRevealed }: HeroProps) {
  const { isRevealed: splashRevealed } = useSplash()
  const isRevealed = propIsRevealed !== undefined ? propIsRevealed : splashRevealed

  return (
    <section
      className={`pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 border-b border-border relative overflow-hidden bg-page transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isRevealed ? 'animate-hero-pop' : 'opacity-0 pointer-events-none translate-y-10 scale-[0.98]'
      }`}
    >
      {/* ─── Ambient Subtle Glow (Apple Material Depth) ─── */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-foreground/[0.03] to-transparent blur-3xl rounded-full"
        aria-hidden="true"
      />

      <Container>
        {/* ─── Eyebrow / Availability Status ─── */}
        <div className={`flex flex-wrap items-center justify-between gap-2.5 text-micro-caps text-secondary mb-5 sm:mb-8 ${isRevealed ? 'animate-hero-in' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            <span className="pixel-beacon shrink-0" aria-hidden="true" />
            <span className="text-foreground font-semibold text-[10px] sm:text-micro-caps tracking-wide">STATUS: AVAILABLE FOR ROLES & CONTRACTS</span>
            <span className="text-border-strong hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">KARACHI, PK (REMOTE & LOCAL)</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <KarachiClock format="compact" />
          </div>
        </div>

        {/* ─── Asymmetrical 3-Row Editorial Kinetic Headline ─── */}
        <div className={`mb-4 sm:mb-12 ${isRevealed ? 'animate-hero-in delay-60' : 'opacity-0'}`}>
          <KineticHeadline
            lines={[
              {
                prefix: (
                  <span className="font-mono text-micro-caps text-muted normal-case tracking-normal">
                    (developer — since 2023)
                  </span>
                ),
                text: 'Web apps that scale,',
              },
              {
                text: 'built with clean code &',
                suffix: (
                  <div className="hidden lg:flex flex-col text-right font-mono text-xs text-muted leading-tight tracking-wider uppercase border-r-2 border-border pr-3 py-0.5">
                    <span className="text-foreground font-semibold">ASP.NET CORE & C#,</span>
                    <span>SQL SERVER & MODERN WEB</span>
                  </div>
                ),
              },
              {
                text: 'designed to perform.',
                suffix: (
                  <a
                    href="#work"
                    className="hidden lg:inline-flex editorial-cta text-base sm:text-lg lg:text-xl font-mono font-medium text-foreground hover:text-secondary transition-colors select-none py-1"
                  >
                    <span>View Selected Work</span>
                    <span className="arrow-box" aria-hidden="true">
                      <span className="arrow-glyph">↗</span>
                    </span>
                  </a>
                ),
              },
            ]}
          />
        </div>

        {/* ─── Mobile Tech Capabilities & Stack Tag ─── */}
        <div className={`flex lg:hidden items-center gap-2 text-micro-caps text-secondary font-mono border-l-2 border-accent pl-2.5 py-0.5 mb-5 ${isRevealed ? 'animate-hero-in delay-90' : 'opacity-0'}`}>
          <span className="text-foreground font-semibold">ASP.NET CORE & C#</span>
          <span className="text-muted">·</span>
          <span>SQL SERVER & MODERN WEB</span>
        </div>

        {/* ─── Mobile Action Group (Touch-Native & Balanced) ─── */}
        <div className={`flex lg:hidden flex-col gap-2.5 mb-8 ${isRevealed ? 'animate-hero-in delay-120' : 'opacity-0'}`}>
          <Button
            href="#work"
            variant="primary"
            size="md"
            className="w-full justify-center group"
          >
            <span>View Selected Work</span>
            <span className="ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
          </Button>

          <div className="grid grid-cols-2 gap-2.5">
            <Button href="/contact" variant="secondary" size="md" className="justify-center">
              Contact
            </Button>
            <Button
              href="/resume.pdf"
              variant="secondary"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
              className="justify-center"
              aria-label="View official Resume (PDF, opens in new tab)"
            >
              <FileText className="w-3.5 h-3.5 pixel-icon text-emerald-500 shrink-0" />
              <span>RESUME</span>
              <ExternalLink className="w-3.5 h-3.5 pixel-icon text-muted shrink-0" />
            </Button>
          </div>
        </div>

        {/* ─── Desktop Fast Actions (Contact & Resume) ─── */}
        <div className={`hidden lg:flex items-center justify-between gap-4 mb-8 sm:mb-10 ${isRevealed ? 'animate-hero-in delay-120' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <Button href="/contact" variant="primary" size="md">
              Contact
            </Button>
            <Button
              href="/resume.pdf"
              variant="secondary"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ boxShadow: 'var(--hairline-top)' }}
              aria-label="View official Resume (PDF, opens in new tab)"
            >
              <FileText className="w-3.5 h-3.5 pixel-icon text-emerald-500 group-hover:text-black shrink-0 transition-colors" />
              <span>RESUME (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5 pixel-icon text-muted group-hover:text-black shrink-0 transition-colors" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-micro-caps text-muted font-mono">
            <span>C# · ASP.NET CORE · SQL SERVER · REACT</span>
          </div>
        </div>

        {/* ─── Client Value & Practical Pillars (Responsive 2x2 on Mobile, 4x1 on Desktop) ─── */}
        <div className={`border-t border-border pt-6 sm:pt-8 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 ${isRevealed ? 'animate-hero-in delay-180' : 'opacity-0'}`}>
          <div
            className="p-3 sm:p-4 rounded-xs border border-border bg-surface flex flex-col gap-1 sm:gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs pixel-corners"
            style={{ boxShadow: 'var(--hairline-top)' }}
          >
            <span className="text-[10px] sm:text-micro-caps text-muted font-mono">
              FULL-STACK
            </span>
            <span className="text-sm sm:text-lg font-bold font-mono text-foreground tracking-tight leading-tight">
              End-to-End Apps
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-secondary leading-snug">
              ASP.NET Core APIs, SQL Server & modern UI
            </span>
          </div>

          <div
            className="p-3 sm:p-4 rounded-xs border border-border bg-surface flex flex-col gap-1 sm:gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs pixel-corners"
            style={{ boxShadow: 'var(--hairline-top)' }}
          >
            <span className="text-[10px] sm:text-micro-caps text-muted font-mono">
              DATA INTEGRITY
            </span>
            <span className="text-sm sm:text-lg font-bold font-mono text-foreground tracking-tight leading-tight">
              Reliable Databases
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-secondary leading-snug">
              Normalized schemas & ACID transactions
            </span>
          </div>

          <div
            className="p-3 sm:p-4 rounded-xs border border-border bg-surface flex flex-col gap-1 sm:gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs pixel-corners"
            style={{ boxShadow: 'var(--hairline-top)' }}
          >
            <span className="text-[10px] sm:text-micro-caps text-muted font-mono">
              PROBLEM SOLVING
            </span>
            <span className="text-sm sm:text-lg font-bold font-mono text-emerald-500 tracking-tight leading-tight">
              Edge Cases
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-secondary leading-snug">
              Concurrency tokens & error recovery
            </span>
          </div>

          <div
            className="p-3 sm:p-4 rounded-xs border border-border bg-surface flex flex-col gap-1 sm:gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs pixel-corners"
            style={{ boxShadow: 'var(--hairline-top)' }}
          >
            <span className="text-[10px] sm:text-micro-caps text-muted font-mono">
              WORK ETHIC
            </span>
            <span className="text-sm sm:text-lg font-bold font-mono text-foreground tracking-tight leading-tight">
              Clean Execution
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-secondary leading-snug">
              Readable code, tests & clear updates
            </span>
          </div>
        </div>

        {/* ─── Bottom Status & Local Time Bar ─── */}
        <div className={`border-t border-border mt-8 sm:mt-10 pt-4 flex flex-wrap items-center justify-between gap-3 text-micro-caps text-muted font-mono ${isRevealed ? 'animate-hero-in delay-240' : 'opacity-0'}`}>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-secondary font-medium">KARACHI, PAKISTAN</span>
            <span className="text-border-strong hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline text-muted">AVAILABLE FOR REMOTE & ON-SITE ROLES</span>
          </div>

          <div className="flex items-center gap-3">
            <KarachiClock showIcon format="full" />
          </div>
        </div>
      </Container>
    </section>
  )
}
