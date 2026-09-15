import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'

export default function About() {
  const metadata = [
    { label: 'LOCATION', value: 'Karachi, Pakistan (PKT / UTC+5)' },
    { label: 'DISCIPLINE', value: 'Full-Stack Web & API Development' },
    { label: 'CORE INTERESTS', value: 'Backend Systems · Database Design · Performance' },
    { label: 'AVAILABILITY', value: 'Available for Select Web & Product Projects' },
  ]

  const principles = [
    {
      index: '01',
      title: 'SYSTEM-FIRST THINKING',
      detail:
        'Prioritizing data integrity, schema consistency, and reliable API contracts before building client interfaces.',
    },
    {
      index: '02',
      title: 'PRAGMATIC TOOLING',
      detail:
        'Selecting proven, dependable tools (Next.js, Node, SQL, TypeScript) that solve actual project requirements without unnecessary bloat.',
    },
    {
      index: '03',
      title: 'MAINTAINABLE CODE',
      detail:
        'Writing readable, type-safe code with clear boundaries that teammates can easily audit, debug, and extend.',
    },
    {
      index: '04',
      title: 'PERFORMANCE AWARENESS',
      detail:
        'Keeping client payloads minimal, optimizing query execution paths, and eliminating decorative runtime overhead.',
    },
  ]

  return (
    <section id="about" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        {/* ─── Section Header ─── */}
        <SectionHeading
          index="// 03"
          title="About"
          subtitle="A grounded overview of my background, engineering philosophy, and how I approach building digital products."
          meta="[ BACKGROUND & FOCUS ]"
        />

        {/* ─── Editorial Two-Column Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ─── Left Column: Personal Statement & Narrative ─── */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Lead Headline Statement */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-snug mb-6">
                I build practical web applications across the stack, focusing on what happens under the hood as much as what appears on the screen.
              </h3>

              {/* Narrative Paragraphs */}
              <div className="space-y-4 text-secondary text-sm sm:text-base leading-relaxed mb-8">
                <p>
                  My day-to-day work spans the complete application lifecycle—from architecting typed component interfaces in Next.js and React to structuring relational schemas in PostgreSQL and implementing secure server-side logic in Node or PHP.
                </p>
                <p>
                  When building a feature or system, I focus on the architectural fundamentals: how data flows between client and server, how authentication and role-based permissions are enforced, and how maintainable the codebase will remain over time. I value clean code, fast page loads, and simplicity over speculative complexity.
                </p>
              </div>
            </div>

            {/* Technical Metadata Spec Card */}
            <div className="border border-border bg-surface rounded-sm p-5 sm:p-6">
              <div className="text-[11px] font-mono text-muted tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                <span>DEVELOPER PROFILE METADATA</span>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                {metadata.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <dt className="text-muted tracking-wider uppercase text-[10px]">
                      {item.label}
                    </dt>
                    <dd className="text-foreground font-medium">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* ─── Right Column: Core Engineering Principles ─── */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-6 text-xs font-mono text-muted">
                <span className="text-foreground font-semibold">// HOW I WORK</span>
                <span className="tracking-wider uppercase">CORE PRINCIPLES</span>
              </div>

              <div className="space-y-6">
                {principles.map((p) => (
                  <div key={p.index} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-muted">#{p.index}</span>
                      <span className="text-foreground font-semibold tracking-wider">
                        {p.title}
                      </span>
                    </div>
                    <p className="text-secondary text-xs sm:text-sm leading-relaxed pl-6 border-l border-border/80">
                      {p.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
