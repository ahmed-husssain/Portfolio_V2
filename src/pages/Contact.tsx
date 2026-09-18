import React, { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import Container from '../components/Container'
import Connect from '../components/Connect'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { CONTACT_CONFIG } from '../data/contact'
import {
  submitContactForm,
  validateContactForm,
  type ContactFormPayload,
  type FormValidationErrors,
  type ContactSubmissionResult,
} from '../lib/contact/contactService'

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export default function Contact() {
  useDocumentTitle('Contact — Ahmed | Full-Stack Web Developer')

  const [formData, setFormData] = useState<ContactFormPayload>({
    name: '',
    email: '',
    company: '',
    service: CONTACT_CONFIG.services[0],
    budget: CONTACT_CONFIG.budgetRanges[0],
    message: '',
    website: '', // Honeypot trap
  })

  const [errors, setErrors] = useState<FormValidationErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<ContactSubmissionResult | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_CONFIG.email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error on active typing
    if (errors[name as keyof FormValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    // Validate
    const validationErrors = validateContactForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)

    try {
      const result = await submitContactForm(formData)
      setSubmissionResult(result)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting your message.'
      setGeneralError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      service: CONTACT_CONFIG.services[0],
      budget: CONTACT_CONFIG.budgetRanges[0],
      message: '',
      website: '',
    })
    setErrors({})
    setSubmissionResult(null)
    setGeneralError(null)
  }

  return (
    <div className="pt-16 sm:pt-24 md:pt-32 pb-8 sm:pb-12">
      <Container>
        {/* ─── 1. Editorial Page Header ─── */}
        <header className="mb-14 sm:mb-20 pb-8 border-b border-border">
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-3">
            <span className="text-foreground font-semibold">// INITIATE CONTACT</span>
            <span>·</span>
            <span>DIRECT DIALOGUE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-5">
            Let's build something useful.
          </h1>

          <p className="text-secondary text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
            I collaborate with founders, engineering teams, and companies on web applications, backend APIs, relational database schemas, and performance optimizations. Feel free to reach out directly or use the inquiry form below.
          </p>
        </header>

        {/* ─── 2. Main Two-Column Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* ─── Left Column: Contact Form ─── */}
          <div className="lg:col-span-7">
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 md:p-10">
              <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-border text-xs font-mono text-muted">
                <span className="text-foreground font-semibold uppercase tracking-wider">
                  // PROJECT INQUIRY FORM
                </span>
                <span className="text-[11px] text-secondary">REQUIRED FIELDS MARKED *</span>
              </div>

              {/* Form Guidance Microcopy */}
              <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-8 bg-page border border-border rounded-sm p-4">
                Tell me what you're building, what problem you're trying to solve, and where you are in the process.
              </p>

              {/* General Submission Error Banner */}
              {generalError && (
                <div
                  role="alert"
                  className="p-4 mb-6 border border-border bg-page text-foreground text-xs sm:text-sm rounded-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-foreground shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{generalError}</span>
                </div>
              )}

              {/* Submission Result / Success View */}
              {submissionResult ? (
                <div className="py-6 space-y-6 animate-page-in">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 border-b border-border">
                    <ShieldCheck className="w-4 h-4 text-foreground" aria-hidden="true" />
                    <span className="text-foreground font-semibold">
                      {submissionResult.mode === 'delivered'
                        ? 'TRANSMISSION CONFIRMED'
                        : 'INQUIRY PREPARED (LOCAL MODE)'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                    {submissionResult.mode === 'delivered'
                      ? 'Thank you for reaching out.'
                      : 'Inquiry details recorded.'}
                  </h2>

                  <p className="text-secondary text-sm sm:text-base leading-relaxed">
                    {submissionResult.mode === 'delivered'
                      ? 'I will review your project requirements and respond promptly.'
                      : 'This portfolio currently operates in static mode without an external third-party email provider configured. To ensure your message arrives immediately, you can launch your email client with your prefilled inquiry below.'}
                  </p>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    {submissionResult.mailtoFallbackUrl && (
                      <a
                        href={submissionResult.mailtoFallbackUrl}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page text-xs font-mono font-semibold uppercase tracking-wider rounded-sm hover:bg-secondary transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>OPEN IN MAIL CLIENT</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-page text-foreground text-xs font-mono font-semibold uppercase tracking-wider rounded-sm hover:border-border-strong transition-colors"
                    >
                      <span>SEND ANOTHER MESSAGE</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-6 animate-page-in">
                  {/* Honeypot Spam Trap (Hidden from sighted users and screen readers) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-mono text-foreground font-medium uppercase tracking-wider mb-2"
                      >
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        disabled={submitting}
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Morgan"
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={`w-full px-3.5 py-2.5 bg-page border text-sm font-mono text-foreground placeholder:text-muted rounded-sm transition-colors focus:outline-none focus:border-foreground disabled:opacity-50 ${
                          errors.name ? 'border-foreground' : 'border-border'
                        }`}
                      />
                      {errors.name && (
                        <p id="name-error" role="alert" className="mt-1.5 text-xs font-mono text-secondary">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-mono text-foreground font-medium uppercase tracking-wider mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        disabled={submitting}
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. alex@company.com"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`w-full px-3.5 py-2.5 bg-page border text-sm font-mono text-foreground placeholder:text-muted rounded-sm transition-colors focus:outline-none focus:border-foreground disabled:opacity-50 ${
                          errors.email ? 'border-foreground' : 'border-border'
                        }`}
                      />
                      {errors.email && (
                        <p id="email-error" role="alert" className="mt-1.5 text-xs font-mono text-secondary">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Company / Project (Optional) */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-xs font-mono text-foreground font-medium uppercase tracking-wider mb-2"
                    >
                      Company / Organization <span className="text-muted text-[10px]">(OPTIONAL)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      disabled={submitting}
                      autoComplete="organization"
                      value={formData.company || ''}
                      onChange={handleChange}
                      placeholder="e.g. TechCorp or Stealth Startup"
                      className="w-full px-3.5 py-2.5 bg-page border border-border text-sm font-mono text-foreground placeholder:text-muted rounded-sm transition-colors focus:outline-none focus:border-foreground disabled:opacity-50"
                    />
                  </div>

                  {/* Row 3: Service Area & Budget Bracket */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Service / Focus */}
                    <div>
                      <label
                        htmlFor="service"
                        className="block text-xs font-mono text-foreground font-medium uppercase tracking-wider mb-2"
                      >
                        Area of Focus
                      </label>
                      <select
                        id="service"
                        name="service"
                        disabled={submitting}
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-page border border-border text-xs sm:text-sm font-mono text-foreground rounded-sm transition-colors focus:outline-none focus:border-foreground disabled:opacity-50 cursor-pointer"
                      >
                        {CONTACT_CONFIG.services.map((item) => (
                          <option key={item} value={item} className="bg-surface text-foreground">
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Budget / Engagement Bracket */}
                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-xs font-mono text-foreground font-medium uppercase tracking-wider mb-2"
                      >
                        Target Scope / Budget
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        disabled={submitting}
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-page border border-border text-xs sm:text-sm font-mono text-foreground rounded-sm transition-colors focus:outline-none focus:border-foreground disabled:opacity-50 cursor-pointer"
                      >
                        {CONTACT_CONFIG.budgetRanges.map((range) => (
                          <option key={range} value={range} className="bg-surface text-foreground">
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Message / What do you need? */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-mono text-foreground font-medium uppercase tracking-wider mb-2"
                    >
                      What do you need? *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      disabled={submitting}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe what you are building, key technical challenges, or the scope of your project..."
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-page border text-sm font-mono text-foreground placeholder:text-muted rounded-sm transition-colors focus:outline-none focus:border-foreground disabled:opacity-50 leading-relaxed resize-y ${
                        errors.message ? 'border-foreground' : 'border-border'
                      }`}
                    />
                    {errors.message && (
                      <p id="message-error" role="alert" className="mt-1.5 text-xs font-mono text-secondary">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Action */}
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-[11px] font-mono text-muted">
                      No marketing newsletters or automated spam.
                    </p>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-page text-xs font-mono font-semibold uppercase tracking-wider rounded-sm hover:bg-secondary transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-page border-t-transparent rounded-full animate-spin" />
                          <span>PROCESSING...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND INQUIRY</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ─── Right Column: Direct Channels & Logistics ─── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Email Card */}
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-4 border-b border-border">
                <Mail className="w-4 h-4 text-foreground" aria-hidden="true" />
                <span className="text-foreground font-semibold">PRIMARY DIRECT CHANNEL</span>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-2">
                Direct Email
              </h2>

              <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-6">
                For detailed project briefs, architectural discussions, or full-time opportunities, email is always available.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <a
                  href={`mailto:${CONTACT_CONFIG.email}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground text-page text-xs font-mono font-semibold rounded-sm hover:bg-secondary transition-colors"
                >
                  <span>{CONTACT_CONFIG.email.toUpperCase()}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title="Copy email address"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 border border-border bg-page text-foreground text-xs font-mono rounded-sm hover:border-border-strong transition-colors"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-foreground" />
                      <span className="text-[11px]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-muted" />
                      <span className="text-[11px]">COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Professional Profiles */}
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-5 border-b border-border">
                <span className="text-foreground font-semibold">// PROFESSIONAL LINKS</span>
              </div>

              <div className="space-y-4">
                <a
                  href={CONTACT_CONFIG.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-border bg-page hover:border-border-strong rounded-sm transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <GithubIcon className="w-5 h-5 text-foreground" />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground block">
                        GitHub Profile
                      </span>
                      <span className="text-[11px] font-mono text-secondary">
                        {CONTACT_CONFIG.github.handle} · Code, Repos & Architecture
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" aria-hidden="true" />
                </a>

                <a
                  href={CONTACT_CONFIG.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-border bg-page hover:border-border-strong rounded-sm transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center font-bold text-sm text-foreground">in</span>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground block">
                        LinkedIn Profile
                      </span>
                      <span className="text-[11px] font-mono text-secondary">
                        {CONTACT_CONFIG.linkedin.handle} · Experience & Network
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Operational Details & Availability */}
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-5 border-b border-border">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="text-foreground font-semibold">{CONTACT_CONFIG.availability.status}</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">LOCATION</span>
                    <span className="text-foreground font-medium">
                      {CONTACT_CONFIG.location.city}, {CONTACT_CONFIG.location.country}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">TIMEZONE</span>
                    <span className="text-foreground font-medium">{CONTACT_CONFIG.location.timezone}</span>
                    <span className="text-secondary block text-[11px] mt-0.5">
                      {CONTACT_CONFIG.location.timezoneNote}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Guidelines */}
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8">
              <div className="text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-4 border-b border-border">
                <span className="text-foreground font-semibold">// ENGAGEMENT GUIDELINES</span>
              </div>

              <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-4">
                To make our initial conversation as productive as possible, having clarity on these points is helpful:
              </p>

              <ul className="space-y-2 text-xs font-mono text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" aria-hidden="true" />
                  <span>Brief project overview or problem description</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" aria-hidden="true" />
                  <span>Existing stack or preferred technologies</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" aria-hidden="true" />
                  <span>Target launch timeline and engagement scope</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Minimal Connect System */}
        <Connect withContainer={false} className="mt-12 sm:mt-16" />
      </Container>
    </div>
  )
}
