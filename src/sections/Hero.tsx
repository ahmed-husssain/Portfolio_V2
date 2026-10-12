import { FileText, ArrowUpRight, Trophy } from 'lucide-react'
import Container from '../components/Container'
import Button from '../components/Button'

export default function Hero() {
  return (
    <section className="pt-20 sm:pt-28 pb-12 sm:pb-16 md:pb-24 border-b border-border relative overflow-hidden">
      {/* ─── Ambient Subtle Glow (Apple Material Depth) ─── */}
      <div 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-foreground/[0.04] to-transparent blur-3xl rounded-full"
        aria-hidden="true"
      />

      <Container>
        {/* ─── Eyebrow / Terminal Status Pill ─── */}
        <div className="flex flex-wrap items-center gap-2.5 text-micro-caps text-secondary mb-4 sm:mb-6 animate-hero-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-foreground font-semibold">// STATUS: AVAILABLE FOR ROLES</span>
          <span className="text-border-strong" aria-hidden="true">·</span>
          <span>KARACHI, PK (REMOTE & LOCAL)</span>
        </div>

        {/* ─── Main Headline (Grounded, Honest Title) ─── */}
        <h1 className="text-display text-foreground mb-5 sm:mb-7 max-w-[960px] animate-hero-in delay-60">
          Full-Stack .NET & Web Developer. Building reliable web apps, clean APIs, and responsive digital products.
        </h1>

        {/* ─── Supporting Paragraph (Ownership & Problem-Solving) ─── */}
        <p className="text-body-lead text-secondary max-w-[740px] mb-6 sm:mb-8 animate-hero-in delay-120">
          Specialized in C#, ASP.NET Core, SQL Server, and Flutter. I build practical web and mobile applications from scratch—focusing on clean code, database integrity, and smooth user experiences.
        </p>

        {/* ─── Proof Badge ─── */}
        <div className="flex items-center mb-8 sm:mb-10 animate-hero-in delay-150">
          <div 
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xs border border-border bg-surface text-micro-caps text-secondary shadow-2xs"
            style={{ boxShadow: 'var(--hairline-top)' }}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
            <span className="text-foreground font-bold">RUNNER-UP AWARD</span>
            <span className="text-border-strong" aria-hidden="true">·</span>
            <span className="text-muted">APTECH VISION 2025 (MOCKRITHM)</span>
          </div>
        </div>

        {/* ─── Primary & Secondary CTAs + Resume ─── */}
        <div className="flex flex-wrap items-center gap-3.5 mb-10 sm:mb-14 animate-hero-in delay-180">
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
            <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>RESUME (PDF)</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150 ease-out" />
          </a>
        </div>

        {/* ─── Client Value & Practical Pillars ─── */}
        <div className="border-t border-border pt-7 sm:pt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 animate-hero-in delay-240">
          <div 
            className="p-4 rounded-xs border border-border bg-surface flex flex-col gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs"
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
            className="p-4 rounded-xs border border-border bg-surface flex flex-col gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs"
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
            className="p-4 rounded-xs border border-border bg-surface flex flex-col gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs"
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
            className="p-4 rounded-xs border border-border bg-surface flex flex-col gap-1.5 transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong shadow-2xs"
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
      </Container>
    </section>
  )
}
