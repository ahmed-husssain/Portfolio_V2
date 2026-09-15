export interface Project {
  slug: string
  title: string
  shortDescription: string
  description: string
  category: string
  technologies: string[]
  featured: boolean
  status?: 'live' | 'in-progress' | 'completed'
  year?: string
  liveUrl?: string
  githubUrl?: string
  image?: string
  role?: string
  problem?: string
  solution?: string
  highlights?: string[]
  architecture?: string[]
  challenges?: string[]
  outcome?: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'mockrithm',
    title: 'Mockrithm',
    category: 'AI / Full-Stack Web Application',
    shortDescription: 'AI-powered technical interview simulation and resume evaluation platform.',
    description:
      'A technical interview preparation system that conducts real-time conversational voice interviews, analyzes user resumes against job descriptions, and generates structured evaluation rubrics with targeted critique.',
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Firebase',
      'Firestore',
      'Google AI SDK',
      'Vapi',
      'Authentication',
    ],
    featured: true,
    status: 'live',
    year: '2025',
    role: 'Full-Stack Developer (End-to-End Architecture)',
    liveUrl: 'https://mockrithm.vercel.app/',
    githubUrl: 'https://github.com/AhapraxAhmed/mockrithm',
    image: '/projects/mockrithm/cover.webp',
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
  {
    slug: 'amber-property-corner',
    title: 'Amber Property Corner',
    category: 'Real Estate / Full-Stack Web Application',
    shortDescription: 'High-throughput real estate discovery, search, and lead routing platform.',
    description:
      'A production real estate portal built for fast property discovery, multi-parameter location queries, automated agent lead routing, and secure role-based administrative listing workflows.',
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Prisma',
      'PostgreSQL',
      'Tailwind CSS',
      'Framer Motion',
      'Zod',
      'bcryptjs',
      'HTTP-Only Cookies',
      'RBAC',
    ],
    featured: true,
    status: 'live',
    year: '2025',
    role: 'Full-Stack Developer & Database Architect',
    liveUrl: 'https://amberpropertycorner.com',
    image: '/projects/amber-property-corner/cover.webp',
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
  {
    slug: 'careflow-connect',
    title: 'Shifa / CareFlow Connect',
    category: 'Healthcare / Mobile Application',
    shortDescription: 'Cross-platform clinic management, patient record indexing, and appointment dispatching.',
    description:
      'A mobile clinical administration system built to streamline patient intake, physician schedule coordination, medical record access, and automated push appointment reminders.',
    technologies: [
      'Flutter',
      'Dart',
      'Firebase',
      'Firestore',
      'Firebase Auth',
      'Firebase Storage',
      'Cloud Messaging',
      'Riverpod',
    ],
    featured: false,
    status: 'completed',
    year: '2024',
    role: 'Mobile Application Developer',
    githubUrl: 'https://github.com/ahmed-husssain',
    image: '/projects/careflow-connect/cover.webp',
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
  {
    slug: 'e-books',
    title: 'E-Books',
    category: 'Digital Library / Full-Stack Web Application',
    shortDescription: 'Digital publication catalog, reader view, and library indexing platform.',
    description:
      'A full-stack digital publication repository providing catalog search, responsive book reading views, user reading collections, and administrative book publishing.',
    technologies: ['PHP', 'MySQL', 'Tailwind CSS', 'JavaScript', 'REST API'],
    featured: false,
    status: 'completed',
    year: '2024',
    role: 'Backend & Web Developer',
    liveUrl: 'http://64.23.237.187/ebooks',
    githubUrl: 'https://github.com/AhapraxAhmed/E-books',
    image: '/projects/e-books/cover.webp',
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
]
