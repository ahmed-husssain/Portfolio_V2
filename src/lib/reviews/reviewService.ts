import { REVIEWS, type Review } from '../../data/reviews'

export interface ReviewSubmissionInput {
  name: string
  role?: string
  company?: string
  relationship: string
  review: string
  project?: string
  verificationUrl?: string
  consentToPublish: boolean
  honeypot?: string // Hidden spam trap field
}

export interface ReviewSubmissionResult {
  success: boolean
  message: string
  errors?: Record<string, string>
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
 * Retrieves all approved reviews for public display.
 * Strict filter: only reviews with status === 'approved' are returned.
 */
export function getApprovedReviews(): Review[] {
  return REVIEWS.filter((review) => review.status === 'approved')
}

/**
 * Submits a new review through the extensible service layer.
 * 
 * Note: Since this is a static frontend portfolio without a persistent database,
 * this function performs strict client validation and simulates the network dispatch.
 * It is architected so an external submission provider (e.g., Formspree, Resend, or serverless endpoint)
 * can be plugged in here without altering any UI components.
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

  // Simulate network dispatch latency
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (import.meta.env.DEV) {
    console.info('[ReviewService] Received review submission (pending moderation):', {
      name: input.name.trim(),
      role: input.role?.trim(),
      company: input.company?.trim(),
      relationship: input.relationship.trim(),
      project: input.project?.trim(),
      verificationUrl: input.verificationUrl?.trim(),
      review: input.review.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
  }

  return {
    success: true,
    message:
      'Thank you for submitting your feedback! Your review has been received and will be reviewed by Ahmed before publication.',
  }
}
