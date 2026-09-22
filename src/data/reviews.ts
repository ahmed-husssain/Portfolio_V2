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
    id: 'rev-mockrithm-aptech-2025',
    name: 'Syed Hamza',
    role: 'Project Evaluator & Mentor',
    company: 'Aptech Vision 2025',
    relationship: 'Competition Project Mentor & Jury',
    project: 'Mockrithm (AI Interview Platform)',
    projectSlug: 'mockrithm',
    verificationType: 'institution',
    verificationUrl: 'https://www.linkedin.com',
    deliverables: [
      'Speech Pacing Analysis Engine',
      'Real-Time Code Evaluation Pipeline',
      'Next.js & Firebase Architecture',
    ],
    highlightMetric: 'Runner-Up Award — Aptech Vision 2025',
    review:
      'Ahmed served as the technical anchor for Mockrithm at Aptech Vision 2025. His implementation of real-time conversational audio processing and in-browser code evaluation under tight deadlines impressed the panel. His architectural discipline and execution earned the project Runner-Up across multiple competing teams.',
    status: 'approved',
    consentToPublish: true,
    createdAt: '2025-02-15',
  },
  {
    id: 'rev-gallrex-art-gallery',
    name: 'Fahad Mansoor',
    role: 'Product Stakeholder & Founder',
    company: 'Gallrex Digital Arts',
    relationship: 'Client / Product Owner',
    project: 'Online Art Gallery & Auction Engine',
    projectSlug: 'online-art-gallery',
    verificationType: 'linkedin',
    verificationUrl: 'https://www.linkedin.com',
    deliverables: [
      'ASP.NET Core MVC Backend',
      'SQL Server Relational Schema',
      'Multi-Provider OAuth 2.0 Auth',
      'Bidding Concurrency Engine',
    ],
    highlightMetric: '100% Relational Data Integrity on Bids',
    review:
      'Ahmed engineered the backend architecture for our digital art marketplace from the ground up using ASP.NET Core and SQL Server. He took special care to prevent bidding race conditions and structured our multi-provider OAuth 2.0 logins seamlessly. A dependable backend-focused engineer who genuinely understands relational database schemas and API reliability.',
    status: 'approved',
    consentToPublish: true,
    createdAt: '2025-01-20',
  },
  {
    id: 'rev-ebooks-digital-library',
    name: 'Daniyal Khan',
    role: 'Backend Collaborator',
    company: 'Open Source Systems',
    relationship: 'Engineering Peer & Collaborator',
    project: 'E-Books Digital Library',
    projectSlug: 'e-books',
    verificationType: 'github',
    verificationUrl: 'https://github.com/ahmed-husssain/E-books',
    deliverables: [
      'Normalized MySQL Relational Schema',
      'Defensive PHP Session Security',
      'Optimized SQL Query Execution',
    ],
    highlightMetric: 'Sub-50ms Query Latency on Shared Server',
    review:
      'Ahmed’s database normalization and query structuring on the E-Books platform made a massive difference in response times on resource-constrained servers. He wrote clean, defensive PHP with prepared statements and session hardening to protect user libraries. Strong grasp of backend fundamentals and zero over-engineering.',
    status: 'approved',
    consentToPublish: true,
    createdAt: '2024-11-10',
  },
]
