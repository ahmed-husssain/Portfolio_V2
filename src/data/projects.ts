export interface ProjectSlide {
  image: string
  title: string
  description?: string
  tag?: string
}

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
  gallerySlides?: ProjectSlide[]
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
    lastCommitDate: '2026-10-31T15:52:57Z',
    lastCommitLabel: 'Oct 31, 2026',
    role: 'Cross-Platform Systems Developer',
    githubUrl: 'https://github.com/ahmed-husssain/ShifaMangementSystem',
    image: '/projects/shifamanagement/preview.webp',
    gallery: [
      '/projects/shifamanagement/slide-1.webp',
      '/projects/shifamanagement/slide-2.webp',
      '/projects/shifamanagement/slide-3.webp',
      '/projects/shifamanagement/slide-4.webp',
      '/projects/shifamanagement/slide-5.webp',
    ],
    gallerySlides: [
      {
        image: '/projects/shifamanagement/slide-1.webp',
        title: 'Clinical Operations Dashboard (System 2.0)',
        tag: 'CLINICAL CORE',
        description:
          'Cross-platform Flutter operating dashboard tracking active patients, 14-day renewal alerts, and real-time clinical activity logs.',
      },
      {
        image: '/projects/shifamanagement/slide-2.webp',
        title: '1-Click WhatsApp Invoice Dispatch',
        tag: 'AUTOMATION PIPELINE',
        description:
          'Automated invoice PDF generation with instantaneous WhatsApp API dispatch and verified delivery status.',
      },
      {
        image: '/projects/shifamanagement/slide-3.webp',
        title: 'Intelligent Care Alerts & Expiration Monitoring',
        tag: 'REACTIVE CDC ENGINE',
        description:
          'PostgreSQL CDC replication stream monitoring 7-day care plan expirations with priority clinician notifications.',
      },
      {
        image: '/projects/shifamanagement/slide-4.webp',
        title: 'Soft-Delete & Audit History',
        tag: 'COMPLIANCE & AUDIT',
        description:
          'Row Level Security-governed patient records with immutable audit logs preventing accidental medical data loss.',
      },
      {
        image: '/projects/shifamanagement/slide-5.webp',
        title: 'Cloud Infrastructure & Database',
        tag: 'INFRASTRUCTURE',
        description:
          'High-availability Supabase and PostgreSQL configuration maintaining zero infrastructure operational costs.',
      },
    ],
    architecture: [
      'Multi-platform Flutter architecture with Riverpod reactive state management',
      'Database-level invoice generation with PostgreSQL row locking (FOR UPDATE) to prevent duplicates',
      'Row Level Security (RLS) enforcing strict staff vs admin patient privacy at the database level',
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
      'Real-time art marketplace with live bidding and automatic auction settlement.',
    description:
      'Online art marketplace built with ASP.NET Core and SQL Server. Features optimistic concurrency control (RowVersion), SignalR WebSocket bid streams, and in-memory duplicate submission checks.',
    technologies: [
      'C#',
      '.NET',
      'ASP.NET Core MVC',
      'CQRS / MediatR',
      'SignalR WebSockets',
      'EF Core',
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
    image: '/projects/online-art-gallery/slide-1.webp',
    gallery: [
      '/projects/online-art-gallery/slide-1.webp',
      '/projects/online-art-gallery/slide-2.webp',
      '/projects/online-art-gallery/slide-3.webp',
    ],
    gallerySlides: [
      {
        image: '/projects/online-art-gallery/slide-1.webp',
        title: 'Hero & Curated Artwork Showcase',
        tag: 'VISUAL SHOWCASE',
        description:
          'Interactive artwork catalog built with responsive layouts and fast database queries.',
      },
      {
        image: '/projects/online-art-gallery/slide-2.webp',
        title: 'Curated Catalog & Live Bidding Arena',
        tag: 'LIVE AUCTION FLOOR',
        description:
          'Live auction floor powered by ASP.NET Core SignalR and EF Core concurrency checks to prevent conflicting bids.',
      },
      {
        image: '/projects/online-art-gallery/slide-3.webp',
        title: 'Multi-Provider OAuth 2.0 & Identity Gateway',
        tag: 'IDENTITY & AUTH',
        description:
          'Glassmorphic authentication gateway supporting Google OAuth 2.0, secure session persistence, and ASP.NET Core Identity credential store.',
      },
    ],
    architecture: [
      'Optimistic concurrency control with EF Core RowVersion to prevent simultaneous bid conflicts',
      'In-memory caching to catch double-clicks and prevent duplicate bid submissions',
      'Real-time price updates pushed to active rooms via ASP.NET Core SignalR (AuctionHub)',
      'Background worker (BackgroundService) that checks and closes expired auctions every 15 seconds',
    ],
    outcome:
      'Smooth live bidding with instant price updates and reliable conflict resolution.',
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
    year: '2026',
    lastCommitDate: '2026-09-20T10:44:19Z',
    lastCommitLabel: 'Sep 20, 2026',
    role: 'Lead Full-Stack Developer',
    liveUrl: 'https://mockrithm.me/',
    githubUrl: 'https://github.com/AhapraxAhmed/mockrithm',
    image: '/projects/mockrithm/slide-1.webp',
    gallery: [
      '/projects/mockrithm/slide-1.webp',
      '/projects/mockrithm/slide-2.webp',
    ],
    gallerySlides: [
      {
        image: '/projects/mockrithm/slide-1.webp',
        title: 'Editorial Discovery Stage & Aptech Recognition',
        tag: 'PLATFORM HERO',
        description:
          'Conversational landing page with starry celestial canvas introducing voice-driven mock interviews.',
      },
      {
        image: '/projects/mockrithm/slide-2.webp',
        title: 'Calibration Dashboard & Competency Scoring',
        tag: 'ANALYTICS ENGINE',
        description:
          'Real-time candidate calibration hub with voice pacing breakdown, filler-word elimination metrics, and code evaluation progression.',
      },
    ],
    architecture: [
      'Real-time voice and conversational interview simulator with speech-to-text',
      'In-browser code editor with syntax highlighting for technical problem solving',
      'Role-based competency scoring and structured evaluation summaries',
    ],
    outcome:
      'Awarded Runner-Up at Aptech Vision 2025 out of multiple competing software projects.',
  },
  {
    slug: 'hotelms',
    title: 'Stayza — Hotel Management System',
    category: 'Hospitality / Full-Stack',
    shortDescription:
      'Luxury resort property management system featuring suite bookings, 30% advance deposit calculations, and 4 role-based staff portals.',
    description:
      'A full-stack hotel management and reservation web application built for boutique resorts, featuring transparent suite bookings, automatic 30% deposit calculations, and dedicated operational views for Admin, Reception, Housekeeping, and Guests.',
    technologies: [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'Tailwind CSS',
      'REST APIs',
    ],
    featured: false,
    status: 'completed',
    year: '2026',
    lastCommitDate: '2026-11-20T12:00:00Z',
    lastCommitLabel: 'Nov 20, 2026',
    role: 'Full-Stack Developer',
    githubUrl: 'https://github.com/ahmed-husssain/HotelMS',
    image: '/projects/hotelms/slide-1.webp',
    gallery: [
      '/projects/hotelms/slide-1.webp',
      '/projects/hotelms/slide-2.webp',
      '/projects/hotelms/slide-3.webp',
      '/projects/hotelms/slide-4.webp',
    ],
    gallerySlides: [
      {
        image: '/projects/hotelms/slide-1.webp',
        title: 'Hero & Architectural Guest Sanctuary',
        tag: 'LANDING & BRANDING',
        description:
          'Responsive oceanfront luxury landing experience with room exploration and instant reservation call-to-actions.',
      },
      {
        image: '/projects/hotelms/slide-2.webp',
        title: 'Suite Specifications & 30% Deposit Pricing',
        tag: 'RESERVATION ENGINE',
        description:
          'Detailed suite overview showcasing room dimensions, presidential amenities, nightly rates, and automatic 30% deposit calculation.',
      },
      {
        image: '/projects/hotelms/slide-3.webp',
        title: 'Navigation Drawer & Estate Directory',
        tag: 'GUEST SERVICES',
        description:
          'Clean slide-over menu connecting guests with room options, estate amenities, digital keys, and room service.',
      },
      {
        image: '/projects/hotelms/slide-4.webp',
        title: 'Role-Based Authentication & Staff Portals',
        tag: 'ACCESS CONTROL',
        description:
          '1-Click role switcher allowing instant access to designated portals for Admin (GM), Reception, Housekeeping, and Guests.',
      },
    ],
    architecture: [
      'RESTful API endpoints handling room availability, pricing calculations, and reservation records',
      'Role-based authorization distinguishing administrative reporting from front desk check-ins and housekeeping statuses',
      'Component-driven frontend with Tailwind CSS and responsive modal drawers for smooth guest navigation',
    ],
    outcome:
      'Successfully delivered a responsive, easy-to-use resort management platform that streamlines guest reservations and unifies daily hotel operations across 4 distinct staff roles.',
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
    year: '2026',
    lastCommitDate: '2026-10-26T08:22:08Z',
    lastCommitLabel: 'Oct 26, 2026',
    role: 'Backend & Web Developer',
    liveUrl: 'https://eboooks.infinityfree.io',
    githubUrl: 'https://github.com/ahmed-husssain/E-books',
    image: '/projects/e-books/slide-1.webp',
    gallery: [
      '/projects/e-books/slide-1.webp',
      '/projects/e-books/slide-2.webp',
      '/projects/e-books/slide-3.webp',
      '/projects/e-books/slide-4.webp',
      '/projects/e-books/slide-5.webp',
    ],
    gallerySlides: [
      {
        image: '/projects/e-books/slide-1.webp',
        title: 'Hero & Reading Community Portal',
        tag: 'DISCOVERY PORTAL',
        description:
          'Reader acquisition landing page featuring clean typography, direct book discovery pathways, and reading competition gateway.',
      },
      {
        image: '/projects/e-books/slide-2.webp',
        title: 'Faceted Catalog Search & Filtering',
        tag: 'INDEXED QUERY ENGINE',
        description:
          'Multi-category faceted navigation across genres (History, Fiction, Islamic, Education) with real-time format toggles (PDF, CD, Hardcopy) and price filters.',
      },
      {
        image: '/projects/e-books/slide-3.webp',
        title: 'Book Specification & Inventory Allocation',
        tag: 'COMMERCE PIPELINE',
        description:
          'Granular book specification sheet featuring multi-format selection (Hardcover $55.00), real-time stock allocation (77 available), and cart checkout pipeline.',
      },
      {
        image: '/projects/e-books/slide-4.webp',
        title: 'Platform Story & Community Milestones',
        tag: 'COMMUNITY & IMPACT',
        description:
          'About section detailing platform mission, community growth metrics (Founded 2020, 62 active readers, 46 titles), and digital library vision.',
      },
      {
        image: '/projects/e-books/slide-5.webp',
        title: 'Relational MySQL Schema & 9-Table Architecture',
        tag: 'DATABASE SCHEMA',
        description:
          'Normalized relational schema hosted on InfinityFree MySQL (InnoDB) managing users, books, orders, submissions, categories, and competition winners with zero redundancy.',
      },
    ],
    architecture: [
      'Modular PHP backend with secure session handling and user authentication',
      'Normalized MySQL relational database schema managing user collections and book data',
      'Clean, responsive Tailwind CSS reader interface for desktop and mobile screens',
    ],
    outcome:
      'Reliable catalog browsing operating with minimal server memory overhead.',
  },
]
