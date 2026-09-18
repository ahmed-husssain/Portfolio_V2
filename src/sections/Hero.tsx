import Container from '../components/Container'
import Button from '../components/Button'

export default function Hero() {
  return (
    <section className="pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 md:pb-36 border-b border-border">
      <Container>
        {/* ─── Eyebrow ─── */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8 animate-hero-in">
          <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-muted uppercase">
            // FULL-STACK WEB DEVELOPER
          </span>
          <span className="h-px flex-1 max-w-[80px] bg-border-strong hidden sm:inline-block" aria-hidden="true" />
        </div>

        {/* ─── Main Headline ─── */}
        <h1 className="text-[clamp(1.75rem,5vw,3.85rem)] font-bold tracking-tight leading-[1.12] text-foreground mb-8 max-w-[980px] animate-hero-in delay-60">
          I build web applications, APIs, and backend systems that solve real problems.
        </h1>

        {/* ─── Supporting Paragraph ─── */}
        <p className="text-secondary text-base sm:text-lg md:text-xl max-w-[660px] leading-relaxed mb-10 sm:mb-12 animate-hero-in delay-120">
          Working across the full stack—from modern TypeScript frontends to resilient database schemas and server logic. Focused on performance, maintainability, and clean architecture.
        </p>

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
              Full-Stack Web & API Architecture
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
              // 02. CORE TOOLING
            </span>
            <span className="font-mono text-xs sm:text-sm text-foreground font-medium">
              Next.js, TypeScript, Node, SQL & NoSQL
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
              // 03. ENGINEERING FOCUS
            </span>
            <span className="font-mono text-xs sm:text-sm text-foreground font-medium">
              High Throughput, Zero Runtime Bloat
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
