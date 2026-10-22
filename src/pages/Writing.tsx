import { ArrowRight, Notebook, Calendar, Label, Shield } from 'pixelarticons/react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import Reveal from '../components/motion/Reveal'
import PageHeader from '../components/ui/PageHeader'
import ContinuityBridge from '../components/ui/ContinuityBridge'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getPublishedArticles, getWritingTopics } from '../lib/writing/writingService'

export default function Writing() {
  useDocumentTitle('Technical Essays — Syed Ahmed Hussain | Software Developer in Karachi')

  const publishedArticles = getPublishedArticles()
  const topics = getWritingTopics()

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 md:pb-24">
      <Container>
        <PageHeader
          eyebrow={
            <>
              <span className="text-foreground font-semibold shrink-0">TECHNICAL ESSAYS & FIELD NOTES</span>
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="shrink-0">
                {publishedArticles.length < 10 ? `0${publishedArticles.length}` : publishedArticles.length} ESSAYS PUBLISHED
              </span>
            </>
          }
          title="Technical Essays & Field Notes"
          description="Articles and engineering notes on backend development, C#, database handling, and lessons learned while building real-world projects."
        />

        {/* Content Section: Either Published Articles OR Honest Editorial State */}
        {publishedArticles.length > 0 ? (
          <div className="space-y-6 sm:space-y-8 mb-16">
            {publishedArticles.map((article, index) => (
              <Reveal key={article.slug} delay={index * 50}>
                <article
                  className="border border-border bg-surface rounded-sm p-6 sm:p-8 hover:border-border-strong hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.995] transition-[transform,border-color,box-shadow] duration-200 ease-out group pixel-corners"
                  style={{ boxShadow: 'var(--hairline-top)' }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-micro-caps text-muted pb-3 mb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold">TECHNICAL ESSAY</span>
                      <span className="text-border-strong" aria-hidden="true">·</span>
                      <span>VERIFIED</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary">
                      <Calendar className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
                      <time dateTime={article.date}>{article.date}</time>
                    </div>
                  </div>

                  <h2 className="text-title-2 text-foreground mb-3">
                    <Link
                      to={`/writing/${article.slug}`}
                      className="hover:underline underline-offset-4 decoration-border transition-colors inline-flex items-center gap-2"
                    >
                      <span>{article.title}</span>
                      <ArrowRight className="w-4 h-4 pixel-icon opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                    </Link>
                  </h2>

                  <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    {article.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                    <div className="flex flex-wrap items-center gap-2">
                      <Label className="w-3.5 h-3.5 text-muted mr-1 pixel-icon" aria-hidden="true" />
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
                      <ArrowRight className="w-3.5 h-3.5 pixel-icon" />
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
              className="border border-border bg-surface rounded-sm p-8 sm:p-12 pixel-corners"
              style={{ boxShadow: 'var(--hairline-top)' }}
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-micro-caps text-muted mb-4">
                  <Notebook className="w-4 h-4 text-foreground pixel-icon" aria-hidden="true" />
                  <span className="text-foreground font-semibold">PUBLICATION PIPELINE</span>
                </div>

                <h2 className="text-title-2 text-foreground mb-4">
                  Articles appear here as I document production solutions.
                </h2>

                <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  I write about production problems I have personally solved: backend APIs, relational database schemas, auth patterns, and full-stack performance tradeoffs. Every article is paired with working code, verifiable benchmarks, and real production considerations.
                </p>

                <div className="flex items-start gap-3 p-4 bg-page border border-border rounded-xs text-xs font-mono text-secondary mb-8 pixel-corners">
                  <Shield className="w-4 h-4 text-foreground shrink-0 mt-0.5 pixel-icon" aria-hidden="true" />
                  <span className="leading-relaxed">
                    HONEST PUBLICATION POLICY · No synthetic reading times, fabricated publication dates, or placeholder articles. Pieces are published only when fully tested and ready for production scrutiny.
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

        {/* Forward Continuity Bridge to Contact */}
        <ContinuityBridge
          kicker="INITIATE CONTACT"
          title="Let's Build Something Useful Together"
          description="Open for software engineering roles, contracts, and backend architectural discussions. Directly accessible by email or inquiry form."
          to="/contact"
          actionLabel="GET IN TOUCH"
          className="mt-14 sm:mt-20"
        />
      </Container>
    </div>
  )
}
