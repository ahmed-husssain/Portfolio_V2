import { FileText, ArrowUpRight } from 'lucide-react'
import Container from '../components/Container'
import Button from '../components/Button'

export default function Hero() {
  return (
    <section className="pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-24 md:pb-28 border-b border-border">
      <Container>
        {/* ─── Eyebrow ─── */}
        <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm text-secondary mb-4 sm:mb-5 animate-hero-in">
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
          Hi, I'm Ahmed. I engineer concurrency-safe backends, clinical operating systems, and real-time web applications.
        </h1>

        {/* ─── Supporting Paragraph ─── */}
        <p className="text-secondary text-base sm:text-lg md:text-xl max-w-[720px] leading-relaxed mb-6 sm:mb-8 animate-hero-in delay-120">
          Software and website developer based in Karachi, Pakistan. Specialized in C#, ASP.NET Core, SQL Server, and Flutter with PostgreSQL. I build systems designed for data integrity—preventing race conditions, eliminating duplicate financial sequences, and delivering reliable software for production users.
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

        {/* ─── Primary & Secondary CTAs + Resume ─── */}
        <div className="flex flex-wrap items-center gap-3.5 mb-16 sm:mb-20 animate-hero-in delay-180">
          <Button href="#work" variant="primary" size="md" icon>
            View Work
          </Button>
          <Button href="#contact" variant="secondary" size="md">
            Contact Me
          </Button>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-hover hover:border-border-strong text-xs sm:text-sm font-mono font-semibold tracking-wider uppercase transition-all duration-150 active:scale-[0.98] group"
            aria-label="View official Resume (PDF, opens in new tab)"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>Resume (PDF)</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </div>

        {/* ─── Verified Production Proof Bar ─── */}
        <div className="border-t border-border pt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-hero-in delay-240">
          <div className="p-3.5 sm:p-4 rounded-sm border border-border bg-surface flex flex-col gap-1">
            <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
              // CLIENT DELIVERY
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-foreground">
              3 Months
            </span>
            <span className="text-[11px] font-mono text-secondary">
              Zero-to-production clinical platform
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-sm border border-border bg-surface flex flex-col gap-1">
            <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
              // BILLING SAFETY
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-500">
              0 Duplicates
            </span>
            <span className="text-[11px] font-mono text-secondary">
              PostgreSQL atomic sequence locks
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-sm border border-border bg-surface flex flex-col gap-1">
            <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
              // AUTOMATED TESTS
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-foreground">
              93 Passed
            </span>
            <span className="text-[11px] font-mono text-secondary">
              Verified clinical & financial logic
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-sm border border-border bg-surface flex flex-col gap-1">
            <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
              // REAL-TIME PUSH
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-foreground">
              &lt; 10ms Latency
            </span>
            <span className="text-[11px] font-mono text-secondary">
              SignalR WebSocket multicast
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
