import { FileText, ArrowUpRight } from 'lucide-react'
import Container from '../components/Container'
import Button from '../components/Button'

export default function Hero() {
  return (
    <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20 border-b border-border">
      <Container>
        {/* ─── Eyebrow ─── */}
        <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm text-secondary mb-3 sm:mb-4 animate-hero-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-foreground font-medium">Available for Roles</span>
          <span className="text-border-strong">·</span>
          <span>Karachi, Pakistan (Remote & On-site)</span>
        </div>

        {/* ─── Main Headline ─── */}
        <h1 className="text-[clamp(1.75rem,5vw,3.85rem)] font-bold tracking-tight leading-[1.12] text-foreground mb-4 sm:mb-6 max-w-[980px] animate-hero-in delay-60">
          Hi, I'm Ahmed. I engineer concurrency-safe backends, clinical operating systems, and real-time web applications.
        </h1>

        {/* ─── Supporting Paragraph ─── */}
        <p className="text-secondary text-base sm:text-lg md:text-xl max-w-[720px] leading-relaxed mb-5 sm:mb-6 animate-hero-in delay-120">
          Software and website developer based in Karachi, Pakistan. Specialized in C#, ASP.NET Core, SQL Server, and Flutter with PostgreSQL. I build systems designed for data integrity—preventing race conditions, eliminating duplicate financial sequences, and delivering reliable software for production users.
        </p>

        {/* ─── Proof Badge ─── */}
        <div className="flex items-center mb-6 sm:mb-8 animate-hero-in delay-150">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-surface text-xs font-mono text-secondary">
            <span className="text-amber-500">🏆</span>
            <span className="text-foreground font-semibold">Runner-Up</span>
            <span className="text-border-strong">·</span>
            <span>Aptech Vision 2025 (Mockrithm)</span>
          </div>
        </div>

        {/* ─── Primary & Secondary CTAs + Resume ─── */}
        <div className="flex flex-wrap items-center gap-3.5 mb-8 sm:mb-12 animate-hero-in delay-180">
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

        {/* ─── Client Value & Delivery Pillars ─── */}
        <div className="border-t border-border pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-hero-in delay-240">
          <div className="p-3.5 sm:p-4 rounded-sm border border-border bg-surface flex flex-col gap-1">
            <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
              // WHAT I BUILD
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-foreground">
              Web & Mobile Apps
            </span>
            <span className="text-[11px] font-mono text-secondary">
              Modern websites, portals & mobile apps
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-sm border border-border bg-surface flex flex-col gap-1">
            <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
              // CODE QUALITY
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-foreground">
              Production-Ready
            </span>
            <span className="text-[11px] font-mono text-secondary">
              Clean architecture & secure authentication
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-sm border border-border bg-surface flex flex-col gap-1">
            <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
              // DATA SAFETY
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-500">
              High Reliability
            </span>
            <span className="text-[11px] font-mono text-secondary">
              Zero duplicate charges & zero data loss
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-sm border border-border bg-surface flex flex-col gap-1">
            <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
              // CLIENT COMMITMENT
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-foreground">
              On-Time Delivery
            </span>
            <span className="text-[11px] font-mono text-secondary">
              Fast turnaround & clear communication
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
