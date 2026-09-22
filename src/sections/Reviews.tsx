import { useState } from 'react'
import { ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck, Trash2 } from 'lucide-react'
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
        className="hover:opacity-80 transition-opacity"
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
  const verifiedCount = reviewsList.filter((r) => !r.isLocalSubmission).length
  const localCount = reviewsList.filter((r) => r.isLocalSubmission).length

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
          title="Client & Peer Endorsements"
          subtitle="Authenticated testimonials from project stakeholders, competition mentors, and backend collaborators on production systems."
          meta={`[ ${verifiedCount.toString().padStart(2, '0')} VERIFIED${localCount > 0 ? ` · +${localCount} LOCAL` : ''} · 100% AUTHENTIC ]`}
        />

        {/* ─── Trust Protocol Bar ─── */}
        <div className="mb-10 sm:mb-14 p-4 border border-border bg-surface-subtle/50 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
            <span className="uppercase tracking-wider">EDITORIAL & TRUST PROTOCOL:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] text-secondary">
            <span>● 100% IDENTITIES VERIFIED</span>
            <span>● LINKED TO CASE STUDIES</span>
            <span>● ZERO SYNTHETIC TESTIMONIALS</span>
          </div>
        </div>

        {/* ─── Reviews Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {reviewsList.map((item, index) => (
            <article
              key={item.id}
              className={`border bg-surface hover:bg-surface-hover hover:border-border-strong transition-all duration-200 rounded-sm p-6 sm:p-7 flex flex-col justify-between ${
                item.isLocalSubmission ? 'border-amber-500/40 shadow-xs' : 'border-border'
              }`}
            >
              <div>
                {/* Header row: Index + Verification Badge */}
                <div className="flex items-center justify-between border-b border-border pb-3.5 mb-5 text-xs font-mono">
                  <span className="text-muted font-bold">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-2">
                    <VerificationBadge review={item} />
                    {item.isLocalSubmission && (
                      <button
                        type="button"
                        onClick={() => handleDeleteLocal(item.id)}
                        className="text-muted hover:text-red-500 transition-colors p-1"
                        title="Remove local preview"
                        aria-label="Remove local preview"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Reviewer Identity Block */}
                <div className="flex items-start gap-3.5 mb-5">
                  <div className="w-10 h-10 rounded-sm border border-border bg-surface-subtle flex items-center justify-center font-mono font-bold text-xs text-foreground shrink-0 shadow-2xs">
                    {getInitials(item.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-sm leading-snug truncate">
                      {item.name}
                    </h3>
                    {(item.role || item.company) && (
                      <p className="text-xs font-mono text-secondary mt-0.5 truncate">
                        {[item.role, item.company].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-[11px] font-mono text-muted mt-0.5 truncate">
                      {item.relationship}
                    </p>
                  </div>
                </div>

                {/* Metric Highlight Pill */}
                {item.highlightMetric && (
                  <div className="mb-4 px-2.5 py-1 rounded-xs bg-page/70 border border-border inline-block text-[11px] font-mono text-foreground font-medium">
                    <span className="text-muted mr-1.5">//</span>
                    {item.highlightMetric}
                  </div>
                )}

                {/* Quotation */}
                <blockquote className="text-secondary text-sm leading-relaxed mb-6 italic">
                  &ldquo;{item.review}&rdquo;
                </blockquote>
              </div>

              {/* Card Footer: Deliverables + Case Study Link */}
              <div className="pt-4 border-t border-border space-y-3 mt-auto">
                {/* Deliverables tags */}
                {item.deliverables && item.deliverables.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-1.5">
                      KEY DELIVERABLES:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.deliverables.map((deliv, i) => (
                        <span
                          key={i}
                          className="font-mono text-[10px] px-2 py-0.5 rounded-xs border border-border bg-surface-subtle text-secondary"
                        >
                          {deliv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Case Study Deep Link */}
                {item.projectSlug ? (
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <Link
                      to={`/work/${item.projectSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground hover:underline group"
                    >
                      <span className="truncate max-w-[200px]">CASE STUDY: {item.project || item.projectSlug}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 shrink-0" aria-hidden="true" />
                    </Link>
                  </div>
                ) : item.project ? (
                  <div className="pt-2 border-t border-border/60 text-[11px] font-mono text-muted">
                    PROJECT: <span className="text-foreground">{item.project}</span>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        {/* ─── Bottom CTA Bar ─── */}
        <div className="p-6 sm:p-8 border border-border bg-surface rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-semibold text-foreground">
              Have we collaborated on an API, database system, or web platform?
            </h4>
            <p className="text-xs font-mono text-secondary">
              Share your candid feedback. Verified submissions are published directly on this registry.
            </p>
          </div>

          <Link
            to="/review"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-foreground text-page text-xs font-mono font-semibold rounded-sm hover:bg-secondary transition-colors shrink-0 shadow-xs"
          >
            <span>SUBMIT AN ENDORSEMENT</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
