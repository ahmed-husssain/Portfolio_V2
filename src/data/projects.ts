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
    architecture: [
      'Next.js App Router with server-rendered page shells and streaming transitions',
      'Bidirectional real-time voice streaming via Vapi agent integration',
      'Google AI SDK (Gemini) with strict JSON schemas for deterministic rubric scoring',
      'Firestore document architecture with composite indexing for interview history',
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
    architecture: [
      'Relational PostgreSQL schema with normalized property, agent, and inquiry models',
      'Prisma ORM handling type-safe database queries and automated schema migrations',
      'Server-rendered listing pages optimizing search engine crawling and Core Web Vitals',
      'Secure session cookies with bcryptjs password hashing for admin panel isolation',
    ],
    outcome:
      'Achieved a 95+ Mobile Lighthouse score, reliable administrative property workflows, and sub-150ms query turnaround times.',
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
    outcome:
      'Successfully deployed an efficient, fast-loading digital library platform operating reliably with low server resource overhead.',
  },
]
