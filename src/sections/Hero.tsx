import { FileText, ExternalLink } from 'pixelarticons/react'
import Container from '../components/Container'
import Button from '../components/Button'
import KineticHeadline from '../components/KineticHeadline'
import CursorTelemetry from '../components/CursorTelemetry'
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
        {/* ─── Eyebrow / Terminal Status Pill ─── */}
        <div className={`flex flex-wrap items-center justify-between gap-3 text-micro-caps text-secondary mb-6 sm:mb-8 ${isRevealed ? 'animate-hero-in' : 'opacity-0'}`}>
          <div className="flex items-center gap-2.5">
            <span className="pixel-beacon shrink-0" aria-hidden="true" />
            <span className="text-foreground font-semibold">// STATUS: AVAILABLE FOR ROLES & CONTRACTS</span>
            <span className="text-border-strong hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">KARACHI, PK (REMOTE & LOCAL)</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <KarachiClock format="compact" />
          </div>
        </div>

        {/* ─── Asymmetrical 3-Row Editorial Kinetic Headline ─── */}
        <div className={`mb-8 sm:mb-12 ${isRevealed ? 'animate-hero-in delay-60' : 'opacity-0'}`}>
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
                  <div className="flex flex-col text-left lg:text-right font-mono text-[10px] sm:text-xs text-muted leading-tight tracking-wider uppercase border-l-2 lg:border-l-0 lg:border-r-2 border-border pl-2.5 lg:pl-0 lg:pr-3 py-0.5">
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
                    className="editorial-cta text-base sm:text-lg lg:text-xl font-mono font-medium text-foreground hover:text-secondary transition-colors select-none py-1"
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

        {/* ─── Fast Actions (Contact & Resume) ─── */}
        <div className={`flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-10 ${isRevealed ? 'animate-hero-in delay-120' : 'opacity-0'}`}>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="/contact" variant="primary" size="md">
              Contact
            </Button>
            <Button
              href="/resume.pdf"
              variant="secondary"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
              className="tactile-btn !px-3.5 !py-2 text-micro-caps text-secondary shadow-2xs"
              style={{ boxShadow: 'var(--hairline-top)' }}
              aria-label="View official Resume (PDF, opens in new tab)"
            >
              <FileText className="w-3.5 h-3.5 pixel-icon text-emerald-500 shrink-0" />
              <span>RESUME (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5 pixel-icon text-muted group-hover:text-white transition-colors" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-micro-caps text-muted font-mono">
            <span>// C# · ASP.NET CORE · SQL SERVER · REACT</span>
          </div>
        </div>

        {/* ─── Client Value & Practical Pillars ─── */}
        <div className={`border-t border-border pt-7 sm:pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 ${isRevealed ? 'animate-hero-in delay-180' : 'opacity-0'}`}>
          <div
            className="p-4 rounded-xs border border-border bg-surface flex flex-col gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs pixel-corners"
            style={{ boxShadow: 'var(--hairline-top)' }}
          >
            <span className="text-micro-caps text-muted">
              // FULL-STACK
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-foreground tracking-tight">
              End-to-End Apps
            </span>
            <span className="text-[11px] font-mono text-secondary">
              ASP.NET Core APIs, SQL Server & modern UI
            </span>
          </div>

          <div
            className="p-4 rounded-xs border border-border bg-surface flex flex-col gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs pixel-corners"
            style={{ boxShadow: 'var(--hairline-top)' }}
          >
            <span className="text-micro-caps text-muted">
              // DATA INTEGRITY
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-foreground tracking-tight">
              Reliable Databases
            </span>
            <span className="text-[11px] font-mono text-secondary">
              Normalized relational schemas & ACID transactions
            </span>
          </div>

          <div
            className="p-4 rounded-xs border border-border bg-surface flex flex-col gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs pixel-corners"
            style={{ boxShadow: 'var(--hairline-top)' }}
          >
            <span className="text-micro-caps text-muted">
              // PROBLEM SOLVING
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-500 tracking-tight">
              Edge Case Handling
            </span>
            <span className="text-[11px] font-mono text-secondary">
              Concurrency tokens & clear error recovery
            </span>
          </div>

          <div
            className="p-4 rounded-xs border border-border bg-surface flex flex-col gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs pixel-corners"
            style={{ boxShadow: 'var(--hairline-top)' }}
          >
            <span className="text-micro-caps text-muted">
              // WORK ETHIC
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-foreground tracking-tight">
              Clean Execution
            </span>
            <span className="text-[11px] font-mono text-secondary">
              Readable code, clear communication & testing
            </span>
          </div>
        </div>

        {/* ─── Bottom Telemetry & Studio HUD Bar ─── */}
        <div className={`border-t border-border mt-8 sm:mt-10 pt-4 flex flex-wrap items-center justify-between gap-3 text-micro-caps text-muted font-mono ${isRevealed ? 'animate-hero-in delay-240' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <CursorTelemetry />
            <span className="text-border-strong hidden sm:inline" aria-hidden="true">|</span>
            <span className="hidden sm:inline text-secondary">VIEWPORT TELEMETRY</span>
          </div>

          <div className="flex items-center gap-3">
            <KarachiClock showIcon format="full" />
            <span className="text-border-strong" aria-hidden="true">·</span>
            <span className="text-secondary">SYSTEM V2.0</span>
          </div>
        </div>
      </Container>
    </section>
  )
}
