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
    slug: 'online-art-gallery',
    title: 'Online Art Gallery',
    category: 'E-Commerce / .NET Full-Stack',
    shortDescription:
      'Full-stack digital & AI art marketplace with automated auction and bidding engine.',
    description:
      'A full-stack e-commerce web platform for digital and AI-generated art. Engineered with ASP.NET Core MVC, multi-provider OAuth 2.0 authentication, an automated auction/bidding engine, shopping cart, and a relational SQL Server database schema.',
    technologies: [
      'C#',
      'ASP.NET Core MVC',
      'EF Core',
      'SQL Server',
      'OAuth 2.0',
      'ASP.NET Core Identity',
      'Tailwind CSS',
    ],
    featured: true,
    status: 'live',
    year: '2025',
    role: 'Full-Stack .NET Developer',
    liveUrl: 'https://gallrex.runasp.net',
    githubUrl: 'https://github.com/ahmed-husssain',
    architecture: [
      'Multi-provider authentication using OAuth 2.0 (Google, GitHub, Discord) and ASP.NET Core Identity',
      'Automated bidding and auction engine with dynamic price recalculation and shopping cart workflow',
      'Relational database schema in SQL Server optimized with foreign key constraints and query indexing',
    ],
    outcome:
      'Production-grade e-commerce and auction platform operating reliably with secure multi-provider auth and relational data integrity.',
  },
  {
    slug: 'mockrithm',
    title: 'Mockrithm',
    category: 'AI / Web Application',
    shortDescription:
      'AI-driven interview preparation web platform designed to help students practice technical interviews.',
    description:
      'An AI-driven interview preparation web platform designed to help students practice and refine technical interview skills with real-time feedback, in-browser code editor, and speech pacing analysis.',
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
    slug: 'e-books',
    title: 'E-Books Platform',
    category: 'Digital Library / Full-Stack',
    shortDescription:
      'Responsive digital library web application featuring user registration and secure session management.',
    description:
      'A responsive digital library web application built with PHP and MySQL. Features user registration, authentication, secure session management, and relational database schemas to manage user collections and book data.',
    technologies: ['PHP', 'MySQL', 'Tailwind CSS', 'JavaScript', 'REST APIs'],
    featured: true,
    status: 'live',
    year: '2024',
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
      'Fast, lightweight digital library web application operating reliably with minimal server resource overhead.',
  },
  {
    slug: 'amber-property-corner',
    title: 'Amber Property Corner',
    category: 'Real Estate / Full-Stack',
    shortDescription:
      'Real estate discovery portal with multi-criteria search and admin listing workflows.',
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
      'High-performance property discovery portal with sub-150ms query turnaround and clean mobile responsiveness.',
  },
  {
    slug: 'shifamanagement',
    title: 'ShifaManagement',
    category: 'Healthcare / Cross-Platform',
    shortDescription:
      'Home healthcare clinical operations, billing, and care plan renewal platform.',
    description:
      'A cross-platform healthcare operations system consolidating patient intake, clinical diagnostics, dynamic per-diem service fee structuring, automated 14-day care plan renewals, and WhatsApp invoice dispatch.',
    technologies: [
      'Flutter',
      'Dart',
      'Cloud Firestore',
      'Firebase Auth',
      'Cloud Functions',
      'Riverpod',
    ],
    featured: false,
    status: 'completed',
    year: '2024',
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
      'Reactive cross-platform architecture with real-time Firestore database synchronization',
      'Automated 14-day care plan renewal tracking with localized WhatsApp message dispatch',
      'Asynchronous vector PDF generation for patient invoice printing and billing',
    ],
    outcome:
      'Reliable healthcare operations system deployed across mobile and desktop for clinical intake and automated billing.',
  },
]
