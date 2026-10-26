import { useState } from 'react'
import { ArrowRight, Notebook, Calendar, Label, Sparkles } from 'pixelarticons/react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import Reveal from '../components/motion/Reveal'
import PageHeader from '../components/ui/PageHeader'
import ContinuityBridge from '../components/ui/ContinuityBridge'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getPublishedArticles, UPCOMING_ARTICLES } from '../lib/writing/writingService'

type FilterType = 'all' | 'learning' | 'opinion'

export default function Writing() {
  useDocumentTitle('Field Notes & Opinions — Syed Ahmed Hussain | Software Developer')

  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const publishedArticles = getPublishedArticles()

  const learningCount = publishedArticles.filter((a) => a.type === 'learning').length
  const opinionCount = publishedArticles.filter((a) => a.type === 'opinion').length

  const filteredArticles = publishedArticles.filter((article) => {
    if (activeFilter === 'all') return true
    return article.type === activeFilter
  })

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 md:pb-24">
      <Container>
        <PageHeader
          eyebrow={
            <>
              <span className="text-foreground font-semibold shrink-0">FIELD DISPATCHES & OPINIONS</span>
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="shrink-0">
                {publishedArticles.length < 10 ? `0${publishedArticles.length}` : publishedArticles.length} NOTES PUBLISHED
              </span>
            </>
          }
          title="Field Notes & Technical Opinions"
          description="Pragmatic learnings from production code, battle-tested system patterns, and unfiltered opinions on backend architecture and software design."
        />

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-mono rounded-2xs border transition-[transform,background-color,border-color,color] duration-150 active:scale-[0.97] cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                : 'bg-surface text-secondary border-border hover:border-border-strong hover:text-foreground'
            }`}
          >
            ALL ({publishedArticles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('learning')}
            className={`px-3 py-1.5 text-xs font-mono rounded-2xs border transition-[transform,background-color,border-color,color] duration-150 active:scale-[0.97] cursor-pointer ${
              activeFilter === 'learning'
                ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                : 'bg-surface text-secondary border-border hover:border-border-strong hover:text-foreground'
            }`}
          >
            LEARNINGS ({learningCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('opinion')}
            className={`px-3 py-1.5 text-xs font-mono rounded-2xs border transition-[transform,background-color,border-color,color] duration-150 active:scale-[0.97] cursor-pointer ${
              activeFilter === 'opinion'
                ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                : 'bg-surface text-secondary border-border hover:border-border-strong hover:text-foreground'
            }`}
          >
            OPINIONS ({opinionCount})
          </button>
        </div>

        {/* Published Articles Feed */}
        {filteredArticles.length > 0 ? (
          <div className="space-y-6 sm:space-y-8 mb-16">
            {filteredArticles.map((article, index) => {
              const isOpinion = article.type === 'opinion'
              return (
                <Reveal key={article.slug} delay={index * 50}>
                  <article
                    className="border border-border bg-surface rounded-sm p-6 sm:p-8 hover:border-border-strong [@media(hover:hover)]:hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] transition-[transform,border-color,box-shadow] duration-150 ease-out group pixel-corners"
                    style={{ boxShadow: 'var(--hairline-top)' }}
                  >
                    {/* Card Telemetry Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-micro-caps text-muted pb-3 mb-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-page border border-border text-foreground font-semibold rounded-2xs">
                          {isOpinion ? 'ENGINEERING OPINION' : 'PRODUCTION LEARNING'}
                        </span>
                        <span className="text-border-strong" aria-hidden="true">·</span>
                        <span className="font-mono text-secondary">{article.readTime || '4 MIN READ'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-secondary">
                        <Calendar className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
                        <time dateTime={article.date}>{article.date}</time>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-title-2 text-foreground mb-3">
                      <Link
                        to={`/writing/${article.slug}`}
                        className="hover:underline underline-offset-4 decoration-border transition-colors inline-flex items-center gap-2"
                      >
                        <span>{article.title}</span>
                        <ArrowRight className="w-4 h-4 pixel-icon text-muted group-hover:text-foreground opacity-60 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                      </Link>
                    </h2>

                    {/* Core Takeaway / Verdict Box */}
                    {article.takeaway && (
                      <div className="my-4 p-4 bg-page border-l-2 border-foreground rounded-r-xs text-xs sm:text-sm font-mono text-foreground leading-relaxed">
                        <div className="text-micro-caps text-muted font-semibold mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-foreground pixel-icon" aria-hidden="true" />
                          <span>CORE TAKEAWAY / VERDICT</span>
                        </div>
                        <p className="text-foreground/90 font-medium">
                          "{article.takeaway}"
                        </p>
                      </div>
                    )}

                    {/* Summary Description */}
                    <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6 font-normal">
                      {article.description}
                    </p>

                    {/* Footer Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                      <div className="flex flex-wrap items-center gap-2">
                        <Label className="w-3.5 h-3.5 text-muted mr-1 pixel-icon" aria-hidden="true" />
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-micro-caps bg-page border border-border text-secondary rounded-2xs font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/writing/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-micro-caps font-semibold text-foreground hover:underline transition-colors"
                      >
                        <span>READ NOTE</span>
                        <ArrowRight className="w-3.5 h-3.5 pixel-icon" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        ) : (
          /* Empty Filter State */
          <div className="border border-border bg-surface rounded-sm p-8 text-center mb-16 pixel-corners">
            <p className="text-secondary text-sm sm:text-base mb-4 font-mono">
              No notes published under this category yet.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="px-4 py-2 bg-page border border-border text-xs font-mono text-foreground rounded-2xs hover:border-border-strong cursor-pointer"
            >
              SHOW ALL NOTES
            </button>
          </div>
        )}

        {/* On The Workbench (Upcoming Notes & Drafts) */}
        <Reveal delay={100} className="mb-16">
          <section className="border border-border bg-surface rounded-sm p-6 sm:p-8 pixel-corners">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-border">
              <div className="flex items-center gap-2 text-micro-caps text-muted">
                <Notebook className="w-4 h-4 text-foreground pixel-icon" aria-hidden="true" />
                <span className="text-foreground font-semibold">ON THE WORKBENCH</span>
                <span className="text-border-strong" aria-hidden="true">·</span>
                <span>UPCOMING NOTES & DRAFTS</span>
              </div>
              <span className="text-micro-caps text-secondary font-mono">IN ACTIVE DRAFTING</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {UPCOMING_ARTICLES.map((upcoming) => {
                const isOpinion = upcoming.type === 'opinion'
                return (
                  <div
                    key={upcoming.title}
                    className="p-4 sm:p-5 bg-page border border-border rounded-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-micro-caps text-muted mb-2">
                        <span className="px-1.5 py-0.5 bg-surface border border-border text-foreground font-semibold rounded-2xs">
                          {isOpinion ? 'OPINION' : 'LEARNING'}
                        </span>
                        <span className="text-secondary font-mono">{upcoming.status}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 leading-snug">
                        {upcoming.title}
                      </h3>
                      <p className="text-secondary text-xs leading-relaxed mb-4">
                        {upcoming.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                      {upcoming.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-muted px-1.5 py-0.5 bg-surface border border-border rounded-2xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </Reveal>

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
