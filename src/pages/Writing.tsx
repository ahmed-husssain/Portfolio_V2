import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Writing() {
  useDocumentTitle('Writing — Ahmed | Full-Stack Web Developer')

  const articles = [
    {
      title: 'Building Pragmatic Role-Based Access Control in Next.js & Prisma',
      summary:
        'A field breakdown of permission hierarchies, JWT session validation, and multi-tenant authorization guards for production applications without excessive middleware overhead.',
      tag: 'ARCHITECTURE & SECURITY',
      status: 'IN DRAFT',
      readTime: '6 MIN READ',
      topics: ['Next.js App Router', 'Prisma ORM', 'JWT Authentication', 'PostgreSQL Row Guards'],
    },
    {
      title: 'Designing Clean Relational Schemas for Multi-Party Workflow Platforms',
      summary:
        'Lessons learned balancing flexible property attribute models, foreign key integrity, and query performance in PostgreSQL under high-variance domain requirements.',
      tag: 'DATABASE MODELING',
      status: 'IN DRAFT',
      readTime: '8 MIN READ',
      topics: ['Schema Normalization', 'Prisma Migrations', 'Indexing Strategy', 'Relational Constraints'],
    },
    {
      title: 'Eliminating Unnecessary Client State in Modern Full-Stack React Apps',
      summary:
        'Why distinguishing server cache, URL search params, and ephemeral component state usually makes monolithic client stores like Redux obsolete in modern web development.',
      tag: 'FRONTEND ARCHITECTURE',
      status: 'OUTLINING',
      readTime: '5 MIN READ',
      topics: ['Server State', 'React Composition', 'URL State Management', 'Performance Optimization'],
    },
  ]

  return (
    <div className="py-16 sm:py-24 md:py-32">
      <Container>
        {/* Page Header */}
        <header className="mb-14 sm:mb-20 pb-8 border-b border-border">
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-3">
            <span className="text-foreground font-semibold">// WRITING & FIELD NOTES</span>
            <span>·</span>
            <span>[ 03 ESSAYS SCHEDULED ]</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-5">
            Technical Essays & Field Notes
          </h1>

          <p className="text-secondary text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
            Practical reflections, architectural breakdowns, and field notes from building real-world web applications. Focuses on pragmatic tradeoffs, relational database patterns, and maintainable full-stack systems.
          </p>
        </header>

        {/* Editorial Status Box */}
        <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-muted pb-3 mb-4 border-b border-border">
            <BookOpen className="w-4 h-4 text-foreground" aria-hidden="true" />
            <span className="text-foreground font-semibold uppercase">// PUBLICATION PIPELINE</span>
          </div>
          <p className="text-secondary text-xs sm:text-sm leading-relaxed max-w-3xl">
            Essays are currently undergoing editorial drafting and technical review. Each piece will include accompanied GitHub repository links and verifiable code samples demonstrating real architectural patterns.
          </p>
        </div>

        {/* Articles List */}
        <div className="space-y-6 sm:space-y-8 mb-16">
          {articles.map((article) => (
            <article
              key={article.title}
              className="border border-border bg-surface rounded-sm p-6 sm:p-8 hover:border-border-strong transition-all duration-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted pb-3 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">{article.tag}</span>
                  <span>·</span>
                  <span>{article.status}</span>
                </div>
                <div className="flex items-center gap-1.5 text-secondary">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground tracking-tight mb-3">
                {article.title}
              </h2>

              <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
                {article.summary}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border/80">
                <span className="text-[10px] font-mono text-muted uppercase tracking-wider mr-1">TOPICS:</span>
                {article.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 text-xs font-mono bg-page border border-border text-secondary rounded-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Contact Prompt */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs font-mono text-secondary">
            HAVE A SPECIFIC SYSTEM TOPIC YOU WOULD LIKE COVERED?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-foreground hover:text-secondary transition-colors group"
          >
            <span>SUGGEST A TOPIC / GET IN TOUCH</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </div>
  )
}
