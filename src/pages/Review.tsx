import { useState, type FormEvent } from 'react'
import { ArrowLeft, CheckCircle2, Send, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { submitReview, type ReviewSubmissionInput } from '../lib/reviews/reviewService'
import { PROJECTS } from '../data/projects'

export default function Review() {
  useDocumentTitle('Share Your Experience — Ahmed | Full-Stack Web Developer')

  const [formData, setFormData] = useState<ReviewSubmissionInput>({
    name: '',
    role: '',
    company: '',
    relationship: 'Client / Product Owner',
    review: '',
    project: '',
    verificationUrl: '',
    consentToPublish: false,
    honeypot: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [serverMessage, setServerMessage] = useState('')

  const relationshipOptions = [
    'Client / Product Owner',
    'Engineering Colleague / Peer',
    'Technical Lead / Manager',
    'Open Source Collaborator',
    'Consulting Engagement',
    'Other Collaborative Engagement',
  ]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

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
      setServerMessage('An unexpected network error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-16 sm:py-24 md:py-32">
      <Container>
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-secondary hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <span>BACK TO HOMEPAGE</span>
          </Link>
        </div>

        {/* Page Header */}
        <header className="mb-12 sm:mb-16 pb-8 border-b border-border">
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-3">
            <span className="text-foreground font-semibold">// REVIEWS</span>
            <span>·</span>
            <span>SHARE YOUR COLLABORATIVE EXPERIENCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-5">
            Submit a Review or Testimonial
          </h1>

          <p className="text-secondary text-base sm:text-lg max-w-3xl leading-relaxed">
            If we have worked together on a web application, API system, or consulting engagement, please share your candid experience. Reviews are authenticated and approved before publication to ensure complete credibility.
          </p>
        </header>

        {/* Form Container / Success State */}
        <div className="max-w-2xl">
          {isSubmitted ? (
            <div className="border border-border bg-surface rounded-sm p-8 sm:p-12 animate-page-in">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-wider mb-4">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>SUBMISSION RECEIVED // PENDING APPROVAL</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-4">
                Thank You, {formData.name.trim()}
              </h2>

              <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
                {serverMessage}
              </p>

              <div className="p-4 bg-page border border-border rounded-sm text-xs font-mono text-muted mb-8 space-y-1">
                <div><span className="text-secondary">SUBMITTED AS:</span> {formData.name}</div>
                {formData.role && <div><span className="text-secondary">ROLE:</span> {formData.role}</div>}
                {formData.company && <div><span className="text-secondary">ORGANIZATION:</span> {formData.company}</div>}
                <div><span className="text-secondary">RELATIONSHIP:</span> {formData.relationship}</div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <Link
                  to="/#reviews"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page font-semibold rounded-sm hover:bg-secondary transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span>VIEW YOUR REVIEW ON HOMEPAGE</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormData({
                      name: '',
                      role: '',
                      company: '',
                      relationship: 'Client / Product Owner',
                      review: '',
                      project: '',
                      verificationUrl: '',
                      consentToPublish: false,
                      honeypot: '',
                    })
                  }}
                  className="px-4 py-2 border border-border text-secondary hover:text-foreground transition-colors rounded-sm"
                >
                  SUBMIT ANOTHER
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-8 animate-page-in">
              {/* Editorial Privacy Note */}
              <div className="flex items-start gap-3 p-4 bg-surface border border-border rounded-sm text-xs font-mono text-secondary">
                <Shield className="w-4 h-4 text-foreground shrink-0 mt-0.5" aria-hidden="true" />
                <p className="leading-relaxed">
                  Notice: Testimonials are reviewed by Ahmed prior to publication to prevent spam and verify authenticity. Your email is not published publicly.
                </p>
              </div>

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
                <div
                  role="alert"
                  className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono rounded-sm"
                >
                  {serverMessage}
                </div>
              )}

              {/* Name & Role Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono text-foreground font-semibold uppercase tracking-wider mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    maxLength={80}
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`w-full px-4 py-2.5 text-sm bg-surface border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors ${
                      errors.name ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-1.5 text-xs font-mono text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-xs font-mono text-foreground font-semibold uppercase tracking-wider mb-2">
                    Role / Position <span className="text-muted text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    id="role"
                    type="text"
                    maxLength={80}
                    placeholder="e.g. Head of Product, Co-Founder"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
                  />
                  {errors.role && (
                    <p role="alert" className="mt-1.5 text-xs font-mono text-red-500">
                      {errors.role}
                    </p>
                  )}
                </div>
              </div>

              {/* Company & Relationship Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-xs font-mono text-foreground font-semibold uppercase tracking-wider mb-2">
                    Company / Organization <span className="text-muted text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    maxLength={80}
                    placeholder="e.g. Amber Real Estate"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="relationship" className="block text-xs font-mono text-foreground font-semibold uppercase tracking-wider mb-2">
                    How Did We Work Together? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="relationship"
                    required
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
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
              </div>

              {/* Project Associated & Verification URL Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
                  />
                  <datalist id="projects-list">
                    {PROJECTS.map((p) => (
                      <option key={p.slug} value={p.title} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label htmlFor="verificationUrl" className="block text-xs font-mono text-foreground font-semibold uppercase tracking-wider mb-2">
                    LinkedIn / Website <span className="text-muted text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    id="verificationUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.verificationUrl}
                    onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
                    aria-invalid={Boolean(errors.verificationUrl)}
                    className={`w-full px-4 py-2.5 text-sm bg-surface border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors ${
                      errors.verificationUrl ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.verificationUrl && (
                    <p role="alert" className="mt-1.5 text-xs font-mono text-red-500">
                      {errors.verificationUrl}
                    </p>
                  )}
                </div>
              </div>

              {/* Review Textarea */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="review" className="text-xs font-mono text-foreground font-semibold uppercase tracking-wider">
                    Review / Testimonial <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-muted">
                    {formData.review.length} / 1000 CHARS
                  </span>
                </div>
                <textarea
                  id="review"
                  required
                  rows={5}
                  maxLength={1000}
                  placeholder="Share details regarding code quality, communication, technical execution, and project reliability..."
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  aria-invalid={Boolean(errors.review)}
                  aria-describedby={errors.review ? 'review-error' : undefined}
                  className={`w-full px-4 py-3 text-sm bg-surface border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors leading-relaxed ${
                    errors.review ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.review && (
                  <p id="review-error" role="alert" className="mt-1.5 text-xs font-mono text-red-500">
                    {errors.review}
                  </p>
                )}
              </div>

              {/* Consent to Publish Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consentToPublish}
                    onChange={(e) => setFormData({ ...formData, consentToPublish: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded-xs border-border text-foreground accent-foreground cursor-pointer"
                  />
                  <span className="text-xs text-secondary leading-normal">
                    I give Ahmed permission to publish this review, my name, role, and organization on his professional portfolio. <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.consentToPublish && (
                  <p role="alert" className="mt-1.5 text-xs font-mono text-red-500 pl-7">
                    {errors.consentToPublish}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-page text-xs sm:text-sm font-mono font-semibold rounded-sm hover:bg-secondary disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-page border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                      <span>SUBMITTING...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" aria-hidden="true" />
                      <span>SUBMIT REVIEW FOR MODERATION</span>
                    </>
                  )}
                </button>

                <span className="text-[10px] font-mono text-muted uppercase">
                  * REQUIRED FIELDS
                </span>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  )
}
