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
    category: 'AI / Full-Stack Web App',
    shortDescription:
      'AI-powered technical interview simulator & real-time career intelligence platform.',
    description:
      'An enterprise-grade career preparation platform simulating technical, behavioral, and system design interviews in real time. Features sub-second conversational voice AI, live STAR competency telemetry, an embedded Monaco code sandbox, and a competitive ELO rating engine.',
    technologies: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Groq (LLaMA 3.3)',
      'Whisper Turbo',
      'Edge Neural TTS',
      'Gemini 2.5 Flash',
      'Clerk Auth',
      'Firebase Firestore',
      'Monaco Editor',
      'Three.js',
      'Stripe Billing',
      'Tailwind CSS v4',
      'Framer Motion',
    ],
    featured: true,
    status: 'live',
    year: '2025',
    role: 'Lead Full-Stack & AI Systems Architect',
    liveUrl: 'https://mockrithm.me/',
    githubUrl: 'https://github.com/AhapraxAhmed/mockrithm',
    image: '/projects/mockrithm/preview.png',
    architecture: [
      'Resilient multi-key load balancer pooling up to 50 API keys with dynamic rate-limit header parsing and exponential cooldowns',
      'Hybrid zero-cost voice pipeline: client-side VAD → Groq Whisper Turbo transcription → LLM streaming → Edge Neural TTS fallback',
      'Dual-engine LLM failover: Groq LLaMA 3.3-70B primary evaluation with automated Google Gemini 2.5 Flash schema fallback',
      'Adaptive real-time interview telemetry: live STAR detection, WPM speech pacing audits, filler word tracking, and chess-style ELO scoring',
    ],
    outcome:
      '< 1.2s voice turnaround latency, 99.9% AI availability via predictive multi-key rotation and dual-provider fallback, and complete Stripe monetization lifecycle.',
  },
  {
    slug: 'amber-property-corner',
    title: 'Amber Property Corner',
    category: 'Real Estate / Full-Stack',
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
    githubUrl: 'https://github.com/ahmed-husssain/RealEstate-',
    image: '/projects/amber-property-corner/preview.png',
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
    category: 'Healthcare / Mobile App',
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
    category: 'Digital Library / Full-Stack',
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
