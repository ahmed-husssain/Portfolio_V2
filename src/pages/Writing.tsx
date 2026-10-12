import { ArrowRight, BookOpen, Calendar, Tag, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { getPublishedArticles, getWritingTopics } from '../lib/writing/writingService'

export default function Writing() {
  useDocumentTitle('Technical Essays — Syed Ahmed Hussain | Software Developer in Karachi')

  const publishedArticles = getPublishedArticles()
  const topics = getWritingTopics()

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 md:pb-24">
      <Container>
        {/* ─── Page Header (Apple Optical Hierarchy) ─── */}
        <header className="mb-10 sm:mb-14 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-micro-caps text-muted mb-4">
            <span className="text-foreground font-semibold shrink-0">// TECHNICAL ESSAYS & FIELD NOTES</span>
            <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
            <span className="shrink-0">
              [ {publishedArticles.length < 10 ? `0${publishedArticles.length}` : publishedArticles.length} ESSAYS PUBLISHED ]
            </span>
          </div>

          <h1 className="text-title-1 text-foreground mb-4 sm:mb-5">
            Technical Essays & Field Notes
          </h1>

          <p className="text-body-lead text-secondary max-w-3xl font-normal">
            Articles and engineering notes on backend development, C#, database handling, and lessons learned while building real-world projects.
          </p>
        </header>

        {/* Content Section: Either Published Articles OR Honest Editorial State */}
        {publishedArticles.length > 0 ? (
          <div className="space-y-6 sm:space-y-8 mb-16">
            {publishedArticles.map((article, index) => (
              <Reveal key={article.slug} delay={index * 50}>
                <article
                  className="border border-border bg-surface rounded-sm p-6 sm:p-8 hover:border-border-strong hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.995] transition-[transform,border-color,box-shadow] duration-200 ease-out group"
                  style={{ boxShadow: 'var(--hairline-top)' }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-micro-caps text-muted pb-3 mb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold">TECHNICAL ESSAY</span>
                      <span className="text-border-strong" aria-hidden="true">·</span>
                      <span>VERIFIED</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <time dateTime={article.date}>{article.date}</time>
                    </div>
                  </div>

                  <h2 className="text-title-2 text-foreground mb-3">
                    <Link
                      to={`/writing/${article.slug}`}
                      className="hover:underline underline-offset-4 decoration-border transition-colors inline-flex items-center gap-2"
                    >
                      <span>{article.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                    </Link>
                  </h2>

                  <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    {article.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag className="w-3 h-3 text-muted mr-1" aria-hidden="true" />
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-micro-caps bg-page border border-border text-secondary rounded-2xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/writing/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-micro-caps font-semibold text-foreground hover:underline transition-colors"
                    >
                      <span>READ ESSAY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          /* Honest Editorial Empty State */
          <Reveal className="space-y-8 mb-16">
            <div 
              className="border border-border bg-surface rounded-sm p-8 sm:p-12"
              style={{ boxShadow: 'var(--hairline-top)' }}
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-micro-caps text-muted mb-4">
                  <BookOpen className="w-4 h-4 text-foreground" aria-hidden="true" />
                  <span className="text-foreground font-semibold">// PUBLICATION PIPELINE</span>
                </div>

                <h2 className="text-title-2 text-foreground mb-4">
                  Articles appear here as I document production solutions.
                </h2>

                <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  I write about production problems I have personally solved: backend APIs, relational database schemas, auth patterns, and full-stack performance tradeoffs. Every article is paired with working code, verifiable benchmarks, and real production considerations.
                </p>

                <div className="flex items-start gap-3 p-4 bg-page border border-border rounded-xs text-xs font-mono text-secondary mb-8">
                  <ShieldCheck className="w-4 h-4 text-foreground shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-relaxed">
                    HONEST PUBLICATION POLICY // No synthetic reading times, fabricated publication dates, or placeholder articles. Pieces are published only when fully tested and ready for production scrutiny.
                  </span>
                </div>

                <div>
                  <p className="text-micro-caps text-muted mb-3">
                    AREAS OF CURRENT EDITORIAL FOCUS:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2.5 py-1 text-micro-caps bg-page border border-border text-secondary rounded-2xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Bottom Contact Prompt */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-micro-caps text-secondary">
            HAVE A QUESTION ABOUT THESE ARTICLES OR CODE EXAMPLES?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-micro-caps font-semibold text-foreground hover:underline transition-colors group"
          >
            <span>SUGGEST A TOPIC / GET IN TOUCH</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </div>
  )
}
