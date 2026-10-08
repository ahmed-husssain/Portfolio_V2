import { useState } from 'react'
import { ArrowRight, ArrowUpRight, CheckCircle2, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import { getApprovedReviews, deleteLocalReview } from '../lib/reviews/reviewService'
import type { Review } from '../data/reviews'

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

function VerificationBadge({ review }: { review: Review }) {
  if (review.isLocalSubmission) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono tracking-wider uppercase font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
        <span>YOUR SUBMISSION · LOCAL PREVIEW</span>
      </span>
    )
  }

  const label =
    review.verificationType === 'institution'
      ? 'APTECH VISION 2025'
      : review.verificationType === 'github'
        ? 'GITHUB COLLABORATOR'
        : review.verificationType === 'client'
          ? 'VERIFIED CLIENT WEBSITE'
          : 'VERIFIED ON LINKEDIN'

  const content = (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono tracking-wider uppercase font-semibold">
      <CheckCircle2 className="w-3 h-3 text-emerald-500" aria-hidden="true" />
      <span>{label}</span>
      {review.verificationUrl && <ArrowUpRight className="w-2.5 h-2.5 ml-0.5 opacity-80" aria-hidden="true" />}
    </span>
  )

  if (review.verificationUrl) {
    return (
      <a
        href={review.verificationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-85 active:scale-95 transition-[opacity,transform] duration-150 ease-out"
        aria-label={`Verify endorsement by ${review.name}`}
      >
        {content}
      </a>
    )
  }

  return content
}

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState<Review[]>(() => getApprovedReviews())

  const handleDeleteLocal = (id: string) => {
    deleteLocalReview(id)
    setReviewsList(getApprovedReviews())
  }

  return (
    <section id="reviews" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        {/* ─── Section Header ─── */}
        <SectionHeading
          index="// 04"
          title="Client Endorsement"
          subtitle="Direct feedback from clinical operations leadership on production software delivery."
          meta="[ 01 VERIFIED CLIENT · PRODUCTION SYSTEM ]"
        />

        {/* ─── High-Trust Client Endorsement Spotlight ─── */}
        <div className="max-w-3xl mx-auto space-y-6 mb-12">
          {reviewsList.map((item) => (
            <article
              key={item.id}
              className={`border bg-surface hover:border-border-strong hover:shadow-xs transition-[border-color,box-shadow] duration-200 rounded-sm p-6 sm:p-8 ${
                item.isLocalSubmission ? 'border-amber-500/40 shadow-xs' : 'border-border'
              }`}
            >
              {/* Header: Company Logo + Verified Link */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.company || item.name}
                      className="h-10 sm:h-12 w-auto object-contain bg-white rounded-xs p-1 border border-border shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-sm border border-border bg-surface-subtle flex items-center justify-center font-mono font-bold text-xs text-foreground shrink-0 shadow-2xs">
                      {getInitials(item.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">
                      {item.company || item.name}
                    </h3>
                    <p className="text-[11px] font-mono text-muted">
                      Clinical Healthcare Organization
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <VerificationBadge review={item} />
                  {item.isLocalSubmission && (
                    <button
                      type="button"
                      onClick={() => handleDeleteLocal(item.id)}
                      className="text-muted hover:text-red-500 active:scale-90 transition-[color,transform] duration-150 ease-out p-1"
                      title="Remove local preview"
                      aria-label="Remove local preview"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Concise, Direct Quote */}
              <blockquote className="my-6 text-foreground text-sm sm:text-base leading-relaxed">
                &ldquo;{item.review}&rdquo;
              </blockquote>

              {/* Card Footer: Reviewer Sign-off + Case Study Deep Link */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-foreground">{item.name}</span>
                  <span className="text-border-strong" aria-hidden="true">·</span>
                  <span className="text-secondary">{item.role || 'Client'}, {item.company}</span>
                </div>

                {item.projectSlug && (
                  <Link
                    to={`/work/${item.projectSlug}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:underline active:scale-95 transition-all group shrink-0"
                  >
                    <span>INSPECT CASE STUDY</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-180 ease-out group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* ─── Bottom CTA Bar ─── */}
        <div className="max-w-3xl mx-auto p-5 sm:p-6 border border-border bg-surface rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-foreground">
              Have we collaborated on an API, database system, or web platform?
            </h4>
            <p className="text-[11px] font-mono text-muted">
              Submit your candid feedback directly to this portfolio.
            </p>
          </div>

          <Link
            to="/review"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-page text-xs font-mono font-semibold rounded-sm hover:bg-secondary active:scale-[0.97] transition-all shrink-0 select-none"
          >
            <span>SUBMIT AN ENDORSEMENT</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-180 ease-out group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
