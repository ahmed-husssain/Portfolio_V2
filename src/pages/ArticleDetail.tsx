import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Tag, MessageSquare, BookOpen } from 'lucide-react'
import Container from '../components/Container'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { getArticleBySlug, getNextArticle } from '../lib/writing/writingService'

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
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined
  const nextArticle = slug ? getNextArticle(slug) : null

  useDocumentTitle(
    article
      ? `${article.title} — Ahmed | Full-Stack Web Developer`
      : 'Article Not Found — Ahmed | Full-Stack Web Developer'
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

  return (
    <article className="py-16 sm:py-24 md:py-32">
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
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            <p className="text-secondary text-base sm:text-lg leading-relaxed mb-6">
              {article.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
              <Tag className="w-3 h-3 text-muted mr-1" aria-hidden="true" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 text-xs font-mono bg-surface border border-border text-secondary rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* MDX Article Body */}
          <div className="min-h-[200px]">
            {loading && (
              <div className="py-12 flex items-center justify-center gap-2 text-xs font-mono text-muted tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                <span>LOADING ESSAY CONTENT...</span>
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

          {/* Author Callout & Feedback Card */}
          <div className="mt-16 sm:mt-20 border border-border bg-surface rounded-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">
                  AUTHOR // ARCHITECTURE & SYSTEMS
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Ahmed Hussain
                </h3>
                <p className="text-xs sm:text-sm text-secondary mt-1 max-w-md">
                  Full-stack web developer building real-world web applications with modern TypeScript, backend APIs, relational databases, and scalable UI architectures.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-page border border-border text-foreground text-xs font-mono font-medium rounded-sm hover:border-border-strong transition-colors shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>DISCUSS THIS ESSAY</span>
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
