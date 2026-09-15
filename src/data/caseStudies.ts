export interface CaseStudyData {
  problem: string
  solution: string
  highlights: string[]
  architecture: string[]
  challenges: string[]
  outcome: string
}

export const CASE_STUDIES: Record<string, CaseStudyData> = {
  mockrithm: {
    problem:
      'Job seekers preparing for competitive software engineering interviews lack low-stakes, realistic environments to practice verbal communication and receive objective, immediate feedback on technical answers.',
    solution:
      'Engineered an interactive voice simulator integrating conversational AI agents with document parsing algorithms to conduct live back-and-forth technical interviews and output detailed performance scores.',
    highlights: [
      'Sub-second voice response latency for realistic conversation flow',
      'Automated resume parsing and semantic alignment with job specifications',
      'Structured rubric evaluation across conceptual understanding, syntax, and clarity',
    ],
    architecture: [
      'Next.js App Router for server-rendered page shells and fast client transitions',
      'Bidirectional real-time voice streaming orchestrated via Vapi agent integration',
      'Google AI SDK (Gemini) prompted with strict JSON schemas for deterministic scoring',
      'Firestore document architecture with composite indexing for user interview history',
    ],
    challenges: [
      'Managing vocal latency and interruptions during live conversational audio streaming',
      'Ensuring AI evaluation consistency across diverse technical domains and difficulty tiers',
    ],
    outcome:
      'Delivered a fully responsive web application with sub-second audio turnarounds, persistent interview logs, and actionable feedback rubrics.',
  },
  'amber-property-corner': {
    problem:
      'Traditional real estate listings suffered from slow relational lookups, poor mobile indexing, and fragmented communication between prospective buyers and listing managers.',
    solution:
      'Constructed a server-rendered Next.js web platform backed by PostgreSQL and Prisma ORM, featuring indexed multi-criteria filtering, HTTP-only authenticated admin dashboards, and server-enforced role permissions.',
    highlights: [
      'Sub-150ms indexed database query responses across large listing volumes',
      'Strict runtime request validation across all API boundaries using Zod schemas',
      'Server-side RBAC protecting administrative property publishing workflows',
    ],
    architecture: [
      'Relational PostgreSQL schema with normalized property, agent, and inquiry models',
      'Prisma ORM handling type-safe database queries and automated schema migrations',
      'Server-rendered listing pages optimizing search engine crawling and Core Web Vitals',
      'Secure session cookies with bcryptjs password hashing for admin panel isolation',
    ],
    challenges: [
      'Optimizing multi-parameter filter queries across price, location, and property type without full table scans',
      'Implementing secure file uploads and responsive image optimization for high-resolution property galleries',
    ],
    outcome:
      'Achieved a 95+ Mobile Lighthouse score, seamless administrative property management, and sub-150ms query turnaround times.',
  },
  'careflow-connect': {
    problem:
      'Outpatient healthcare clinics experienced elevated missed appointment rates and administrative delays resulting from paper scheduling charts and disjointed staff communication.',
    solution:
      'Engineered a cross-platform mobile application utilizing Flutter and Riverpod state management connected to Firebase backend services for instantaneous schedule synchronization and push dispatching.',
    highlights: [
      'Real-time schedule synchronization across multiple clinic devices',
      'Automated push notifications for upcoming consultations and schedule updates',
      'Granular data security rules segregating medical staff and patient views',
    ],
    architecture: [
      'Flutter framework delivering high-performance UI rendering on Android and iOS',
      'Riverpod for robust, declarative, and easily testable state management',
      'Firestore real-time listeners synchronizing consultation rosters with zero manual refresh',
      'Firebase Cloud Messaging dispatching targeted push notifications based on appointment timestamps',
    ],
    challenges: [
      'Handling offline appointment logging with seamless background sync when connectivity resumes',
      'Ensuring strict role-based access to patient medical histories',
    ],
    outcome:
      'Dramatically reduced consultation no-shows and provided medical practitioners with immediate, synchronized access to daily schedules.',
  },
  'e-books': {
    problem:
      'Digital publication readers needed a fast, low-footprint catalog interface with reliable search, bookmarking, and low server resource consumption.',
    solution:
      'Developed a PHP and MySQL application utilizing normalized database schemas, server-rendered views, clean RESTful endpoints, and responsive Tailwind styling.',
    highlights: [
      'Normalized relational tables for authors, genres, publications, and reader bookmarks',
      'Fast catalog querying across hundreds of digital volumes with minimal memory usage',
      'Clean responsive reading views formatted for both desktop and mobile screens',
    ],
    architecture: [
      'Structured PHP backend routing with modular service and data access layers',
      'Normalized MySQL relational tables with foreign key constraints and category indexing',
      'Tailwind CSS design system providing clean typography and high-contrast reading ergonomics',
    ],
    challenges: [
      'Optimizing pagination and search queries across extensive book catalogs on limited server hardware',
      'Designing readable typography and dark/light reading ergonomics for longform content',
    ],
    outcome:
      'Successfully deployed an efficient, fast-loading digital library platform operating reliably with low server resource overhead.',
  },
}
