import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import { getApprovedReviews } from '../lib/reviews/reviewService'

export default function Reviews() {
  const approvedReviews = getApprovedReviews()
  const hasApprovedReviews = approvedReviews.length > 0

  return (
    <section id="reviews" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        {/* ─── Section Header ─── */}
        <SectionHeading
          index="// 04"
          title="Reviews"
          subtitle="Feedback from clients, collaborators, and team leads I have worked with on production projects."
          meta={hasApprovedReviews ? `[ 0${approvedReviews.length} VERIFIED ]` : '[ VERIFICATION IN PROGRESS ]'}
        />

        {/* ─── Populated Reviews Grid (Approved Reviews Only) ─── */}
        {hasApprovedReviews ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
              {approvedReviews.map((item) => (
                <article
                  key={item.id}
                  className="border border-border bg-surface hover:bg-surface-hover hover:border-border-strong transition-all duration-200 rounded-sm p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-border pb-3 mb-5 text-xs font-mono text-muted">
                      <span>// VERIFIED REVIEW</span>
                      {item.project && <span className="uppercase">{item.project}</span>}
                    </div>

                    {/* Quotation */}
                    <blockquote className="text-foreground text-sm sm:text-base leading-relaxed mb-6">
                      &ldquo;{item.review}&rdquo;
                    </blockquote>
                  </div>

                  {/* Author Details & Verification Link */}
                  <div className="pt-4 border-t border-border flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {item.name}
                      </h3>
                      {(item.role || item.company) && (
                        <p className="text-xs font-mono text-secondary mt-0.5">
                          {[item.role, item.company].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>

                    {item.verificationUrl && (
                      <a
                        href={item.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-foreground hover:underline font-medium"
                        aria-label={`Verify review by ${item.name}`}
                      >
                        <span>VERIFY REVIEW</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Link to Submit Feedback */}
            <div className="pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
              <span className="text-secondary">
                WORKED WITH AHMED ON A SYSTEM, PRODUCT, OR CODEBASE?
              </span>
              <Link
                to="/review"
                className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-secondary transition-colors"
              >
                <span>SHARE YOUR EXPERIENCE</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          /* ─── Transparent Honest Empty State ─── */
          <div className="border border-border bg-surface rounded-sm p-6 sm:p-10 max-w-[800px]">
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-border text-xs font-mono text-muted">
              <span className="w-2 h-2 rounded-full bg-amber-500/80" aria-hidden="true" />
              <span className="text-foreground font-semibold">// REVIEWS STATUS</span>
              <span className="text-border-strong" aria-hidden="true">|</span>
              <span className="tracking-wider uppercase">CLIENT VERIFICATION IN PROGRESS</span>
            </div>

            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-4">
              Feedback from people I've worked with.
            </p>

            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-8">
              Verified reviews will appear here as I collect and authenticate them from recent product engagements and client contracts.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono pt-4 border-t border-border">
              <Link
                to="/review"
                className="inline-flex items-center gap-1.5 text-foreground font-semibold hover:underline"
              >
                <span>SHARE YOUR EXPERIENCE</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <a
                href="https://github.com/ahmed-husssain"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-secondary hover:text-foreground transition-colors"
              >
                <span>INSPECT GITHUB CODE</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
