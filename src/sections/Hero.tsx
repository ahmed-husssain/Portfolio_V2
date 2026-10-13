import { FileText, ExternalLink, Trophy } from 'pixelarticons/react'
import Container from '../components/Container'
import Button from '../components/Button'
import KineticHeadline from '../components/KineticHeadline'
import CursorTelemetry from '../components/CursorTelemetry'
import KarachiClock from '../components/KarachiClock'

export default function Hero() {
  return (
    <section className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 border-b border-border relative overflow-hidden bg-page">
      {/* ─── Ambient Subtle Glow (Apple Material Depth) ─── */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-foreground/[0.03] to-transparent blur-3xl rounded-full"
        aria-hidden="true"
      />

      <Container>
        {/* ─── Eyebrow / Terminal Status Pill ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-micro-caps text-secondary mb-6 sm:mb-8 animate-hero-in">
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
        <div className="mb-8 sm:mb-12 animate-hero-in delay-60">
          <KineticHeadline
            lines={[
              {
                prefix: (
                  <span className="font-mono text-micro-caps text-muted normal-case tracking-normal">
                    (developer — since 2024)
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
                    className="inline-flex items-center gap-2 text-sm sm:text-base lg:text-lg font-mono font-medium text-foreground hover:text-secondary group transition-colors select-none py-1"
                  >
                    <span className="border-b border-foreground group-hover:border-secondary transition-colors pb-0.5">
                      View Selected Work
                    </span>
                    <span className="text-lg leading-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150">
                      ↗
                    </span>
                  </a>
                ),
              },
            ]}
          />
        </div>

        {/* ─── Supporting Description & Credentials Lockup ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start mb-10 sm:mb-12 animate-hero-in delay-120">
          <div className="lg:col-span-8 flex flex-col gap-5">
            <p className="text-body-lead text-secondary max-w-[720px]">
              Specialized in C#, ASP.NET Core, SQL Server, and modern web architectures. I build practical full-stack web and mobile applications from scratch—focusing on clean code, database integrity, and responsive user experiences.
            </p>

            {/* Proof Badge */}
            <div className="flex items-center">
              <div
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xs border border-border bg-surface text-micro-caps text-secondary shadow-2xs pixel-corners"
                style={{ boxShadow: 'var(--hairline-top)' }}
              >
                <Trophy className="w-3.5 h-3.5 pixel-icon text-amber-500 shrink-0" aria-hidden="true" />
                <span className="text-foreground font-bold">RUNNER-UP AWARD</span>
                <span className="text-border-strong" aria-hidden="true">·</span>
                <span className="text-muted">APTECH VISION 2025 (MOCKRITHM)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Button href="#work" variant="primary" size="md" icon>
                View Work
              </Button>
              <Button href="/contact" variant="secondary" size="md">
                Contact
              </Button>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xs border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-hover hover:border-border-strong text-micro-caps transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.96] group shadow-2xs select-none"
                style={{ boxShadow: 'var(--hairline-top)' }}
                aria-label="View official Resume (PDF, opens in new tab)"
              >
                <FileText className="w-3.5 h-3.5 pixel-icon text-emerald-500 shrink-0" />
                <span>RESUME (PDF)</span>
                <ExternalLink className="w-3.5 h-3.5 pixel-icon text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150 ease-out" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex flex-col gap-2 p-4 rounded-xs border border-border bg-surface-subtle/50 text-micro-caps">
            <span className="text-muted">// ENGINEERING FOCUS</span>
            <div className="flex flex-col gap-1 text-[11px] font-mono text-secondary">
              <div className="flex justify-between border-b border-border/60 pb-1">
                <span>Architecture</span>
                <span className="text-foreground font-semibold">Clean / N-Tier</span>
              </div>
              <div className="flex justify-between border-b border-border/60 py-1">
                <span>Backend</span>
                <span className="text-foreground font-semibold">ASP.NET Core / EF Core</span>
              </div>
              <div className="flex justify-between border-b border-border/60 py-1">
                <span>Database</span>
                <span className="text-foreground font-semibold">SQL Server / Relational</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Frontend</span>
                <span className="text-foreground font-semibold">React / TypeScript / Tailwind</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Client Value & Practical Pillars ─── */}
        <div className="border-t border-border pt-7 sm:pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 animate-hero-in delay-180">
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
        <div className="border-t border-border mt-8 sm:mt-10 pt-4 flex flex-wrap items-center justify-between gap-3 text-micro-caps text-muted font-mono animate-hero-in delay-240">
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
