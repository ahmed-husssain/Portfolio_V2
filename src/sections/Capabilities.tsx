import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import { CAPABILITY_GROUPS } from '../data/capabilities'

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        {/* ─── Section Header ─── */}
        <SectionHeading
          index="// 02"
          title="Capabilities"
          subtitle="A clear breakdown of the core technical domains, backend frameworks, and engineering tools I use to build production software."
          meta="[ 04 DOMAINS ]"
        />

        {/* ─── 2x2 Technical Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CAPABILITY_GROUPS.map((group) => (
            <article
              key={group.index}
              className="border border-border bg-surface hover:bg-surface-hover hover:border-border-strong transition-all duration-200 rounded-sm overflow-hidden flex flex-col justify-between p-6 sm:p-8"
            >
              <div>
                {/* Domain Header */}
                <div className="flex items-center justify-between border-b border-border pb-3 mb-5 text-xs font-mono text-muted">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">#{group.index}</span>
                    <span className="text-border-strong" aria-hidden="true">|</span>
                    <span className="tracking-wider uppercase">{group.subtitle}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                  {group.title}
                </h3>

                {/* Narrative Description */}
                <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
                  {group.description}
                </p>

                {/* Key Focus Note */}
                <div className="p-3 rounded-xs border border-border bg-page/50 text-xs font-mono mb-6">
                  <span className="text-muted uppercase tracking-wider block mb-1">
                    PRIMARY FOCUS:
                  </span>
                  <span className="text-foreground font-medium">
                    {group.keyFocus}
                  </span>
                </div>
              </div>

              {/* Technologies / Disciplines Tags */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono text-muted tracking-widest uppercase mr-1">
                  ITEMS:
                </span>
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[11px] px-2.5 py-0.5 rounded-xs border border-border bg-surface-subtle text-secondary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
