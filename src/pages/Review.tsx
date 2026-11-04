import { useState, type FormEvent } from 'react'
import { Check, Send, Shield, ExternalLink, ArrowRight, Mail } from 'pixelarticons/react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import PageHeader from '../components/ui/PageHeader'
import BackLink from '../components/ui/BackLink'
import FormField from '../components/form/FormField'
import FormAlert from '../components/form/FormAlert'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  submitReview,
  createReviewMailtoUrl,
  type ReviewSubmissionInput,
} from '../lib/reviews/reviewService'
import { PROJECTS } from '../data/projects'
import { REVIEWS } from '../data/reviews'
import { CONTACT_CONFIG } from '../data/contact'

export default function Review() {
  useDocumentTitle('Reviews & Endorsements — Ahmed | Backend & Full-Stack Developer')

  const [formData, setFormData] = useState<ReviewSubmissionInput>({
    name: '',
    email: '',
    role: '',
    company: '',
    relationship: 'Client / Product Owner',
    review: '',
    project: '',
    verificationUrl: '',
    consentToPublish: true,
    honeypot: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [serverMessage, setServerMessage] = useState('')

  const relationshipOptions = [
    'Client / Product Owner',
    'Engineering Teammate / Peer',
    'Technical Lead / Engineering Manager',
    'Open Source Collaborator',
    'Consulting / Contract Client',
    'Other Project Collaboration',
  ]

  const featuredReview = REVIEWS.find((r) => r.id === 'rev-shifamanagement-healthcare') || REVIEWS[0]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setServerMessage('')

    try {
      const selectedProj = PROJECTS.find(
        (p) =>
          p.title.toLowerCase() === formData.project?.trim().toLowerCase() ||
          p.slug === formData.project?.trim().toLowerCase()
      )
      const submissionData = {
        ...formData,
        projectSlug: selectedProj?.slug,
      }
      const result = await submitReview(submissionData)

      if (result.success) {
        setIsSubmitted(true)
        setServerMessage(result.message)
      } else {
        if (result.errors) {
          setErrors(result.errors)
        } else {
          setServerMessage(result.message)
        }
      }
    } catch {
      setServerMessage('An unexpected network error occurred. Please try again or use the direct email link.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setFormData({
      name: '',
      email: '',
      role: '',
      company: '',
      relationship: 'Client / Product Owner',
      review: '',
      project: '',
      verificationUrl: '',
      consentToPublish: true,
      honeypot: '',
    })
    setErrors({})
    setServerMessage('')
  }

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
      <Container>
        {/* Back Link */}
        <BackLink to="/" label="BACK TO HOMEPAGE" />

        {/* Page Header */}
        <PageHeader
          className="mb-10 sm:mb-14 pb-8 border-b border-border"
          eyebrow={
            <>
              <span className="text-foreground font-semibold shrink-0">REVIEWS</span>
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <span className="shrink-0">SOCIAL PROOF & ENDORSEMENTS</span>
            </>
          }
          title="Reviews & Endorsements"
          description="Verified client testimonials from production software deliveries, engineering leadership feedback, and direct review submission."
        />

        {/* Balanced Two-Column Showcase & Submission Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ─── Left Column (lg:col-span-5): Social Proof & Trust ─── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Featured Client Endorsement Spotlight */}
            {featuredReview && (
              <article className="border border-border bg-surface rounded-sm p-6 sm:p-7 pixel-corners hover:border-border-strong transition-[border-color,box-shadow] duration-200 shadow-2xs">
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    {featuredReview.avatar ? (
                      <img
                        src={featuredReview.avatar}
                        alt={featuredReview.company || featuredReview.name}
                        width={88}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        className="h-10 sm:h-11 w-auto object-contain bg-white rounded-xs p-1 border border-border shrink-0 shadow-2xs pixel-corners"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-sm border border-border bg-surface-subtle flex items-center justify-center font-mono font-bold text-xs text-foreground shrink-0 shadow-2xs pixel-corners">
                        {featuredReview.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">
                        {featuredReview.company}
                      </h3>
                      <p className="text-[11px] font-mono text-muted">
                        Clinical Healthcare Organization
                      </p>
                    </div>
                  </div>

                  {featuredReview.verificationUrl && (
                    <a
                      href={featuredReview.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono tracking-wider uppercase font-semibold hover:opacity-85 transition-opacity"
                    >
                      <Check className="w-3 h-3 text-emerald-500 pixel-icon" aria-hidden="true" />
                      <span>VERIFIED</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-80 pixel-icon" aria-hidden="true" />
                    </a>
                  )}
                </div>

                {/* Metric pill */}
                {featuredReview.highlightMetric && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-border bg-page text-[11px] font-mono text-foreground font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>{featuredReview.highlightMetric}</span>
                  </div>
                )}

                {/* Review quote */}
                <blockquote className="my-5 text-foreground text-sm sm:text-base leading-relaxed">
                  &ldquo;{featuredReview.review}&rdquo;
                </blockquote>

                {/* Deliverables summary */}
                {featuredReview.deliverables && (
                  <div className="mb-5 p-3.5 bg-page border border-border rounded-xs text-[11px] font-mono space-y-1.5">
                    <div className="text-secondary font-semibold uppercase text-[10px] tracking-wider mb-1">
                      DELIVERED CAPABILITIES:
                    </div>
                    {featuredReview.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-muted">
                        <span className="w-1 h-1 rounded-full bg-foreground shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Card footer */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <span className="font-semibold text-foreground">{featuredReview.name}</span>
                    <span className="text-border-strong mx-1.5">·</span>
                    <span className="text-secondary">{featuredReview.role}, {featuredReview.company}</span>
                  </div>

                  {featuredReview.projectSlug && (
                    <Link
                      to={`/work/${featuredReview.projectSlug}`}
                      className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:underline active:scale-95 transition-all group shrink-0"
                    >
                      <span>INSPECT CASE STUDY</span>
                      <ArrowRight className="w-3.5 h-3.5 pixel-icon transition-transform duration-180 ease-out group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            )}

            {/* LinkedIn Endorsement Bento Card */}
            <div className="border border-border bg-surface rounded-sm p-5 sm:p-6 pixel-corners flex flex-col justify-between gap-4 shadow-2xs">
              <div>
                <div className="flex items-center justify-between text-[10px] text-muted uppercase tracking-wider mb-2 font-semibold">
                  <span className="text-foreground">PUBLIC SOCIAL PROOF</span>
                  <span className="text-foreground font-mono font-bold text-xs">in</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                  Prefer LinkedIn Recommendations?
                </h4>
                <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                  Recommendations on LinkedIn are tied directly to your verified profile and provide public trust for engineering leaders and hiring teams.
                </p>
              </div>

              <a
                href={CONTACT_CONFIG.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between px-4 py-2.5 bg-foreground text-page text-xs font-mono font-semibold rounded-xs hover:bg-secondary active:scale-[0.98] transition-all group"
              >
                <span>RECOMMEND ON LINKEDIN</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 pixel-icon transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
            </div>

            {/* Editorial Standard & Privacy Card */}
            <div className="flex items-start gap-3 p-4 bg-surface border border-border rounded-sm text-xs font-mono text-secondary pixel-corners">
              <Shield className="w-4 h-4 text-foreground shrink-0 mt-0.5 pixel-icon" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
                  VERIFICATION & PRIVACY GUARANTEE
                </p>
                <p className="text-[11px] leading-relaxed text-muted">
                  Submissions are reviewed directly by Ahmed to prevent automated spam. Your email address is kept strictly confidential and will never be published publicly.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Right Column (lg:col-span-7): Submission Form ─── */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="border border-border bg-surface rounded-sm p-8 sm:p-10 animate-page-in pixel-corners shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-wider mb-4 font-semibold">
                  <Check className="w-4 h-4 pixel-icon" aria-hidden="true" />
                  <span>SUBMISSION DELIVERED · SENT TO INBOX</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-3">
                  Thank You, {formData.name.trim()}
                </h2>

                <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
                  {serverMessage}
                </p>

                <div className="p-4 bg-page border border-border rounded-sm text-xs font-mono text-muted mb-6 space-y-2 pixel-corners">
                  <div><span className="text-secondary font-semibold">SUBMITTED AS:</span> {formData.name}</div>
                  {formData.email && <div><span className="text-secondary font-semibold">EMAIL:</span> {formData.email} <span className="text-muted text-[10px]">(Private)</span></div>}
                  {formData.role && <div><span className="text-secondary font-semibold">ROLE:</span> {formData.role}</div>}
                  {formData.company && <div><span className="text-secondary font-semibold">ORGANIZATION:</span> {formData.company}</div>}
                  <div><span className="text-secondary font-semibold">RELATIONSHIP:</span> {formData.relationship}</div>
                  {formData.project && <div><span className="text-secondary font-semibold">PROJECT:</span> {formData.project}</div>}
                  <div className="pt-2 border-t border-border mt-2">
                    <span className="text-secondary font-semibold block mb-1">TESTIMONIAL:</span>
                    <p className="text-foreground italic leading-relaxed">&ldquo;{formData.review}&rdquo;</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <Link
                    to="/#reviews"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page font-semibold rounded-sm hover:bg-secondary transition-colors group"
                  >
                    <Check className="w-4 h-4 text-emerald-400 pixel-icon" aria-hidden="true" />
                    <span>VIEW PREVIEW ON HOMEPAGE</span>
                  </Link>

                  <a
                    href={CONTACT_CONFIG.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-foreground hover:bg-surface-subtle transition-colors rounded-sm"
                  >
                    <span>ALSO RECOMMEND ON LINKEDIN</span>
                    <ExternalLink className="w-3.5 h-3.5 text-foreground pixel-icon" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 border border-border text-secondary hover:text-foreground transition-colors rounded-sm cursor-pointer"
                  >
                    SUBMIT ANOTHER
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 pixel-corners shadow-xs">
                <div className="mb-6 pb-4 border-b border-border">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted">
                    SUBMISSION FORM
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-1">
                    Leave a Testimonial
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary mt-1">
                    Share your experience regarding code quality, communication, technical execution, and project reliability.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Honeypot Spam Trap (Hidden) */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="website_url_hp">Leave this empty</label>
                    <input
                      id="website_url_hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  {/* Server-level Error Alert */}
                  {serverMessage && (
                    <FormAlert className="bg-red-500/10 border-red-500/30 text-red-500 font-mono text-xs">
                      {serverMessage}
                    </FormAlert>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField id="name" label="Full Name" required error={errors.name}>
                      <input
                        id="name"
                        type="text"
                        required
                        maxLength={80}
                        placeholder="e.g. Asad or Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={`w-full px-4 py-2.5 text-sm bg-page border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors ${
                          errors.name ? 'border-red-500' : 'border-border'
                        }`}
                      />
                    </FormField>

                    <FormField
                      id="email"
                      label="Email Address"
                      counter={<span className="text-muted text-[10px] lowercase">(private)</span>}
                      error={errors.email}
                    >
                      <input
                        id="email"
                        type="email"
                        placeholder="e.g. sarah@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`w-full px-4 py-2.5 text-sm bg-page border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors ${
                          errors.email ? 'border-red-500' : 'border-border'
                        }`}
                      />
                    </FormField>
                  </div>

                  {/* Role & Company Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      id="role"
                      label="Role / Position"
                      counter={<span className="text-muted text-[10px] lowercase">(optional)</span>}
                      error={errors.role}
                    >
                      <input
                        id="role"
                        type="text"
                        maxLength={80}
                        placeholder="e.g. Head of Product, Tech Lead"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm bg-page border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
                      />
                    </FormField>

                    <FormField
                      id="company"
                      label="Company / Organization"
                      counter={<span className="text-muted text-[10px] lowercase">(optional)</span>}
                      error={errors.company}
                    >
                      <input
                        id="company"
                        type="text"
                        maxLength={80}
                        placeholder="e.g. ShifaHomeHealthCare, Amber Real Estate"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm bg-page border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
                      />
                    </FormField>
                  </div>

                  {/* Relationship & Project Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="relationship" className="block text-xs font-mono text-foreground font-semibold uppercase tracking-wider mb-2">
                        Working Relationship <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="relationship"
                        required
                        value={formData.relationship}
                        onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm bg-page border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors cursor-pointer"
                      >
                        {relationshipOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.relationship && (
                        <p role="alert" className="mt-1.5 text-xs font-mono text-red-500">
                          {errors.relationship}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="project" className="block text-xs font-mono text-foreground font-semibold uppercase tracking-wider mb-2">
                        Project Involved <span className="text-muted text-[10px] lowercase">(optional)</span>
                      </label>
                      <input
                        id="project"
                        type="text"
                        list="projects-list"
                        maxLength={80}
                        placeholder="e.g. Amber Property Corner, Mockrithm"
                        value={formData.project}
                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm bg-page border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
                      />
                      <datalist id="projects-list">
                        {PROJECTS.map((p) => (
                          <option key={p.slug} value={p.title} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* LinkedIn / Website Profile Row */}
                  <FormField
                    id="verificationUrl"
                    label="LinkedIn Profile or Website"
                    counter={<span className="text-muted text-[10px] lowercase">(optional)</span>}
                    error={errors.verificationUrl}
                  >
                    <input
                      id="verificationUrl"
                      type="text"
                      placeholder="linkedin.com/in/username or personal website"
                      value={formData.verificationUrl}
                      onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
                      aria-invalid={Boolean(errors.verificationUrl)}
                      className={`w-full px-4 py-2.5 text-sm bg-page border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors ${
                        errors.verificationUrl ? 'border-red-500' : 'border-border'
                      }`}
                    />
                  </FormField>

                  {/* Review Textarea */}
                  <FormField
                    id="review"
                    label="Review / Testimonial"
                    required
                    error={errors.review}
                    counter={
                      <span className="text-[10px] font-mono text-muted">
                        {formData.review.length} / 1000 CHARS
                      </span>
                    }
                  >
                    <textarea
                      id="review"
                      required
                      rows={5}
                      maxLength={1000}
                      placeholder="Share your experience regarding code quality, communication, technical execution, and project reliability..."
                      value={formData.review}
                      onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                      aria-invalid={Boolean(errors.review)}
                      aria-describedby={errors.review ? 'review-error' : undefined}
                      className={`w-full px-4 py-3 text-sm bg-page border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors leading-relaxed ${
                        errors.review ? 'border-red-500' : 'border-border'
                      }`}
                    />
                  </FormField>

                  {/* Friendly Consent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.consentToPublish}
                        onChange={(e) => setFormData({ ...formData, consentToPublish: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded-xs border-border text-foreground accent-foreground cursor-pointer"
                      />
                      <span className="text-xs text-secondary leading-normal">
                        I am happy for Ahmed to feature this testimonial on his portfolio.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button & Direct Email Fallback */}
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-page text-xs sm:text-sm font-mono font-semibold rounded-sm hover:bg-secondary disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-page border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                          <span>SENDING TO INBOX...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 pixel-icon" aria-hidden="true" />
                          <span>SUBMIT TESTIMONIAL</span>
                        </>
                      )}
                    </button>

                    <a
                      href={createReviewMailtoUrl(formData)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors self-center sm:self-auto"
                      title="Prefill review in your default email client"
                    >
                      <Mail className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
                      <span>Prefer email? Send directly ↗</span>
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
