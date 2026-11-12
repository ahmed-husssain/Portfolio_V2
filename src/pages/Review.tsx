import { useState, type FormEvent } from 'react'
import { Check, ExternalLink, ArrowRight, Trash, Send } from 'pixelarticons/react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import PageHeader from '../components/ui/PageHeader'
import BackLink from '../components/ui/BackLink'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  getApprovedReviews,
  submitReview,
  deleteLocalReview,
  type ReviewSubmissionInput,
} from '../lib/reviews/reviewService'
import type { Review as ReviewType } from '../data/reviews'
import { CONTACT_CONFIG } from '../data/contact'
import { sound } from '../lib/sound/soundEngine'

export default function Review() {
  useDocumentTitle('Recommendations & Feedback — Ahmed Hussain')

  const [reviewsList, setReviewsList] = useState<ReviewType[]>(() => getApprovedReviews())

  // Frictionless direct note state
  const [formData, setFormData] = useState<{
    name: string
    role: string
    review: string
    honeypot: string
  }>({
    name: '',
    role: '',
    review: '',
    honeypot: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleDeleteLocal = (id: string) => {
    sound.playTap()
    deleteLocalReview(id)
    setReviewsList(getApprovedReviews())
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    const trimmedName = formData.name.trim()
    const trimmedReview = formData.review.trim()

    if (!trimmedName) {
      setErrorMessage('Please enter your name.')
      return
    }

    if (!trimmedReview || trimmedReview.length < 10) {
      setErrorMessage('Please write a brief note (at least 10 characters).')
      return
    }

    setIsSubmitting(true)

    try {
      const payload: ReviewSubmissionInput = {
        name: trimmedName,
        role: formData.role.trim() || undefined,
        relationship: 'Collaborator',
        review: trimmedReview,
        consentToPublish: true,
        honeypot: formData.honeypot,
      }

      const result = await submitReview(payload)

      if (result.success) {
        sound.playChirp()
        setIsSubmitted(true)
        setReviewsList(getApprovedReviews())
      } else {
        setErrorMessage(result.message || 'Unable to deliver note. Please try again or recommend on LinkedIn.')
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again or recommend on LinkedIn.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    sound.playTap()
    setIsSubmitted(false)
    setFormData({ name: '', role: '', review: '', honeypot: '' })
    setErrorMessage('')
  }

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 md:pb-24">
      <Container>
        {/* Back Link */}
        <BackLink to="/" label="BACK TO HOMEPAGE" />

        {/* Page Header */}
        <PageHeader
          className="mb-10 sm:mb-14 pb-8 border-b border-border"
          eyebrow={
            <>
              <span className="text-foreground font-semibold shrink-0">FEEDBACK</span>
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="shrink-0">WORKING TOGETHER</span>
            </>
          }
          title="Recommendations"
          description="Direct notes from clients, product owners, and collaborators on software delivery, backend architecture, and communication."
        />

        {/* ─── Wall of Recommendations ─── */}
        <div className="space-y-6 max-w-4xl">
          {reviewsList.map((item) => (
            <article
              key={item.id}
              className={`relative p-6 sm:p-8 rounded-sm border bg-surface hover:border-border-strong transition-all duration-200 pixel-corners ${
                item.isLocalSubmission ? 'border-amber-500/40 shadow-xs' : 'border-border/80'
              }`}
            >
              {/* Top Row: Author & Verification */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/70">
                <div className="flex items-center gap-3">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.company || item.name}
                      width={88}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      className="h-9 w-auto object-contain bg-white rounded-xs p-1 border border-border shrink-0 shadow-2xs pixel-corners"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xs bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-xs text-blue-600 dark:text-blue-400 shrink-0">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div className="font-semibold text-foreground text-sm sm:text-base leading-snug">
                      {item.name}
                    </div>
                    {(item.role || item.company) && (
                      <div className="text-xs text-muted font-mono mt-0.5">
                        {[item.role, item.company].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.isLocalSubmission ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono tracking-wider uppercase font-semibold">
                        <span className="pixel-beacon bg-amber-500" aria-hidden="true" />
                        <span>LOCAL PREVIEW</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteLocal(item.id)}
                        className="p-1 text-muted hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete this local preview note"
                        aria-label="Delete local note"
                      >
                        <Trash className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
                      </button>
                    </div>
                  ) : item.verificationUrl ? (
                    <a
                      href={item.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs border border-blue-500/30 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-mono font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-2xs"
                      title={`Verify ${item.company || item.name}`}
                    >
                      <Check className="w-3 h-3 text-blue-600 dark:text-blue-400 pixel-icon" aria-hidden="true" />
                      <span className="truncate max-w-[140px] sm:max-w-none">
                        {item.verificationUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 pixel-icon" aria-hidden="true" />
                    </a>
                  ) : item.highlightMetric ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-border/80 bg-page text-[10px] font-mono font-semibold text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
                      <span>{item.highlightMetric}</span>
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Quote Body */}
              <blockquote className="my-5 sm:my-6 text-foreground text-sm sm:text-base leading-relaxed">
                &ldquo;{item.review}&rdquo;
              </blockquote>

              {/* Project Link Footer */}
              {item.projectSlug && (
                <div className="pt-3.5 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-secondary font-semibold shrink-0">CONTEXT:</span>
                    <span className="truncate">{item.project || 'Production Delivery'}</span>
                  </div>
                  <Link
                    to={`/work/${item.projectSlug}`}
                    className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline active:scale-95 transition-all shrink-0 ml-3"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="w-3 h-3 pixel-icon" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* ─── Collaboration & Recommendation Pathways ─── */}
        <div className="border-t border-border mt-14 sm:mt-16 pt-10 sm:pt-14 max-w-4xl space-y-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1">
              HAVE WE WORKED TOGETHER?
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Leave a Note or Recommendation
            </h2>
            <p className="text-secondary text-sm mt-1 max-w-xl leading-relaxed">
              If we&apos;ve collaborated on a project, team, or contract, you can write a recommendation directly on LinkedIn or send a direct note below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* ─── Card 1: Recommend on LinkedIn (md:col-span-5) ─── */}
            <div className="md:col-span-5 p-6 rounded-sm border border-border/80 bg-surface flex flex-col justify-between space-y-5 pixel-corners shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" aria-hidden="true" />
                  <span>RECOMMENDED METHOD</span>
                </div>
                <h3 className="font-semibold text-foreground text-base leading-snug">
                  Recommend on LinkedIn
                </h3>
                <p className="text-xs text-secondary leading-relaxed">
                  The gold standard in tech. Your recommendation links directly to your verified profile and appears on Ahmed&apos;s LinkedIn profile and portfolio.
                </p>
              </div>

              <a
                href={CONTACT_CONFIG.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-sm bg-foreground text-page font-mono text-xs font-semibold hover:bg-secondary active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
              >
                <span>RECOMMEND ON LINKEDIN</span>
                <ExternalLink className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
              </a>
            </div>

            {/* ─── Card 2: Direct Note Form (md:col-span-7) ─── */}
            <div className="md:col-span-7 p-6 rounded-sm border border-border/80 bg-surface pixel-corners shadow-2xs">
              {isSubmitted ? (
                <div className="py-4 space-y-4 animate-page-in">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider font-semibold">
                    <Check className="w-4 h-4 pixel-icon" aria-hidden="true" />
                    <span>NOTE DELIVERED TO INBOX</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Thank You, {formData.name}!
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    Your note was sent straight to Ahmed&apos;s inbox and has been added to your local preview on this page.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 border border-border text-xs font-mono text-secondary hover:text-foreground active:scale-[0.98] transition-all rounded-sm cursor-pointer"
                    >
                      SEND ANOTHER NOTE
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="pb-3 border-b border-border/70">
                    <h3 className="font-semibold text-foreground text-sm">
                      Direct Note
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      Delivered straight to Ahmed&apos;s private inbox. No public spam, no HR paperwork.
                    </p>
                  </div>

                  {/* Hidden Spam Trap */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="hp_note">Leave blank</label>
                    <input
                      id="hp_note"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono rounded-sm">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="note_name" className="block text-[11px] font-mono text-muted mb-1 uppercase tracking-wider">
                        YOUR NAME <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="note_name"
                        type="text"
                        required
                        maxLength={80}
                        placeholder="e.g. Asad or Sarah"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-page border border-border/80 rounded-sm text-foreground placeholder:text-muted focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="note_role" className="block text-[11px] font-mono text-muted mb-1 uppercase tracking-wider">
                        ROLE &amp; COMPANY <span className="text-muted lowercase text-[10px]">(optional)</span>
                      </label>
                      <input
                        id="note_role"
                        type="text"
                        maxLength={80}
                        placeholder="e.g. Owner, Shifa Health"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-page border border-border/80 rounded-sm text-foreground placeholder:text-muted focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="note_body" className="block text-[11px] font-mono text-muted mb-1 uppercase tracking-wider">
                      YOUR NOTE <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="note_body"
                      required
                      rows={4}
                      maxLength={1000}
                      placeholder="How was the collaboration, engineering quality, or communication?"
                      value={formData.review}
                      onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-page border border-border/80 rounded-sm text-foreground placeholder:text-muted focus:outline-none focus:border-foreground transition-colors leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page text-xs font-mono font-semibold rounded-sm hover:bg-secondary active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-page border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                          <span>SENDING...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND NOTE</span>
                          <Send className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
                        </>
                      )}
                    </button>

                    <span className="text-[11px] font-mono text-muted">
                      Private inbox delivery
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
