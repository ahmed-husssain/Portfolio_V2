import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Label, Message, Notebook, Check, Copy, Sparkles } from 'pixelarticons/react'
import Container from '../components/ui/Container'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getArticleBySlug, getNextArticle } from '../lib/writing/writingService'

// Dynamic component loaders isolated to this route-level chunk
const articleLoaders = import.meta.glob<{ default: React.ComponentType<{ components?: any }> }>(
  '../content/writing/*.mdx'
)

// MDX Code block with tactile 1-click Copy button
function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (preRef.current) {
      const codeText = preRef.current.innerText || ''
      navigator.clipboard.writeText(codeText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative group my-6 border border-border bg-surface rounded-sm pixel-corners overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-page/80 border-b border-border text-micro-caps text-muted">
        <span className="font-mono text-secondary">CODE SNIPPET</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono text-secondary hover:text-foreground bg-page hover:bg-surface border border-border rounded-2xs active:scale-[0.96] transition-all cursor-pointer select-none"
          title="Copy snippet to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-foreground pixel-icon" aria-hidden="true" />
              <span>COPIED ✓</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted pixel-icon" aria-hidden="true" />
              <span>COPY CODE</span>
            </>
          )}
        </button>
      </div>
      <pre
        ref={preRef}
        className="p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-sm text-foreground leading-relaxed m-0 bg-transparent border-0"
        {...props}
      />
    </div>
  )
}

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
  pre: CodeBlock,
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
          <div className="max-w-2xl mx-auto border border-border bg-surface rounded-sm p-8 sm:p-12 text-center pixel-corners">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-4">
              <Notebook className="w-4 h-4 text-muted pixel-icon" />
              <span>NOTE NOT FOUND</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-4">
              Article Not Available
            </h1>
            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
              This field note either does not exist or has not yet been published to the production index.
            </p>
            <Link
              to="/writing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-xs font-mono font-semibold uppercase tracking-wider rounded-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 pixel-icon" />
              <span>BACK TO FIELD NOTES</span>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const isOpinion = article.type === 'opinion'

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
              <ArrowLeft className="w-3.5 h-3.5 pixel-icon transition-transform group-hover:-translate-x-1" />
              <span>BACK TO FIELD NOTES</span>
            </Link>
            <span className="text-muted hidden sm:inline-block tracking-wider uppercase">
              WRITING · {article.slug}
            </span>
          </nav>

          {/* Article Header */}
          <header className="mb-12 sm:mb-16 pb-8 border-b border-border">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted mb-4">
              <span className="px-2 py-0.5 bg-surface border border-border text-foreground font-semibold rounded-2xs">
                {isOpinion ? 'ENGINEERING OPINION' : 'PRODUCTION LEARNING'}
              </span>
              <span className="text-border-strong">·</span>
              <span className="text-secondary">{article.readTime || '4 MIN READ'}</span>
              <span className="text-border-strong">·</span>
              <div className="flex items-center gap-1.5 text-secondary">
                <Calendar className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
                <time dateTime={article.date}>{article.date}</time>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            {/* Core Takeaway Box (if present) */}
            {article.takeaway && (
              <div className="my-6 p-4 sm:p-5 bg-surface border-l-2 border-foreground rounded-r-xs font-mono text-xs sm:text-sm text-foreground leading-relaxed pixel-corners">
                <div className="text-micro-caps text-muted font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-foreground pixel-icon" aria-hidden="true" />
                  <span>CORE TAKEAWAY / VERDICT</span>
                </div>
                <p className="text-foreground/95 font-medium">
                  "{article.takeaway}"
                </p>
              </div>
            )}

            <p className="text-secondary text-base sm:text-lg leading-relaxed mb-6">
              {article.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
              <Label className="w-3.5 h-3.5 text-muted mr-1 pixel-icon" aria-hidden="true" />
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
                <span className="pixel-beacon bg-foreground" />
                <span>LOADING NOTE CONTENT...</span>
              </div>
            )}

            {error && (
              <div className="border border-border bg-surface rounded-sm p-6 text-center text-xs font-mono text-secondary pixel-corners">
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
          <div className="mt-16 sm:mt-20 border border-border bg-surface rounded-sm p-6 sm:p-8 pixel-corners">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">
                  AUTHOR · SOFTWARE DEVELOPER
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Syed Ahmed Hussain
                </h3>
                <p className="text-xs sm:text-sm text-secondary mt-1 max-w-md">
                  Software Developer (Remote) @ Shifa Healthcare Karachi. Building resilient backend systems, relational schemas, high-throughput APIs, and pragmatic web applications.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-page border border-border text-foreground text-xs font-mono font-medium rounded-sm hover:border-border-strong active:scale-[0.97] transition-all shrink-0 group cursor-pointer"
              >
                <Message className="w-3.5 h-3.5 pixel-icon" />
                <span>DISCUSS THIS NOTE</span>
              </Link>
            </div>
          </div>

          {/* Next Article / Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Link
              to="/writing"
              className="inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 pixel-icon transition-transform group-hover:-translate-x-0.5" />
              <span>ALL FIELD NOTES</span>
            </Link>

            {nextArticle ? (
              <Link
                to={`/writing/${nextArticle.slug}`}
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-foreground hover:text-secondary transition-colors group text-right"
              >
                <span>NEXT: {nextArticle.title}</span>
                <ArrowRight className="w-3.5 h-3.5 pixel-icon transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <Link
                to="/work"
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-foreground hover:text-secondary transition-colors group text-right"
              >
                <span>EXPLORE SELECTED WORK</span>
                <ArrowRight className="w-3.5 h-3.5 pixel-icon transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </article>
  )
}
