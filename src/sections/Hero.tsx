import Container from '../components/Container'
import Button from '../components/Button'

export default function Hero() {
  return (
    <section className="pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 md:pb-36 border-b border-border">
      <Container>
        {/* ─── Eyebrow ─── */}
        <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm text-secondary mb-6 sm:mb-8 animate-hero-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-foreground font-medium">Available for Roles</span>
          <span className="text-border-strong">·</span>
          <span>Karachi, Pakistan (Remote & On-site)</span>
        </div>

        {/* ─── Main Headline ─── */}
        <h1 className="text-[clamp(1.75rem,5vw,3.85rem)] font-bold tracking-tight leading-[1.12] text-foreground mb-6 sm:mb-8 max-w-[980px] animate-hero-in delay-60">
          Hi, I'm Ahmed. I build .NET backends and full-stack web applications with modern AI workflows.
        </h1>

        {/* ─── Supporting Paragraph ─── */}
        <p className="text-secondary text-base sm:text-lg md:text-xl max-w-[680px] leading-relaxed mb-6 sm:mb-8 animate-hero-in delay-120">
          Specialized in C#, ASP.NET Core, and relational SQL Server databases. I pair solid backend fundamentals with AI coding tools to turn complex product requirements into clean, production-ready software.
        </p>

        {/* ─── Proof Badge ─── */}
        <div className="flex items-center mb-10 sm:mb-12 animate-hero-in delay-150">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-surface text-xs font-mono text-secondary">
            <span className="text-amber-500">🏆</span>
            <span className="text-foreground font-semibold">Runner-Up</span>
            <span className="text-border-strong">·</span>
            <span>Aptech Vision 2025 (Mockrithm)</span>
          </div>
        </div>

        {/* ─── Primary & Secondary CTAs ─── */}
        <div className="flex flex-wrap items-center gap-4 mb-16 sm:mb-20 animate-hero-in delay-180">
          <Button href="#work" variant="primary" size="md" icon>
            View Work
          </Button>
          <Button href="#contact" variant="secondary" size="md">
            Contact Me
          </Button>
        </div>

        {/* ─── Technical Metadata Spec Readout Bar ─── */}
        <div className="border-t border-border pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 animate-hero-in delay-240">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
              // 01. SPECIALIZATION
            </span>
            <span className="font-mono text-xs sm:text-sm text-foreground font-medium">
              Backend & .NET Web Architecture
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
              // 02. CORE STACK
            </span>
            <span className="font-mono text-xs sm:text-sm text-foreground font-medium">
              C#, ASP.NET Core, SQL Server, React, Tailwind CSS
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
              // 03. ENGINEERING FOCUS
            </span>
            <span className="font-mono text-xs sm:text-sm text-foreground font-medium">
              Clean Architecture, Idempotent APIs & Relational Schemas
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
