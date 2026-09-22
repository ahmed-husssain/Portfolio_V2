import { REVIEWS, type Review } from '../../data/reviews'

export interface ReviewSubmissionInput {
  name: string
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

  // 3. Relationship validation
  const trimmedRelationship = input.relationship.trim()
  if (!trimmedRelationship) {
    errors.relationship = 'Please describe how we worked together.'
  } else if (trimmedRelationship.length < 2) {
    errors.relationship = 'Relationship context is too short.'
  } else if (trimmedRelationship.length > 100) {
    errors.relationship = 'Relationship context cannot exceed 100 characters.'
  }

  // 4. Review content validation
  const trimmedReview = input.review.trim()
  if (!trimmedReview) {
    errors.review = 'Please write your review.'
  } else if (trimmedReview.length < 20) {
    errors.review = 'Review should be at least 20 characters.'
  } else if (trimmedReview.length > 1000) {
    errors.review = 'Review cannot exceed 1,000 characters.'
  }

  // 5. Verification URL validation (optional)
  if (input.verificationUrl && input.verificationUrl.trim().length > 0) {
    const url = input.verificationUrl.trim()
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        errors.verificationUrl = 'URL must begin with http:// or https://'
      }
    } catch {
      errors.verificationUrl = 'Please enter a valid website or profile URL.'
    }
  }

  // 6. Optional text lengths
  if (input.role && input.role.trim().length > 80) {
    errors.role = 'Role cannot exceed 80 characters.'
  }
  if (input.company && input.company.trim().length > 80) {
    errors.company = 'Company cannot exceed 80 characters.'
  }

  // 7. Consent validation
  if (!input.consentToPublish) {
    errors.consentToPublish = 'Your consent is required before publishing.'
  }

  return errors
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
    // Avoid duplicate IDs
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
 * Submits a new review through the service layer and saves it to local storage.
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

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newReview: Review = {
    id: `local-sub-${Date.now()}`,
    name: input.name.trim(),
    role: input.role?.trim(),
    company: input.company?.trim(),
    relationship: input.relationship.trim(),
    project: input.project?.trim(),
    projectSlug: input.projectSlug?.trim(),
    verificationUrl: input.verificationUrl?.trim(),
    verificationType: input.verificationUrl?.includes('linkedin')
      ? 'linkedin'
      : input.verificationUrl?.includes('github')
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
    console.info('[ReviewService] Review persisted to local storage:', newReview)
  }

  return {
    success: true,
    message:
      'Thank you for submitting your feedback! Your review has been saved locally and queued for verification.',
    submittedReview: newReview,
  }
}
