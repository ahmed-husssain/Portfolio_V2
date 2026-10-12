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
      'Healthcare management app with patient records, billing schedules, and care plan renewals.',
    description:
      'Cross-platform healthcare management app built with Flutter and Supabase. Handles patient intake, billing calculations, 14-day renewal alerts, and automated PDF invoice generation.',
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
    role: 'Cross-Platform App Developer',
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
      'Multi-platform Flutter frontend with Riverpod for predictable state management',
      'Atomic invoice numbering using PostgreSQL database functions to prevent duplicates',
      'Row Level Security (RLS) policies ensuring staff access only authorized patient data',
      'Real-time Supabase subscriptions for upcoming care plan renewal reminders',
    ],
    outcome:
      'Eliminated duplicate invoice generation through atomic database sequences and shipped cross-platform apps for mobile and desktop.',
  },
  {
    slug: 'online-art-gallery',
    title: 'Online Art Gallery',
    category: 'E-Commerce / .NET Full-Stack',
    shortDescription:
      'Full-stack e-commerce marketplace featuring live auctions, bidding, and cart checkout.',
    description:
      'Full-stack auction and e-commerce application built with ASP.NET Core and SQL Server. Features real-time bid updates via SignalR, concurrency checks to handle simultaneous bids, and OAuth 2.0 logins.',
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
    lastCommitDate: '2026-10-05T22:27:16+05:00',
    lastCommitLabel: 'Oct 5, 2026',
    role: 'Full-Stack .NET Developer',
    liveUrl: 'https://gallrex.runasp.net',
    githubUrl: 'https://github.com/ahmed-husssain',
    image: '/projects/online-art-gallery/preview.png',
    gallery: [
      '/projects/online-art-gallery/slide-1.png',
      '/projects/online-art-gallery/slide-2.png',
    ],
    architecture: [
      'EF Core RowVersion concurrency tokens to catch and resolve simultaneous bid conflicts',
      'In-memory sliding cache window to prevent accidental double-click bid submissions',
      'SignalR WebSockets pushing live bid increments to all active auction viewers',
      'Background worker service checking and closing completed auctions on a scheduled timer',
    ],
    outcome:
      'Handled simultaneous bid submissions cleanly using EF Core concurrency tokens and delivered live updates via SignalR WebSockets.',
  },
  {
    slug: 'mockrithm',
    title: 'Mockrithm',
    category: 'AI / Web Application',
    shortDescription:
      'AI interview practice web app with speech recognition and in-browser code editing.',
    description:
      'Interactive interview practice app built with Next.js and React. Integrates speech-to-text audio feedback, an in-browser code editor, and scoring summaries to help candidates prepare for technical interviews.',
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
    role: 'Full-Stack Web Developer',
    liveUrl: 'https://mockrithm.me/',
    githubUrl: 'https://github.com/AhapraxAhmed/mockrithm',
    image: '/projects/mockrithm/preview.png',
    architecture: [
      'Web Speech API integration providing instant transcription and audio feedback',
      'In-browser Monaco code editor with language syntax highlighting',
      'Structured evaluation forms breaking down technical score metrics',
    ],
    outcome:
      'Won Runner-Up at Aptech Vision 2025, praised for responsive UI design and full-stack API integration.',
  },
  {
    slug: 'amber-property-corner',
    title: 'Amber Property Corner',
    category: 'Real Estate / Full-Stack',
    shortDescription:
      'Real estate listing portal with property filters, agent inquiry forms, and admin dashboard.',
    description:
      'Full-stack real estate discovery app built with Next.js, Prisma, and PostgreSQL. Features multi-parameter property search, inquiry lead routing, and a protected admin listing portal.',
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
    role: 'Full-Stack Web Developer',
    liveUrl: 'https://amberpropertycorner.com',
    githubUrl: 'https://github.com/ahmed-husssain/RealEstate-',
    image: '/projects/amber-property-corner/preview.png',
    architecture: [
      'Normalized PostgreSQL database schema for property details, images, and user inquiries',
      'Type-safe database queries and automated schema migrations via Prisma ORM',
      'Protected admin portal for managing property listings and reviewing inquiries',
    ],
    outcome:
      'Delivered responsive search with database index optimization and a clean mobile-friendly interface.',
  },
  {
    slug: 'e-books',
    title: 'E-Books Platform',
    category: 'Digital Library / Full-Stack',
    shortDescription:
      'Digital library web app with user authentication, catalog browsing, and reading lists.',
    description:
      'Web-based digital library built with PHP and MySQL. Includes user registration, session management, catalog search, and responsive reader layouts.',
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
      'Clean PHP backend structure handling session security and user profile state',
      'Normalized MySQL relational tables organizing categories, authors, and books',
      'Responsive reading layouts styled with Tailwind CSS for mobile and desktop screens',
    ],
    outcome:
      'Built a functional, lightweight library platform with straightforward relational queries and clean mobile navigation.',
  },
]

/** Projects sorted by last commit date (most recently committed project first) */
export const SORTED_PROJECTS: Project[] = [...PROJECTS].sort((a, b) => {
  const timeA = a.lastCommitDate ? new Date(a.lastCommitDate).getTime() : 0
  const timeB = b.lastCommitDate ? new Date(b.lastCommitDate).getTime() : 0
  return timeB - timeA
})
