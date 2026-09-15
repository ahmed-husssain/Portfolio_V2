export interface CaseStudyData {
  overview?: string
  problem: string
  solution: string
  highlights: string[]
  architecture: string[]
  challenges: string[]
  outcome: string
}

export const CASE_STUDIES: Record<string, CaseStudyData> = {
  mockrithm: {
    overview:
      'I built Mockrithm to give engineering candidates an interactive way to practice verbal technical interviews and receive structured, actionable critique without needing a human interviewer on standby.',
    problem:
      'Job seekers preparing for competitive software engineering interviews often lack low-stakes, realistic environments to practice verbal communication and receive objective, immediate feedback on technical explanations.',
    solution:
      'I engineered an interactive voice simulator that pairs real-time conversational voice agents with resume parsing algorithms. The system conducts realistic back-and-forth technical interviews and outputs detailed scoring rubrics evaluating clarity, syntax, and conceptual depth.',
    highlights: [
      'Sub-second voice response latency for natural conversational pacing',
      'Automated resume parsing and semantic alignment with target job descriptions',
      'Structured rubric evaluation across conceptual understanding, syntax, and communication clarity',
      'Authenticated candidate session history with review playback',
    ],
    architecture: [
      'Next.js App Router for server-rendered page shells and fast client transitions',
      'Bidirectional real-time voice streaming orchestrated via Vapi agent integration',
      'Google AI SDK (Gemini) prompted with strict JSON schemas for deterministic scoring',
      'Firestore document architecture with composite indexing for candidate interview history',
    ],
    challenges: [
      'Managing vocal latency and user interruptions during bidirectional audio streaming',
      'Ensuring AI evaluation consistency across diverse technical domains and difficulty tiers without hallucinated scoring',
    ],
    outcome:
      'Delivered a responsive web application with sub-second audio turnarounds, persistent interview logs, and actionable feedback rubrics for active job seekers.',
  },
  'amber-property-corner': {
    overview:
      'I designed and engineered the complete full-stack web platform for Amber Property Corner, replacing a sluggish legacy setup with a fast Next.js frontend, PostgreSQL database, and role-based administrative dashboard.',
    problem:
      'Traditional real estate platforms frequently suffer from slow relational lookups, poor mobile indexing, and fragmented communication between prospective buyers and listing managers.',
    solution:
      'I built a server-rendered Next.js web platform backed by PostgreSQL and Prisma ORM. The architecture features indexed multi-criteria filtering, HTTP-only authenticated admin dashboards, and server-enforced role permissions for agents and administrators.',
    highlights: [
      'Sub-150ms indexed database query responses across large listing volumes',
      'Strict runtime request validation across all API boundaries using Zod schemas',
      'Server-side RBAC protecting administrative property publishing workflows',
      'Optimized listing detail pages with responsive image delivery',
    ],
    architecture: [
      'Relational PostgreSQL schema with normalized property, agent, and inquiry models',
      'Prisma ORM handling type-safe database queries and automated schema migrations',
      'Server-rendered listing pages optimizing search engine crawling and Core Web Vitals',
      'Secure session cookies with bcryptjs password hashing for admin panel isolation',
    ],
    challenges: [
      'Optimizing multi-parameter filter queries across price, location, and property type without triggering full table scans',
      'Implementing secure image asset uploads and responsive delivery for high-resolution property galleries',
    ],
    outcome:
      'Achieved a 95+ Mobile Lighthouse score, reliable administrative property workflows, and sub-150ms query turnaround times in production.',
  },
  'careflow-connect': {
    overview:
      'I developed CareFlow Connect as a cross-platform mobile utility to help outpatient medical clinics coordinate daily schedules, manage patient intake, and prevent missed consultations.',
    problem:
      'Outpatient healthcare clinics experienced elevated missed appointment rates and administrative delays resulting from paper scheduling charts and disjointed staff communication.',
    solution:
      'I engineered a cross-platform mobile application using Flutter and Riverpod state management connected to Firebase backend services for instantaneous schedule synchronization and automated push notifications.',
    highlights: [
      'Real-time schedule synchronization across multiple clinic devices',
      'Automated push notifications for upcoming consultations and schedule updates',
      'Granular data security rules segregating medical staff and patient views',
      'Offline-tolerant appointment intake and record caching',
    ],
    architecture: [
      'Flutter framework delivering high-performance UI rendering on Android and iOS',
      'Riverpod for robust, declarative, and easily testable state management',
      'Firestore real-time listeners synchronizing consultation rosters with zero manual refresh',
      'Firebase Cloud Messaging dispatching targeted push notifications based on appointment timestamps',
    ],
    challenges: [
      'Handling offline appointment logging with reliable background sync when connectivity resumes',
      'Ensuring strict role-based access to patient medical histories according to clinic privacy protocols',
    ],
    outcome:
      'Reduced consultation no-shows and provided clinic practitioners with immediate, synchronized access to daily rosters across multiple devices.',
  },
  'e-books': {
    overview:
      'I created E-Books as a lightweight digital publication library and reader application, focused on fast catalog browsing and clean reading typography with minimal server resource consumption.',
    problem:
      'Digital publication readers needed a fast, low-footprint catalog interface with reliable search, bookmarking, and low server resource consumption on standard hosting hardware.',
    solution:
      'I developed a PHP and MySQL application utilizing normalized database schemas, server-rendered views, clean RESTful endpoints, and responsive Tailwind CSS styling.',
    highlights: [
      'Normalized relational tables for authors, genres, publications, and reader bookmarks',
      'Fast catalog querying across hundreds of digital volumes with minimal memory usage',
      'Clean responsive reading views formatted for both desktop and mobile screens',
      'Modular backend code organized with explicit data access separation',
    ],
    architecture: [
      'Structured PHP backend routing with modular service and data access layers',
      'Normalized MySQL relational tables with foreign key constraints and category indexing',
      'Tailwind CSS design system providing clean typography and high-contrast reading ergonomics',
    ],
    challenges: [
      'Optimizing pagination and search queries across extensive book catalogs on limited server hardware',
      'Designing comfortable typography and dark/light reading ergonomics for longform content',
    ],
    outcome:
      'Successfully deployed an efficient, fast-loading digital library platform operating reliably with low server resource overhead.',
  },
}
