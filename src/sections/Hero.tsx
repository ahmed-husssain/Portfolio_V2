import Container from '../components/Container'
import Button from '../components/Button'

export default function Hero() {
  return (
    <section className="pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 md:pb-36 border-b border-border">
      <Container>
        {/* ─── Eyebrow ─── */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-muted uppercase">
            // FULL-STACK WEB DEVELOPER
          </span>
          <span className="h-px flex-1 max-w-[80px] bg-border-strong hidden sm:inline-block" aria-hidden="true" />
        </div>

        {/* ─── Main Headline ─── */}
        <h1 className="text-[clamp(2.25rem,6vw,5rem)] font-bold tracking-tight leading-[1.08] text-foreground mb-8 max-w-[960px]">
          Building digital products with thoughtful engineering.
        </h1>

        {/* ─── Supporting Description ─── */}
        <p className="text-secondary text-base sm:text-lg md:text-xl max-w-[620px] leading-relaxed mb-10 sm:mb-12">
          I design, architect, and ship production-ready web applications focused on performance, accessibility, and clean maintainable code.
        </p>

        {/* ─── CTA Action Group ─── */}
        <div className="flex flex-wrap items-center gap-4 mb-16 sm:mb-20">
          <Button href="#work" variant="primary" size="md" icon>
            Selected Work
          </Button>
          <Button href="#contact" variant="secondary" size="md">
            Get In Touch
          </Button>
        </div>

        {/* ─── Technical Spec Readout Bar ─── */}
        <div className="border-t border-border pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
              // 01. CORE CAPABILITY
            </span>
            <span className="font-mono text-xs sm:text-sm text-foreground font-medium">
              Full-Stack Architecture & APIs
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
              // 02. PRIMARY STACK
            </span>
            <span className="font-mono text-xs sm:text-sm text-foreground font-medium">
              TypeScript, Next.js, Node, SQL
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
              // 03. ENGINEERING MOTTO
            </span>
            <span className="font-mono text-xs sm:text-sm text-foreground font-medium">
              Ship Value, Eliminate Bloat
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
