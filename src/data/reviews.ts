export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Review {
  id: string
  name: string
  role?: string
  company?: string
  relationship: string
  review: string
  project?: string
  verificationUrl?: string
  status: ReviewStatus
  consentToPublish: boolean
  createdAt: string
}

/**
 * Central Reviews Store
 * 
 * Strict Editorial Policy:
 * 1. Only verified reviews with express consent are approved.
 * 2. Unverified or pending submissions are never published publicly.
 * 3. Zero fabricated testimonials or synthetic credentials.
 */
export const REVIEWS: Review[] = [
  // Awaiting verified client and peer testimonials from production engagements.
]
