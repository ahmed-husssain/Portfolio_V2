import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Tag, MessageSquare, BookOpen, Share2, ExternalLink, Sparkles } from 'lucide-react'
import Container from '../components/Container'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { getArticleBySlug, getNextArticle } from '../lib/writing/writingService'
import { CONTACT_CONFIG } from '../data/contact'
import BiddingConcurrencyVisualizer from '../components/writing/BiddingConcurrencyVisualizer'
import MedicalBillingVisualizer from '../components/writing/MedicalBillingVisualizer'

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

// Dynamic component loaders isolated to this route-level chunk
const articleLoaders = import.meta.glob<{ default: React.ComponentType<{ components?: any }> }>(
  '../content/writing/*.mdx'
)

// Precision Variant C typography components for MDX rendering
const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mt-10 mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mt-10 mb-4 pb-2 border-b border-border" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mt-8 mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-outside ml-5 space-y-2 mb-6 text-secondary text-sm sm:text-base" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-outside ml-5 space-y-2 mb-6 text-secondary text-sm sm:text-base" {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed pl-1" {...props} />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-foreground/50 bg-surface/40 pl-4 py-2 my-6 text-secondary italic text-sm sm:text-base rounded-r-sm" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-surface border border-border rounded-sm p-4 sm:p-5 overflow-x-auto my-6 font-mono text-xs sm:text-sm text-foreground leading-relaxed" {...props} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="font-mono text-xs bg-surface border border-border px-1.5 py-0.5 rounded-sm text-foreground" {...props} />
      )
    }
    return <code className={className} {...props} />
  },
  hr: () => <hr className="my-10 border-border" />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-foreground underline decoration-border hover:decoration-foreground underline-offset-4 transition-colors" {...props} />
  ),
  // Custom Interactive Visualizer Components for Engineering Demonstrations
  BiddingConcurrencyVisualizer,
  MedicalBillingVisualizer,
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined
  const nextArticle = slug ? getNextArticle(slug) : null

  useDocumentTitle(
    article
      ? `${article.title} — Syed Ahmed Hussain`
      : 'Article Not Found — Syed Ahmed Hussain'
  )

  const [MdxContent, setMdxContent] = useState<React.ComponentType<{ components?: any }> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug || !article) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const matchingEntry = Object.entries(articleLoaders).find(([filePath]) =>
      filePath.endsWith(`/${slug}.mdx`)
    )
    const loader = matchingEntry ? matchingEntry[1] : null
    if (!loader) {
      setLoading(false)
      return
    }

    loader()
      .then((mod) => {
        setMdxContent(() => mod.default)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load article component:', err)
        setError('Failed to load article content.')
        setLoading(false)
      })
  }, [slug, article])

  // If article not found or unpublished
  if (!article) {
    return (
      <div className="py-20 sm:py-32">
        <Container>
          <div className="max-w-2xl mx-auto border border-border bg-surface rounded-sm p-8 sm:p-12 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-4">
              <BookOpen className="w-4 h-4 text-muted" />
              <span>// ARTICLE NOT FOUND</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-4">
              Article Not Available
            </h1>
            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
              This essay either does not exist or has not yet been published to the production index.
            </p>
            <Link
              to="/writing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-xs font-mono font-semibold uppercase tracking-wider rounded-sm hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO WRITING INDEX</span>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const articleUrl = typeof window !== 'undefined' ? window.location.href : `https://ahmedhussain.me/writing/${article.slug}`
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`

  return (
    <article className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Top Breadcrumb Navigation */}
          <nav className="mb-10 sm:mb-14 flex items-center justify-between gap-4 text-xs font-mono">
            <Link
              to="/writing"
              className="inline-flex items-center gap-1.5 text-muted hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>BACK TO WRITING</span>
            </Link>
            <span className="text-muted hidden sm:inline-block tracking-wider uppercase">
              // WRITING / {article.slug}
            </span>
          </nav>

          {/* Article Header */}
          <header className="mb-12 sm:mb-16 pb-8 border-b border-border">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted mb-4">
              <div className="flex items-center gap-1.5 text-secondary">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <time dateTime={article.date}>{article.date}</time>
              </div>
              <span>·</span>
              <span className="text-foreground font-semibold uppercase tracking-wider">
                BY AHMED HUSSAIN
              </span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded-2xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                INTERACTIVE DEMONSTRATION
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            <p className="text-secondary text-base sm:text-lg leading-relaxed mb-6 font-normal">
              {article.description}
            </p>

            {/* Tags Strip + Share on LinkedIn */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-muted mr-1" aria-hidden="true" />
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-mono bg-page border border-border text-secondary rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-border text-xs font-mono text-secondary hover:text-foreground hover:border-border-strong rounded-xs transition-colors"
                title="Share this breakdown on LinkedIn"
              >
                <Share2 className="w-3 h-3 text-blue-500" />
                <span>SHARE ON LINKEDIN</span>
              </a>
            </div>
          </header>

          {/* Article Body Content */}
          <div className="min-h-[200px]">
            {loading && (
              <div className="py-16 text-center">
                <div className="inline-block w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs font-mono text-muted uppercase tracking-wider">
                  LOADING ESSAY & INTERACTIVE WIDGETS...
                </p>
              </div>
            )}

            {error && (
              <div className="border border-border bg-surface rounded-sm p-6 text-center text-xs font-mono text-secondary">
                {error}
              </div>
            )}

            {!loading && !error && MdxContent && (
              <div className="prose-monochrome">
                <MdxContent components={mdxComponents} />
              </div>
            )}
          </div>

          {/* Engineering Artifacts & Social Activity Card */}
          <div className="mt-16 sm:mt-20 border border-border bg-surface rounded-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border">
              <div>
                <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> AUTHOR & PRODUCTION SYSTEMS
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Syed Ahmed Hussain
                </h3>
                <p className="text-xs sm:text-sm text-secondary mt-1 max-w-md">
                  Backend-focused software developer building clinical platforms and high-concurrency e-commerce systems with .NET 8, Flutter, and PostgreSQL.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={CONTACT_CONFIG.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] dark:text-[#70B5F9] text-xs font-mono font-medium rounded-xs hover:bg-[#0A66C2]/20 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>CONNECT ON LINKEDIN</span>
                </a>
                <a
                  href={CONTACT_CONFIG.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-page border border-border text-foreground text-xs font-mono font-medium rounded-xs hover:border-border-strong transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GITHUB PROFILE</span>
                </a>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <span className="text-muted">HAVE A QUESTION ABOUT THIS IMPLEMENTATION?</span>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-secondary transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>DISCUSS ARCHITECTURE & INQUIRIES</span>
              </Link>
            </div>
          </div>

          {/* Next Article / Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Link
              to="/writing"
              className="inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ALL TECHNICAL WRITING</span>
            </Link>

            {nextArticle ? (
              <Link
                to={`/writing/${nextArticle.slug}`}
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-foreground hover:text-secondary transition-colors group text-right"
              >
                <span>NEXT: {nextArticle.title}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                to="/work"
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-foreground hover:text-secondary transition-colors group text-right"
              >
                <span>EXPLORE SELECTED WORK</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </article>
  )
}
