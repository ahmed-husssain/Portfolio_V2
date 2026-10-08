export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type VerificationType = 'linkedin' | 'github' | 'institution' | 'client'

export interface Review {
  id: string
  name: string
  role?: string
  company?: string
  relationship: string
  review: string
  project?: string
  projectSlug?: string
  verificationUrl?: string
  verificationType?: VerificationType
  avatar?: string
  deliverables?: string[]
  highlightMetric?: string
  status: ReviewStatus
  consentToPublish: boolean
  createdAt: string
  isLocalSubmission?: boolean
}

/**
 * Central Reviews & Endorsements Store
 * 
 * Strict Editorial & Trust Policy:
 * 1. Reviews are tied directly to documented engineering projects and competitions.
 * 2. Reviewers feature verified institutional or professional profile links.
 * 3. Testimonials emphasize technical deliverables, data modeling, and performance wins.
 */
export const REVIEWS: Review[] = [
  {
    id: 'rev-shifamanagement-healthcare',
    name: 'Asad',
    role: 'Owner',
    company: 'ShifaHomeHealthCare',
    relationship: 'Client / Product Owner',
    project: 'ShifaManagement',
    projectSlug: 'shifamanagement',
    verificationType: 'client',
    verificationUrl: 'https://shifahomehealthcare.org/',
    avatar: '/projects/shifamanagement/shifa-logo.jpg',
    deliverables: [
      '3-Month Project Delivery',
      'Clinical Intake & Billing Engine',
      '14-Day Care Plan Renewals',
    ],
    highlightMetric: '3-Month Delivery · Zero Billing Errors',
    review:
      'Ahmed built our clinical operations and billing system in 3 months. The automated invoicing and patient care renewal workflows run smoothly without any duplication issues. Reliable developer who communicates clearly and delivers on time.',
    status: 'approved',
    consentToPublish: true,
    createdAt: '2026-10-08',
  },
]

