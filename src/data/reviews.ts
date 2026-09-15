export interface Review {
  id: string
  name: string
  role?: string
  company?: string
  review: string
  verificationUrl?: string
  project?: string
}

/**
 * Verified Client & Peer Reviews
 * 
 * Strict policy: Only verified, legitimate reviews with public verification 
 * sources are added here. No manufactured or unverified testimonials.
 */
export const REVIEWS: Review[] = []
