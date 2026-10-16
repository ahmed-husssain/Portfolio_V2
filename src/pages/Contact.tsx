import React, { useState } from 'react'
import {
  ExternalLink,
  Mail,
  Send,
  Shield,
  FileText,
  Github,
} from 'pixelarticons/react'
import Container from '../components/ui/Container'
import Connect from '../components/Connect'
import CustomDropdown from '../components/form/CustomDropdown'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import CopyButton from '../components/ui/CopyButton'
import FormField from '../components/form/FormField'
import FormAlert from '../components/form/FormAlert'
import SubmitButton from '../components/form/SubmitButton'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { CONTACT_CONFIG } from '../data/contact'
import {
  submitContactForm,
  validateContactForm,
  type ContactFormPayload,
  type FormValidationErrors,
  type ContactSubmissionResult,
} from '../lib/contact/contactService'

export default function Contact() {
  useDocumentTitle('Contact & Hire — Syed Ahmed Hussain | Software Developer in Karachi')

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
    <div className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
      <Container>
        {/* ─── 1. Editorial Page Header ─── */}
        <PageHeader
          className="mb-8 sm:mb-12 pb-6 border-b border-border"
          titleSize="display"
          eyebrow={
            <>
              <span className="text-foreground font-semibold shrink-0">// INITIATE CONTACT</span>
              <span className="text-border-strong shrink-0" aria-hidden="true">·</span>
              <Badge variant="status">AVAILABLE FOR ROLES</Badge>
            </>
          }
          metaRight={
            <>
              <span>{CONTACT_CONFIG.location.city}, {CONTACT_CONFIG.location.country}</span>
              <span className="text-border-strong" aria-hidden="true">·</span>
              <span>PKT (UTC+5)</span>
            </>
          }
          title="Let's build something useful."
          description="Scalable backend APIs, relational database schemas, and modern web applications. Feel free to reach out directly by email or use the inquiry form below."
        />

        {/* ─── 2. Main Two-Column Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* ─── Left Column: Contact Form ─── */}
          <div className="lg:col-span-7">
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 md:p-10 pixel-corners">
              {/* Form Telemetry Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-border text-xs font-mono text-muted">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="pixel-beacon bg-emerald-500 shrink-0" aria-hidden="true" />
                  <span className="text-foreground font-semibold uppercase tracking-wider truncate">
                    // PROJECT INQUIRY
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] shrink-0">
                  <span className="text-muted">ROUTE:</span>
                  <span className="text-foreground font-semibold">DIRECT INBOX</span>
                  <span className="text-border-strong" aria-hidden="true">|</span>
                  <span className="text-muted">SLA:</span>
                  <span className="text-foreground font-semibold">&lt; 24H</span>
                </div>
              </div>

              {/* Form Guidance Microcopy */}
              <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-8 bg-page border border-border rounded-sm p-4 pixel-corners">
                Tell me what you're building, key technical requirements, and your target timeline. All inquiries route directly to Ahmed Hussain.
              </p>

              {/* General Submission Error Banner */}
              {generalError && <FormAlert>{generalError}</FormAlert>}

              {/* Submission Result / Success View */}
              {submissionResult ? (
                <div className="py-6 space-y-6 animate-page-in">
                  <div className="flex items-center justify-between gap-3 text-xs font-mono text-muted uppercase tracking-wider pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-500 pixel-icon" aria-hidden="true" />
                      <span className="text-foreground font-semibold">
                        {submissionResult.mode === 'delivered'
                          ? 'TRANSMISSION CONFIRMED // DELIVERED'
                          : 'INQUIRY PREPARED // CLIENT FALLBACK'}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted font-mono">
                      [ {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} PKT ]
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                    {submissionResult.mode === 'delivered'
                      ? `Thank you for reaching out, ${formData.name.trim()}.`
                      : 'Inquiry details recorded.'}
                  </h2>

                  <p className="text-secondary text-sm sm:text-base leading-relaxed">
                    {submissionResult.message}
                  </p>

                  {/* Summary Record */}
                  <div className="p-4 bg-page border border-border rounded-sm text-xs font-mono text-muted space-y-1.5 pixel-corners">
                    <div><span className="text-secondary">SENDER:</span> {formData.name} &lt;{formData.email}&gt;</div>
                    {formData.company && <div><span className="text-secondary">ORGANIZATION:</span> {formData.company}</div>}
                    <div><span className="text-secondary">AREA OF FOCUS:</span> {formData.service}</div>
                    <div><span className="text-secondary">TARGET SCOPE:</span> {formData.budget}</div>
                    <div><span className="text-secondary">STATUS:</span> {submissionResult.mode === 'delivered' ? 'DELIVERED TO INBOX' : 'READY FOR MAIL CLIENT'}</div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    {submissionResult.mailtoFallbackUrl && (
                      <a
                        href={submissionResult.mailtoFallbackUrl}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-page text-xs font-mono font-semibold uppercase tracking-wider rounded-sm hover:bg-secondary active:scale-[0.98] transition-all group"
                      >
                        <Send className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
                        <span>LAUNCH MAIL CLIENT</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-page text-foreground text-xs font-mono font-semibold uppercase tracking-wider rounded-sm hover:border-border-strong active:scale-[0.98] transition-all cursor-pointer"
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
                    <FormField id="name" label="Your Name" required error={errors.name}>
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
                        className={`w-full min-h-[44px] px-3.5 py-2.5 bg-page border text-base sm:text-sm font-mono text-foreground placeholder:text-muted rounded-sm transition-all duration-150 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 disabled:opacity-50 ${
                          errors.name ? 'border-foreground ring-1 ring-foreground/20' : 'border-border hover:border-border-strong'
                        }`}
                      />
                    </FormField>

                    <FormField id="email" label="Email Address" required error={errors.email}>
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
                        className={`w-full min-h-[44px] px-3.5 py-2.5 bg-page border text-base sm:text-sm font-mono text-foreground placeholder:text-muted rounded-sm transition-all duration-150 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 disabled:opacity-50 ${
                          errors.email ? 'border-foreground ring-1 ring-foreground/20' : 'border-border hover:border-border-strong'
                        }`}
                      />
                    </FormField>
                  </div>

                  {/* Row 2: Company / Project (Optional) */}
                  <FormField
                    id="company"
                    label="Company / Organization"
                    counter={<span className="text-muted text-[10px]">(OPTIONAL)</span>}
                  >
                    <input
                      type="text"
                      id="company"
                      name="company"
                      disabled={submitting}
                      autoComplete="organization"
                      value={formData.company || ''}
                      onChange={handleChange}
                      placeholder="e.g. TechCorp or Stealth Startup"
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-page border border-border hover:border-border-strong text-base sm:text-sm font-mono text-foreground placeholder:text-muted rounded-sm transition-all duration-150 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 disabled:opacity-50"
                    />
                  </FormField>

                  {/* Row 3: Custom Technical Dropdowns for Service Area & Budget Bracket */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <CustomDropdown
                      id="service-dropdown"
                      label="Area of Focus"
                      options={CONTACT_CONFIG.services}
                      value={formData.service || CONTACT_CONFIG.services[0]}
                      onChange={(val) => setFormData((prev) => ({ ...prev, service: val }))}
                      disabled={submitting}
                    />

                    <CustomDropdown
                      id="budget-dropdown"
                      label="Target Scope / Budget"
                      options={CONTACT_CONFIG.budgetRanges}
                      value={formData.budget || CONTACT_CONFIG.budgetRanges[0]}
                      onChange={(val) => setFormData((prev) => ({ ...prev, budget: val }))}
                      disabled={submitting}
                    />
                  </div>

                  {/* Row 4: Message / What do you need? */}
                  <FormField
                    id="message"
                    label="What do you need?"
                    required
                    error={errors.message}
                    counter={
                      <span
                        className={`text-[11px] font-mono transition-colors ${
                          formData.message.trim().length >= 10 ? 'text-secondary' : 'text-muted'
                        }`}
                      >
                        {formData.message.length} / 1500 chars
                        {formData.message.trim().length >= 10 && ' · [ READY ]'}
                      </span>
                    }
                  >
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      maxLength={1500}
                      disabled={submitting}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe what you are building, key technical challenges, or the scope of your project..."
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-page border text-base sm:text-sm font-mono text-foreground placeholder:text-muted rounded-sm transition-all duration-150 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 disabled:opacity-50 leading-relaxed resize-y min-h-[120px] ${
                        errors.message ? 'border-foreground ring-1 ring-foreground/20' : 'border-border hover:border-border-strong'
                      }`}
                    />
                  </FormField>

                  {/* Submit Action */}
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-[11px] font-mono text-muted">
                      Direct delivery · No third-party marketing lists.
                    </p>

                    <SubmitButton
                      loading={submitting}
                      label="TRANSMIT INQUIRY"
                      loadingLabel="TRANSMITTING TO INBOX..."
                    />
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ─── Right Column: Direct Channels & Logistics ─── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Email Card */}
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 pixel-corners">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-4 border-b border-border">
                <Mail className="w-4 h-4 text-foreground pixel-icon" aria-hidden="true" />
                <span className="text-foreground font-semibold">PRIMARY DIRECT CHANNEL</span>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-2">
                Direct Email
              </h2>

              <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-6">
                For detailed project briefs, architectural discussions, or full-time opportunities, email is always available.
              </p>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${CONTACT_CONFIG.email}`}
                  className="flex-1 min-w-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground text-page text-xs font-mono font-semibold rounded-sm hover:bg-secondary transition-colors overflow-hidden group"
                >
                  <span className="truncate">{CONTACT_CONFIG.email.toUpperCase()}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 pixel-icon transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>

                <CopyButton
                  text={CONTACT_CONFIG.email}
                  title="Copy email address"
                />
              </div>
            </div>

            {/* Professional Profiles */}
            <div className="border border-border bg-surface rounded-sm p-6 sm:p-8 pixel-corners">
              <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider pb-3 mb-5 border-b border-border">
                <span className="text-foreground font-semibold">// PROFESSIONAL LINKS</span>
              </div>

              <div className="space-y-4">
                <a
                  href={CONTACT_CONFIG.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-border bg-page hover:border-border-strong rounded-sm transition-all duration-200 group pixel-corners"
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-foreground pixel-icon" />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground block">
                        GitHub Profile
                      </span>
                      <span className="text-[11px] font-mono text-secondary">
                        {CONTACT_CONFIG.github.handle} · Code, Repos & Architecture
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted group-hover:text-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 pixel-icon" aria-hidden="true" />
                </a>

                <a
                  href={CONTACT_CONFIG.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-border bg-page hover:border-border-strong rounded-sm transition-all duration-200 group pixel-corners"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center font-bold text-sm text-foreground font-mono">in</span>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground block">
                        LinkedIn Profile
                      </span>
                      <span className="text-[11px] font-mono text-secondary">
                        {CONTACT_CONFIG.linkedin.handle} · Experience & Network
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted group-hover:text-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 pixel-icon" aria-hidden="true" />
                </a>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-border bg-page hover:border-border-strong rounded-sm transition-all duration-200 group pixel-corners"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-500 pixel-icon" />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground block">
                        Official Resume (PDF)
                      </span>
                      <span className="text-[11px] font-mono text-secondary">
                        Technical skills, projects, and certifications
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted group-hover:text-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 pixel-icon" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Connect System */}
        <Connect withContainer={false} className="mt-12 sm:mt-16" />
      </Container>
    </div>
  )
}
