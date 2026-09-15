import { ArrowUpRight } from 'lucide-react'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import { REVIEWS } from '../data/reviews'

export default function Reviews() {
  const hasReviews = REVIEWS.length > 0

  return (
    <section id="reviews" className="py-20 sm:py-28 md:py-36 border-b border-border">
      <Container>
        {/* ─── Section Header ─── */}
        <SectionHeading
          index="// 04"
          title="Reviews"
          subtitle="Client testimonials, peer endorsements, and verified feedback from production projects."
          meta={hasReviews ? `[ 0${REVIEWS.length} VERIFIED ]` : '[ VERIFICATION PENDING ]'}
        />

        {/* ─── Populated Reviews Grid ─── */}
        {hasReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {REVIEWS.map((item) => (
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
        ) : (
          /* ─── Transparent Status Box (When Awaiting Verified Reviews) ─── */
          <div className="border border-border bg-surface rounded-sm p-6 sm:p-10 max-w-[800px]">
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-border text-xs font-mono text-muted">
              <span className="w-2 h-2 rounded-full bg-amber-500/80" aria-hidden="true" />
              <span className="text-foreground font-semibold">// REVIEWS STATUS</span>
              <span className="text-border-strong" aria-hidden="true">|</span>
              <span className="tracking-wider uppercase">CLIENT VERIFICATION IN PROGRESS</span>
            </div>

            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
              Client testimonials and peer recommendations from recent product and contract engagements are currently being compiled and linked to public verification sources.
            </p>

            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-8">
              In the meantime, code quality, commit history, and architectural decisions can be inspected directly via production deployments and open repositories in Selected Work.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono pt-4 border-t border-border">
              <a
                href="#work"
                className="inline-flex items-center gap-1.5 text-foreground font-semibold hover:underline"
              >
                <span>EXPLORE WORK</span>
                <span aria-hidden="true">↓</span>
              </a>
              <a
                href="https://github.com/ahmed-husssain"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-secondary hover:text-foreground transition-colors"
              >
                <span>INSPECT GITHUB</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
