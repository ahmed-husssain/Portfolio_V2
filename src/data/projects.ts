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
  lastCommitDate?: string
  lastCommitLabel?: string
  liveUrl?: string
  githubUrl?: string
  image?: string
  gallery?: string[]
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
    slug: 'shifamanagement',
    title: 'ShifaManagement',
    category: 'Healthcare / Cross-Platform',
    shortDescription:
      'Home healthcare clinical operations, billing, and care plan renewal platform.',
    description:
      'Clinical operations system automating patient intake, diagnostic logs, dynamic fee schedules, 14-day care plan renewals, and WhatsApp PDF dispatch.',
    technologies: [
      'Flutter',
      'Dart',
      'Supabase',
      'PostgreSQL',
      'Row Level Security (RLS)',
      'Riverpod',
    ],
    featured: true,
    status: 'completed',
    year: '2026',
    lastCommitDate: '2026-10-08T11:16:54+05:00',
    lastCommitLabel: 'Oct 8, 2026',
    role: 'Cross-Platform Systems Developer',
    githubUrl: 'https://github.com/ahmed-husssain/ShifaMangementSystem',
    image: '/projects/shifamanagement/preview.png',
    gallery: [
      '/projects/shifamanagement/slide-1.png',
      '/projects/shifamanagement/slide-2.png',
      '/projects/shifamanagement/slide-3.png',
      '/projects/shifamanagement/slide-4.png',
      '/projects/shifamanagement/slide-5.png',
    ],
    architecture: [
      'Multi-platform Flutter architecture with Riverpod reactive state management',
      'ACID-safe atomic invoice generation with PostgreSQL row locking (FOR UPDATE)',
      'Row Level Security (RLS) enforcing strict staff vs admin patient privacy at the kernel level',
      'Real-time PostgreSQL CDC replication stream for 7-day care plan expiration countdowns',
    ],
    outcome:
      'High-reliability clinical management and billing system deployed across mobile and desktop with zero duplicate invoices.',
  },
  {
    slug: 'online-art-gallery',
    title: 'Online Art Gallery',
    category: 'E-Commerce / .NET Full-Stack',
    shortDescription:
      'Real-time art marketplace with concurrency-safe auction settlement and live bidding.',
    description:
      'High-throughput marketplace engineered with ASP.NET Core and SQL Server. Features optimistic concurrency control (RowVersion), SignalR WebSocket bid streams, and sub-10ms cache idempotency.',
    technologies: [
      'C#',
      '.NET 8',
      'ASP.NET Core MVC',
      'CQRS / MediatR',
      'SignalR WebSockets',
      'EF Core 8',
      'SQL Server',
      'OAuth 2.0',
      'IMemoryCache',
      'BackgroundService',
    ],
    featured: true,
    status: 'live',
    year: '2026',
    lastCommitDate: '2026-10-11T07:36:14Z',
    lastCommitLabel: 'Oct 11, 2026',
    role: 'Full-Stack .NET Developer',
    liveUrl: 'https://gallrex.runasp.net',
    githubUrl: 'https://github.com/ahmed-husssain/Online-Art-Gallery',
    image: '/projects/online-art-gallery/preview.png',
    gallery: [
      '/projects/online-art-gallery/slide-1.png',
      '/projects/online-art-gallery/slide-2.png',
    ],
    architecture: [
      'Optimistic Concurrency Control (OCC) with [Timestamp] RowVersion byte[] preventing live bid collisions',
      'Rapid-click idempotency layer via IMemoryCache (UUID sliding window) executing in 0.01ms with zero DB load',
      'Sub-10ms real-time WebSocket push via ASP.NET Core SignalR (AuctionHub) to room auction-{productId}',
      'Autonomous AuctionEndingWorker (BackgroundService) settling expired auctions via 15-second PeriodicTimer',
    ],
    outcome:
      'Zero database deadlocks under concurrent bid spikes with sub-10ms SignalR WebSocket multicast latency.',
  },
  {
    slug: 'mockrithm',
    title: 'Mockrithm',
    category: 'AI / Web Application',
    shortDescription:
      'AI-driven interview preparation web platform designed to help students practice technical interviews.',
    description:
      'Conversational technical interview simulator featuring real-time audio analysis, Monaco in-browser code evaluation, and automated competency scoring.',
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Firebase',
      'REST APIs',
      'Tailwind CSS',
    ],
    featured: true,
    status: 'live',
    year: '2025',
    lastCommitDate: '2025-06-20T14:30:00Z',
    lastCommitLabel: 'Jun 20, 2025',
    role: 'Lead Full-Stack Developer',
    liveUrl: 'https://mockrithm.me/',
    githubUrl: 'https://github.com/AhapraxAhmed/mockrithm',
    image: '/projects/mockrithm/preview.png',
    architecture: [
      'Real-time voice and conversational interview simulator with speech-to-text',
      'In-browser code editor with syntax highlighting for technical problem solving',
      'Role-based competency scoring and structured evaluation summaries',
    ],
    outcome:
      'Awarded Runner-Up at Aptech Vision 2025 out of multiple competing software projects.',
  },
  {
    slug: 'amber-property-corner',
    title: 'Amber Property Corner',
    category: 'Real Estate / Full-Stack',
    shortDescription:
      'Fast property search engine with indexed multi-criteria filtering and agent lead routing.',
    description:
      'A full-stack real estate web application built for fast property discovery, multi-parameter location queries, automated agent lead routing, and role-based administrative listing workflows.',
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Prisma',
      'PostgreSQL',
      'Tailwind CSS',
    ],
    featured: false,
    status: 'live',
    year: '2025',
    lastCommitDate: '2025-03-12T10:00:00Z',
    lastCommitLabel: 'Mar 12, 2025',
    role: 'Full-Stack Developer & Database Architect',
    liveUrl: 'https://amberpropertycorner.com',
    githubUrl: 'https://github.com/ahmed-husssain/RealEstate-',
    image: '/projects/amber-property-corner/preview.png',
    architecture: [
      'Relational PostgreSQL schema with normalized property and inquiry models',
      'Prisma ORM for type-safe database access and automated migrations',
      'Secure role-based administrative dashboard with session authentication',
    ],
    outcome:
      'Sub-150ms catalog query turnaround with zero-table scan index tuning.',
  },
  {
    slug: 'e-books',
    title: 'E-Books Platform',
    category: 'Digital Library / Full-Stack',
    shortDescription:
      'Responsive digital library web application featuring user registration and secure session management.',
    description:
      'Digital library web application featuring normalized relational schemas, session-based authentication, and mobile reader layouts.',
    technologies: ['PHP', 'MySQL', 'Tailwind CSS', 'JavaScript', 'REST APIs'],
    featured: true,
    status: 'live',
    year: '2024',
    lastCommitDate: '2024-11-15T09:00:00Z',
    lastCommitLabel: 'Nov 15, 2024',
    role: 'Backend & Web Developer',
    liveUrl: 'https://readly.gt.tc/User/Pages/home.php',
    githubUrl: 'https://github.com/ahmed-husssain/E-books',
    image: '/projects/e-books/cover.webp',
    architecture: [
      'Modular PHP backend with secure session handling and user authentication',
      'Normalized MySQL relational database schema managing user collections and book data',
      'Clean, responsive Tailwind CSS reader interface for desktop and mobile screens',
    ],
    outcome:
      'Reliable catalog browsing operating with minimal server memory overhead.',
  },
]

/** Projects sorted by last commit date (most recently committed project first) */
export const SORTED_PROJECTS: Project[] = [...PROJECTS].sort((a, b) => {
  const timeA = a.lastCommitDate ? new Date(a.lastCommitDate).getTime() : 0
  const timeB = b.lastCommitDate ? new Date(b.lastCommitDate).getTime() : 0
  return timeB - timeA
})
