import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'

export default function About() {
  const metadata = [
    { label: 'LOCATION', value: 'Karachi, Pakistan (PKT / UTC+5)' },
    { label: 'DISCIPLINE', value: 'Backend & Web Development (.NET)' },
    { label: 'CORE STACK', value: 'C#, ASP.NET Core, SQL Server, MySQL, React' },
    { label: 'KEY AWARD', value: 'Runner-Up – Aptech Vision 2025 (Mockrithm)' },
  ]

  const principles = [
    {
      index: '01',
      title: 'CLEAN ARCHITECTURE',
      detail:
        'Keeping controllers lean, business logic modular, and data access cleanly separated.',
    },
    {
      index: '02',
      title: 'DATA INTEGRITY',
      detail:
        'Structuring relational database schemas and indexing carefully for fast, reliable queries.',
    },
    {
      index: '03',
      title: 'SECURE AUTHENTICATION',
      detail:
        'Enforcing OAuth 2.0 multi-provider authentication and role-based access control (RBAC).',
    },
    {
      index: '04',
      title: 'PRAGMATIC CODE',
      detail:
        'Writing straightforward, maintainable code with robust error handling instead of needless complexity.',
    },
  ]

  return (
    <section id="about" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        {/* ─── Section Header ─── */}
        <SectionHeading
          index="// 03"
          title="About"
          subtitle="A grounded overview of my background, technical focus, and development principles."
          meta="[ BACKGROUND & FOCUS ]"
        />

        {/* ─── Editorial Two-Column Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ─── Left Column: Personal Statement & Narrative ─── */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Lead Headline Statement */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-snug mb-6">
                I am a backend-focused .NET developer building scalable web applications and reliable APIs.
              </h3>

              {/* Narrative Paragraphs */}
              <div className="space-y-4 text-secondary text-sm sm:text-base leading-relaxed mb-8">
                <p>
                  I build web applications with C#, ASP.NET Core MVC, Web API, Entity Framework Core, and SQL Server. I focus on clean architecture, relational database design, and secure authentication workflows like OAuth 2.0.
                </p>
                <p>
                  When engineering software, I care about how data flows through the system, how queries perform under load, and how endpoints handle edge cases gracefully. My goal is always to deliver software that is reliable, easy to maintain, and fast.
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
