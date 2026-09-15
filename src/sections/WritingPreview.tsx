import { ArrowRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'

export default function WritingPreview() {
  const articles = [
    {
      title: 'Building Pragmatic Role-Based Access Control in Next.js & Prisma',
      summary:
        'A field breakdown of permission hierarchies, JWT session validation, and multi-tenant authorization guards for production applications without excessive middleware overhead.',
      tag: 'ARCHITECTURE & SECURITY',
      date: 'COMING SOON',
      readTime: '6 MIN READ',
    },
    {
      title: 'Designing Clean Relational Schemas for Multi-Party Workflow Platforms',
      summary:
        'Lessons learned balancing flexible property attribute models, foreign key integrity, and query performance in PostgreSQL under high-variance domain requirements.',
      tag: 'DATABASE DESIGN',
      date: 'COMING SOON',
      readTime: '8 MIN READ',
    },
  ]

  return (
    <section id="writing" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        <SectionHeading
          index="// 05"
          title="Writing"
          subtitle="Practical engineering essays, architectural breakdowns, and field notes from building production web products."
          meta="[ FORTHCOMING ESSAYS ]"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
          {articles.map((article) => (
            <article
              key={article.title}
              className="border border-border bg-surface rounded-sm p-6 sm:p-8 flex flex-col justify-between hover:border-border-strong transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4 text-xs font-mono text-muted">
                  <span className="text-foreground font-semibold">{article.tag}</span>
                  <div className="flex items-center gap-1.5 text-secondary">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight leading-snug mb-3">
                  {article.title}
                </h3>

                <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-6">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
                <span className="text-muted tracking-wider">{article.date}</span>
                <span className="text-xs text-secondary font-medium">EDITORIAL IN PREPARATION</span>
              </div>
            </article>
          ))}
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs font-mono text-secondary">
            TECHNICAL ESSAYS FOCUSING ON REAL ENGINEERING TRADEOFFS AND ARCHITECTURE.
          </p>
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-foreground hover:text-secondary transition-colors group"
          >
            <span>VIEW WRITING INDEX</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
