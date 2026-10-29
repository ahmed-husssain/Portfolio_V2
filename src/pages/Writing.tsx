import { useState } from 'react'
import { ArrowRight, Calendar, Label } from 'pixelarticons/react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import Reveal from '../components/motion/Reveal'
import PageHeader from '../components/ui/PageHeader'
import ContinuityBridge from '../components/ui/ContinuityBridge'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getPublishedArticles, getWritingTopics } from '../lib/writing/writingService'
import ImageLightboxModal from '../components/ui/ImageLightboxModal'

export default function Writing() {
  useDocumentTitle('Field Notes & Writing — Syed Ahmed Hussain | Software Developer')

  const [selectedTag, setSelectedTag] = useState<string>('ALL')
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt?: string; caption?: string } | null>(null)
  const publishedArticles = getPublishedArticles()
  const topics = ['ALL', ...getWritingTopics()]

  const filteredArticles = publishedArticles.filter((article) => {
    if (selectedTag === 'ALL') return true
    return article.tags?.includes(selectedTag)
  })

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 md:pb-24">
      <Container>
        <PageHeader
          eyebrow={
            <>
              <span className="text-foreground font-semibold shrink-0">TECHNICAL ESSAYS & FIELD NOTES</span>
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="shrink-0">
                {publishedArticles.length < 10 ? `0${publishedArticles.length}` : publishedArticles.length}{' '}
                {publishedArticles.length === 1 ? 'NOTE' : 'NOTES'} PUBLISHED
              </span>
            </>
          }
          title="Field Notes & Technical Opinions"
          description="Learnings from production systems, backend performance, database architecture, and honest opinions from building software."
        />

        {/* Clean Topic Pills (High-contrast, readable, no empty (0) buttons) */}
        {topics.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-border">
            {topics.map((tag) => {
              const isActive = selectedTag === tag
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-2xs border transition-[transform,background-color,border-color,color] duration-150 active:scale-[0.97] cursor-pointer ${
                    isActive
                      ? 'bg-foreground text-page border-foreground font-semibold'
                      : 'bg-surface text-secondary border-border hover:border-border-strong hover:text-foreground'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        )}

        {/* Open Editorial Stream - No Heavy "Locked" Boxes */}
        <div className="divide-y divide-border border-y border-border mb-16">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => {
              const isOpinion = article.type === 'opinion'
              return (
                <Reveal key={article.slug} delay={index * 50}>
                  <article className="py-8 sm:py-10 group transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start gap-6 sm:gap-8">
                      <div className="flex-1 min-w-0">
                        {/* Telemetry metadata row */}
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted mb-3">
                          <span className="text-foreground font-semibold uppercase tracking-wider">
                            {isOpinion ? 'OPINION' : 'LEARNING'}
                          </span>
                          <span className="text-border-strong" aria-hidden="true">·</span>
                          <span className="text-secondary">{article.readTime || '4 MIN READ'}</span>
                          <span className="text-border-strong" aria-hidden="true">·</span>
                          <div className="flex items-center gap-1.5 text-muted">
                            <Calendar className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
                            <time dateTime={article.date}>{article.date}</time>
                          </div>
                        </div>

                        {/* Headline */}
                        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 leading-snug">
                          <Link
                            to={`/writing/${article.slug}`}
                            className="inline-flex items-center gap-2 hover:text-foreground group-hover:underline underline-offset-4 decoration-border transition-colors"
                          >
                            <span>{article.title}</span>
                            <ArrowRight className="w-4 h-4 pixel-icon text-muted group-hover:text-foreground opacity-60 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 shrink-0" />
                          </Link>
                        </h2>

                        {/* Description Excerpt */}
                        <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6 font-normal">
                          {article.description}
                        </p>

                        {/* Tags & Action Link */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Label className="w-3.5 h-3.5 text-muted mr-1 pixel-icon" aria-hidden="true" />
                            {article.tags.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setSelectedTag(tag)}
                                className="px-2 py-0.5 text-micro-caps bg-surface border border-border text-secondary hover:text-foreground hover:border-border-strong rounded-2xs font-mono transition-colors cursor-pointer"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>

                          <Link
                            to={`/writing/${article.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-foreground hover:underline transition-colors"
                          >
                            <span>READ ESSAY</span>
                            <ArrowRight className="w-3.5 h-3.5 pixel-icon" />
                          </Link>
                        </div>
                      </div>

                      {/* Side-by-side Image Thumbnail with smooth zoom on click */}
                      {article.image && (
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxImage({
                              src: article.image!,
                              alt: article.imageAlt || article.title,
                              caption: article.title,
                            })
                          }
                          className="shrink-0 w-full md:w-60 lg:w-72 aspect-[16/10] border border-border bg-surface-subtle/50 hover:border-border-strong rounded-sm overflow-hidden pixel-corners group/thumb transition-all duration-200 relative cursor-zoom-in text-left block active:scale-[0.98] p-2"
                          title="Click to zoom diagram"
                          aria-label={`Zoom diagram: ${article.title}`}
                        >
                          <img
                            src={article.image}
                            alt={article.imageAlt || article.title}
                            className="w-full h-full object-contain group-hover/thumb:scale-[1.02] transition-transform duration-200"
                            loading="lazy"
                          />
                        </button>
                      )}
                    </div>
                  </article>
                </Reveal>
              )
            })
          ) : (
            <div className="py-12 text-center text-xs font-mono text-secondary">
              <p className="mb-4">No notes found for "{selectedTag}".</p>
              <button
                type="button"
                onClick={() => setSelectedTag('ALL')}
                className="px-3 py-1.5 bg-surface border border-border text-foreground rounded-2xs hover:border-border-strong cursor-pointer"
              >
                SHOW ALL NOTES
              </button>
            </div>
          )}
        </div>

        {/* Forward Continuity Bridge to Contact */}
        <ContinuityBridge
          kicker="INITIATE CONTACT"
          title="Let's Build Something Useful Together"
          description="Open for software engineering roles, contracts, and backend architectural discussions. Directly accessible by email or professional channels."
          to="/about#contact"
          actionLabel="GET IN TOUCH"
          className="mt-14 sm:mt-20"
        />

        {/* Smooth Lightbox Modal */}
        <ImageLightboxModal
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          src={lightboxImage?.src || ''}
          alt={lightboxImage?.alt}
          caption={lightboxImage?.caption}
        />
      </Container>
    </div>
  )
}
