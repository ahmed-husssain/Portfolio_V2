import { ArrowRight, BookOpen, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import { getPublishedArticles, getWritingTopics } from '../lib/writing/writingService'

export default function WritingPreview() {
  const publishedArticles = getPublishedArticles()
  const topics = getWritingTopics()

  return (
    <section id="writing" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        <SectionHeading
          index="// 05"
          title="Writing"
          subtitle="Practical engineering essays, architectural breakdowns, and field notes from building production web products."
          meta={
            publishedArticles.length > 0
              ? `[ ${publishedArticles.length < 10 ? `0${publishedArticles.length}` : publishedArticles.length} PUBLISHED ]`
              : '[ FORTHCOMING ESSAYS ]'
          }
        />

        {publishedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
            {publishedArticles.slice(0, 2).map((article) => (
              <article
                key={article.slug}
                className="border border-border bg-surface rounded-sm p-6 sm:p-8 flex flex-col justify-between hover:border-border-strong transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-4 text-xs font-mono text-muted">
                    <span className="text-foreground font-semibold">TECHNICAL ESSAY</span>
                    <div className="flex items-center gap-1.5 text-secondary">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      <time dateTime={article.date}>{article.date}</time>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight leading-snug mb-3">
                    <Link
                      to={`/writing/${article.slug}`}
                      className="hover:text-secondary transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-6">
                    {article.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[11px] font-mono bg-page border border-border text-secondary rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/writing/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-foreground hover:text-secondary transition-colors group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>READ</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 mb-10">
            <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-4 pb-3 border-b border-border">
              <BookOpen className="w-3.5 h-3.5 text-foreground" />
              <span className="text-foreground font-semibold">// EDITORIAL PIPELINE</span>
              <span>·</span>
              <span>HONEST PUBLICATION POLICY</span>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight mb-2">
              Notes on backend engineering, system design, performance, and the web.
            </h3>

            <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-6 max-w-2xl">
              Articles will appear here as I publish them. Essays are published strictly when supported by production findings, reproducible benchmarks, and verifiable code.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
              <span className="text-[11px] font-mono text-muted uppercase tracking-wider mr-1">
                TOPICS IN PIPELINE:
              </span>
              {topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 text-xs font-mono bg-page border border-border text-secondary rounded-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs font-mono text-secondary">
            TECHNICAL WRITING GROUNDED IN REAL ENGINEERING TRADEOFFS.
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
