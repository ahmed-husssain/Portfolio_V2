import { REVIEWS, type Review } from '../../data/reviews'

export interface ReviewSubmissionInput {
  name: string
  email?: string
  role?: string
  company?: string
  relationship: string
  review: string
  project?: string
  projectSlug?: string
  verificationUrl?: string
  consentToPublish: boolean
  honeypot?: string // Hidden spam trap field
}

export interface ReviewSubmissionResult {
  success: boolean
  message: string
  errors?: Record<string, string>
  submittedReview?: Review
}

const LOCAL_STORAGE_KEY = 'portfolio_user_reviews'

/**
 * Normalizes URLs so users can type 'linkedin.com/in/user' without an explicit protocol.
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`
  }
  return trimmed
}

/**
 * Validates the review submission against length, required fields, and spam checks.
 */
export function validateReviewInput(input: ReviewSubmissionInput): Record<string, string> {
  const errors: Record<string, string> = {}

  // 1. Honeypot check (must be empty)
  if (input.honeypot && input.honeypot.trim().length > 0) {
    errors.honeypot = 'Automated submission detected.'
    return errors
  }

  // 2. Name validation
  const trimmedName = input.name.trim()
  if (!trimmedName) {
    errors.name = 'Please provide your full name.'
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  } else if (trimmedName.length > 80) {
    errors.name = 'Name cannot exceed 80 characters.'
  }

  // 3. Email validation (optional)
  if (input.email && input.email.trim().length > 0) {
    const emailTrimmed = input.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address.'
    }
  }

  // 4. Relationship validation
  const trimmedRelationship = input.relationship.trim()
  if (!trimmedRelationship) {
    errors.relationship = 'Please describe how we worked together.'
  } else if (trimmedRelationship.length < 2) {
    errors.relationship = 'Relationship context is too short.'
  } else if (trimmedRelationship.length > 100) {
    errors.relationship = 'Relationship context cannot exceed 100 characters.'
  }

  // 5. Review content validation
  const trimmedReview = input.review.trim()
  if (!trimmedReview) {
    errors.review = 'Please write your review.'
  } else if (trimmedReview.length < 20) {
    errors.review = 'Review should be at least 20 characters.'
  } else if (trimmedReview.length > 1000) {
    errors.review = 'Review cannot exceed 1,000 characters.'
  }

  // 6. Verification URL validation (optional, with auto-normalization)
  if (input.verificationUrl && input.verificationUrl.trim().length > 0) {
    const normalized = normalizeUrl(input.verificationUrl)
    try {
      const parsed = new URL(normalized)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        errors.verificationUrl = 'URL must be a valid web link.'
      }
    } catch {
      errors.verificationUrl = 'Please enter a valid website or profile URL.'
    }
  }

  // 7. Optional text lengths
  if (input.role && input.role.trim().length > 80) {
    errors.role = 'Role cannot exceed 80 characters.'
  }
  if (input.company && input.company.trim().length > 80) {
    errors.company = 'Company cannot exceed 80 characters.'
  }

  return errors
}

/**
 * Dispatches the review submission directly to Ahmed's inbox via FormSubmit API.
 */
async function sendToInbox(input: ReviewSubmissionInput): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const payload = {
      _subject: `New Portfolio Review from ${input.name}`,
      _template: 'table',
      _captcha: 'false',
      name: input.name.trim(),
      email: input.email?.trim() || 'Not provided',
      role: input.role?.trim() || 'Not provided',
      company: input.company?.trim() || 'Not provided',
      relationship: input.relationship.trim(),
      project: input.project?.trim() || 'General / Unspecified',
      verificationUrl: input.verificationUrl?.trim() || 'Not provided',
      review: input.review.trim(),
      consentToPublish: input.consentToPublish ? 'Yes' : 'No',
    }

    const res = await fetch('https://formsubmit.co/ajax/ahmedhusssain.dev@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return res.ok
  } catch (err) {
    console.warn('[ReviewService] Remote dispatch encountered network error, falling back to local storage:', err)
    return false
  }
}

/**
 * Creates a prefilled mailto URL for direct manual email submission.
 */
export function createReviewMailtoUrl(input: ReviewSubmissionInput): string {
  const subject = encodeURIComponent(`Portfolio Review: ${input.name}${input.company ? ` (${input.company})` : ''}`)
  const body = encodeURIComponent(
`Hi Ahmed,

Here is my testimonial for your portfolio:

Name: ${input.name}
${input.email ? `Email: ${input.email}\n` : ''}${input.role ? `Role: ${input.role}\n` : ''}${input.company ? `Company: ${input.company}\n` : ''}Relationship: ${input.relationship}
${input.project ? `Project: ${input.project}\n` : ''}${input.verificationUrl ? `Profile/Website: ${input.verificationUrl}\n` : ''}
Review:
${input.review}

Permission to publish: ${input.consentToPublish ? 'Yes' : 'No'}
`
  )
  return `mailto:ahmedhusssain.dev@gmail.com?subject=${subject}&body=${body}`
}

/**
 * Retrieves reviews saved locally in browser storage for instant visitor feedback.
 */
export function getLocalReviews(): Review[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Review[]
  } catch {
    return []
  }
}

/**
 * Saves a review to local storage for the current browser session.
 */
export function saveLocalReview(review: Review): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getLocalReviews()
    const updated = [review, ...existing.filter((r) => r.id !== review.id)]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn('[ReviewService] Failed to persist review to localStorage', err)
  }
}

/**
 * Clears a specific local review from browser storage.
 */
export function deleteLocalReview(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getLocalReviews()
    const updated = existing.filter((r) => r.id !== id)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

/**
 * Retrieves all reviews for public display.
 * Includes verified seed reviews and any reviews submitted in this browser session.
 */
export function getApprovedReviews(includeLocal = true): Review[] {
  const verified = REVIEWS.filter((review) => review.status === 'approved')
  if (!includeLocal) return verified

  const local = getLocalReviews()
  return [...local, ...verified]
}

/**
 * Submits a new review:
 * 1. Validates inputs
 * 2. Dispatches real email notification to Ahmed's inbox via FormSubmit API
 * 3. Persists to visitor's local storage for immediate preview
 */
export async function submitReview(input: ReviewSubmissionInput): Promise<ReviewSubmissionResult> {
  const errors = validateReviewInput(input)

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please resolve the highlighted validation errors.',
      errors,
    }
  }

  // Attempt real remote dispatch to Ahmed's inbox
  const sentRemote = await sendToInbox(input)

  const normalizedUrl = input.verificationUrl ? normalizeUrl(input.verificationUrl) : undefined

  const newReview: Review = {
    id: `local-sub-${Date.now()}`,
    name: input.name.trim(),
    role: input.role?.trim(),
    company: input.company?.trim(),
    relationship: input.relationship.trim(),
    project: input.project?.trim(),
    projectSlug: input.projectSlug?.trim(),
    verificationUrl: normalizedUrl,
    verificationType: normalizedUrl?.includes('linkedin')
      ? 'linkedin'
      : normalizedUrl?.includes('github')
        ? 'github'
        : 'client',
    deliverables: input.project ? [`Delivered: ${input.project}`] : undefined,
    highlightMetric: 'Recent Visitor Submission',
    review: input.review.trim(),
    status: 'pending',
    consentToPublish: input.consentToPublish,
    createdAt: new Date().toISOString().split('T')[0],
    isLocalSubmission: true,
  }

  saveLocalReview(newReview)

  if (import.meta.env.DEV) {
    console.info('[ReviewService] Review persisted and dispatched:', { sentRemote, newReview })
  }

  return {
    success: true,
    message: sentRemote
      ? 'Your review has been sent directly to Ahmed for verification and saved to your local preview.'
      : 'Your review has been saved to your local preview. You can also send it directly via email or LinkedIn.',
    submittedReview: newReview,
  }
}
