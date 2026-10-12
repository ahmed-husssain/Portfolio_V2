import { ArrowRight, ExternalLink, FileText } from 'pixelarticons/react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'

export default function AboutPreview() {
  const highlights = [
    { label: 'LOCATION', value: 'Karachi, Pakistan (PKT / UTC+5)' },
    { label: 'SPECIALIZATION', value: 'Full-Stack & .NET Web Development' },
    { label: 'KEY AWARD', value: 'Runner-Up – Aptech Vision 2025 (Mockrithm)' },
    { label: 'RESUME / CV', value: 'Official Resume (PDF)', href: '/resume.pdf' },
    { label: 'STATUS', value: 'Available for Engineering Roles & Projects' },
  ]

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 border-b border-border">
      <Container>
        <SectionHeading
          index="// 03"
          title="About"
          subtitle="Engineering background, technical mindset, and development philosophy."
          meta="[ PERSPECTIVE & FOCUS ]"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-snug mb-6">
              I am a full-stack .NET and web developer building responsive web applications and reliable APIs.
            </h3>

            <div className="space-y-4 text-secondary text-sm sm:text-base leading-relaxed mb-8">
              <p>
                I build web applications using C#, ASP.NET Core MVC, Web API, Entity Framework Core, and SQL Server. I focus on clean code, relational database design, and secure authentication workflows like OAuth 2.0.
              </p>
              <p>
                Whether building real-time auction features or optimizing database queries, I prioritize practical, maintainable solutions that deliver real value.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-foreground hover:text-secondary transition-colors group"
              >
                <span>READ FULL ABOUT & PRINCIPLES</span>
                <ArrowRight className="w-4 h-4 pixel-icon transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-xs border border-border bg-surface text-secondary hover:text-foreground hover:border-border-strong active:scale-95 transition-all"
              >
                <FileText className="w-3.5 h-3.5 pixel-icon text-emerald-500" />
                <span>RESUME (PDF)</span>
                <ExternalLink className="w-3 h-3 pixel-icon text-muted" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-border bg-surface rounded-sm p-6 pixel-corners">
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-border text-xs font-mono text-muted">
                <span className="pixel-beacon" aria-hidden="true" />
                <span className="text-foreground font-semibold">// PROFILE SNAPSHOT</span>
              </div>

              <dl className="space-y-4 text-xs font-mono">
                {highlights.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1 pb-3 border-b border-border/60 last:border-0 last:pb-0">
                    <dt className="text-muted tracking-wider uppercase text-[10px]">
                      {item.label}
                    </dt>
                    <dd className="text-foreground font-medium text-xs sm:text-sm">
                      {'href' in item && item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5 pixel-icon" />
                          <span>{item.value}</span>
                          <ExternalLink className="w-3 h-3 pixel-icon text-muted" />
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
