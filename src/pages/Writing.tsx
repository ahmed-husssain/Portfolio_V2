import { useState, useEffect } from 'react'
import { ArrowRight, Calendar, Tag, ExternalLink, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { getPublishedArticles, getWritingTopics, ACTIVITY_PULSE, fetchRemoteDevToArticles } from '../lib/writing/writingService'
import type { ArticleMetadata } from '../lib/writing/writingService'

function GithubIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export default function Writing() {
  useDocumentTitle('Technical Essays & Interactive Systems — Syed Ahmed Hussain')

  const localArticles = getPublishedArticles()
  const topics = getWritingTopics()
  const [allArticles, setAllArticles] = useState<ArticleMetadata[]>(localArticles)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Fetch optional remote articles (Dev.to / headless feed) if configured
  useEffect(() => {
    fetchRemoteDevToArticles().then((remote) => {
      if (remote.length > 0) {
        // Merge without duplicating existing slugs
        setAllArticles((prev) => {
          const existingSlugs = new Set(prev.map((a) => a.slug))
          const fresh = remote.filter((r) => !existingSlugs.has(r.slug))
          return [...prev, ...fresh]
        })
      }
    })
  }, [])

  const filteredArticles = selectedTag
    ? allArticles.filter((a) => a.tags?.includes(selectedTag))
    : allArticles

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
      <Container>
        {/* Page Header */}
        <header className="mb-8 sm:mb-12 pb-6 border-b border-border">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] sm:text-xs font-mono text-muted uppercase tracking-wider mb-4">
            <span className="text-foreground font-semibold shrink-0">// TECHNICAL ESSAYS & INTERACTIVE BENCHMARKS</span>
            <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
            <span className="shrink-0">
              [ {allArticles.length < 10 ? `0${allArticles.length}` : allArticles.length} ESSAYS PUBLISHED ]
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-5">
            Technical Essays & Field Breakdowns
          </h1>

          <p className="text-secondary text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
            In-depth engineering notes on distributed systems, concurrency, PostgreSQL invariants, and high-load web architectures. Each essay is paired with an interactive visual simulation demonstrating the real failure mode.
          </p>
        </header>

        {/* ─── Engineering Activity Radar & Multi-Platform Hub ─── */}
        <div className="mb-12 border border-border bg-surface rounded-sm p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-mono font-semibold text-foreground tracking-wider uppercase">
                  ENGINEERING ACTIVITY RADAR
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-2xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  LIVE STATUS: ONLINE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-secondary font-mono">
                {ACTIVITY_PULSE.status}
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={ACTIVITY_PULSE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-page border border-border text-xs font-mono text-foreground hover:border-border-strong rounded-xs transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GITHUB COMMITS</span>
              </a>

              <a
                href={ACTIVITY_PULSE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] dark:text-[#70B5F9] text-xs font-mono font-medium rounded-xs hover:bg-[#0A66C2]/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>LINKEDIN PROFILE</span>
              </a>
            </div>
          </div>

          {/* Active Production Repositories Strip */}
          <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-muted mr-1">ACTIVE REPOSITORIES:</span>
            {ACTIVITY_PULSE.activeSystems.map((sys) => (
              <a
                key={sys.name}
                href={sys.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-subtle border border-border text-secondary hover:text-foreground hover:border-border-strong rounded-xs transition-colors"
              >
                <span className="font-semibold text-foreground">{sys.name}</span>
                <span className="text-muted">({sys.tag})</span>
              </a>
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-muted mr-2">FILTER BY TOPIC:</span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 text-xs font-mono rounded-xs border transition-colors ${
              selectedTag === null
                ? 'border-foreground bg-foreground text-page font-semibold'
                : 'border-border bg-surface text-secondary hover:text-foreground'
            }`}
          >
            All Essays ({allArticles.length})
          </button>
          {topics.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 text-xs font-mono rounded-xs border transition-colors ${
                selectedTag === tag
                  ? 'border-foreground bg-foreground text-page font-semibold'
                  : 'border-border bg-surface text-secondary hover:text-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Content Section: Published Articles */}
        {filteredArticles.length > 0 ? (
          <div className="space-y-6 sm:space-y-8 mb-16">
            {filteredArticles.map((article, index) => (
              <Reveal key={article.slug} delay={index * 50}>
                <article
                  className="border border-border bg-surface rounded-sm p-6 sm:p-8 hover:border-border-strong hover:shadow-xs transition-all duration-200 group relative"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted pb-3 mb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold">TECHNICAL ESSAY</span>
                      <span>·</span>
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> INTERACTIVE SIMULATOR INCLUDED
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <time dateTime={article.date}>{article.date}</time>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                    <Link
                      to={article.isExternal && article.externalUrl ? article.externalUrl : `/writing/${article.slug}`}
                      className="hover:text-secondary transition-colors inline-flex items-center gap-2"
                    >
                      <span>{article.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                    </Link>
                  </h2>

                  <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
                    {article.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag className="w-3 h-3 text-muted mr-1" aria-hidden="true" />
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-mono bg-page border border-border text-secondary rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/writing/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground hover:text-secondary transition-colors"
                    >
                      <span>LAUNCH INTERACTIVE ESSAY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="border border-border bg-surface rounded-sm p-8 text-center text-xs font-mono text-secondary">
            No published essays matching the selected topic filter.
          </div>
        )}

        {/* Bottom Contact Prompt */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs font-mono text-secondary">
            HAVE A SPECIFIC SYSTEM TOPIC OR ARCHITECTURAL QUESTION?
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
