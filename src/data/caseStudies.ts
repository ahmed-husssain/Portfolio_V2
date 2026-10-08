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
  'online-art-gallery': {
    overview:
      'Gallrex is a high-concurrency art marketplace and live auction platform built on .NET 8, EF Core, and SQL Server. It features sub-millisecond collision protection via Optimistic Concurrency Control, in-memory network idempotency, live WebSocket multicast, and autonomous background order settlement.',
    problem:
      'Live online auctions suffer from extreme last-second bidding collisions, race conditions, accidental double-clicks, and dormant server issues where expired auctions fail to settle unless a human loads the page.',
    solution:
      'I architected a Strangler Fig hybrid MVC + CQRS system using MediatR. High-risk transaction zones (Live Bidding & Checkout) leverage SQL Server rowversion OCC timestamps, IMemoryCache idempotency deduplication, SignalR WebSocket room multicasting, and a 15-second background heartbeat worker.',
    highlights: [
      'Optimistic Concurrency Control (OCC) with [Timestamp] RowVersion byte[] preventing race conditions during simultaneous microsecond bids without table deadlocks',
      'Rapid-click idempotency filter using IMemoryCache (UUID sliding window) resolving duplicate clicks in 0.01ms with zero SQL Server load',
      'Real-time WebSocket multicasting via ASP.NET Core SignalR (AuctionHub) pushing live price updates to auction-{productId} rooms within 10ms',
      'Autonomous settlement engine (AuctionEndingWorker : BackgroundService) running on a PeriodicTimer(15s) that settles orders independently of human HTTP traffic',
      'Multi-provider OAuth 2.0 (Google, GitHub, Discord) with local avatar ingestion pipeline (wwwroot/images/avatars) and OtpNet TOTP dual-factor authentication',
      'Covering Non-Clustered B-Tree Index on (IsApproved, Name) with included price and bid columns for zero-table-scan catalog browsing',
    ],
    architecture: [
      'Strangler Fig Architecture: Standard CRUD remains clean MVC, while high-risk monetary transaction zones use CQRS via MediatR (PlaceBidCommand, ProcessCheckoutCommand)',
      'Optimistic Concurrency Control: Catches EF Core DbUpdateConcurrencyException gracefully to prevent corrupt bids without locking reader queries',
      'In-Memory Guard: Sliding-window IMemoryCache protects SQL Server from connection pool exhaustion during bidding wars and credential brute-force attempts',
      'Background Service Heartbeat: Uses PeriodicTimer and IServiceScopeFactory to safely query and settle expired auctions without scoped DbContext memory leaks',
      'Covering SQL Index Tuning: IX_Products_IsApproved_Name satisfies catalog search and sorting directly from index leaf pages with 0 clustered lookups',
    ],
    challenges: [
      'Handling simultaneous last-second bids without database deadlocks: Resolved by replacing pessimistic UPDLOCK table locks with an 8-byte rowversion column and optimistic concurrency catching',
      'Eliminating the "dormant server" auction flaw: Resolved by deploying an autonomous BackgroundService heartbeat that finalizes auctions on a 15-second timer even if zero users are online',
      'Managing external OAuth avatar volatility: Implemented an HttpClient pipeline to download and mirror external avatars locally in wwwroot/images/avatars/{guid}.png',
    ],
    outcome:
      'Delivered a resilient, production-grade live auction platform that eliminates race conditions and double-charges, operating smoothly with sub-10ms WebSocket price pushes and zero table deadlocks.',
  },
  mockrithm: {
    overview:
      'Mockrithm is an AI-driven interview preparation web platform designed to help students and developers practice technical, behavioral, and system design interviews.',
    problem:
      'Preparing for technical interviews can be intimidating and expensive. Many candidates struggle without realistic practice environments and actionable feedback on their answers and code.',
    solution:
      'I developed an interactive web platform featuring real-time speech recognition, live interview feedback, an in-browser code editor, and structured performance summaries.',
    highlights: [
      'Real-time conversational interview simulator with speech-to-text feedback',
      'In-browser code editor with syntax highlighting for technical challenges',
      'Objective response scoring and speech pacing analysis',
      'Awarded Runner-Up at Aptech Vision 2025 among competing software projects',
    ],
    architecture: [
      'Next.js and React frontend with clean, responsive Tailwind CSS styling',
      'Firebase backend for user accounts, session state, and saved interview history',
      'REST APIs connecting voice transcription and evaluation services',
    ],
    challenges: [
      'Keeping speech turnaround latency low to ensure a smooth, conversational interview flow',
      'Structuring evaluation output into clear, actionable recommendations for learners',
    ],
    outcome:
      'Awarded Runner-Up at Aptech Vision 2025 and recognized for providing students with a practical, accessible interview preparation platform.',
  },
  'e-books': {
    overview:
      'E-Books is a responsive digital library platform designed to provide fast catalog browsing, user reading collections, and clean typography with minimal server resource overhead.',
    problem:
      'Readers and students needed a lightweight digital library that loads quickly even on slow network connections while managing user collections and book data securely.',
    solution:
      'I built a PHP and MySQL application utilizing normalized database schemas, secure session management, and responsive Tailwind CSS styling.',
    highlights: [
      'User registration, authentication, and secure session management',
      'Catalog search and filtering across categories, authors, and titles',
      'Responsive reading interface designed for comfort on mobile and desktop',
      'Relational MySQL schema to manage user bookmarks and reading lists securely',
    ],
    architecture: [
      'Structured PHP backend routing with modular service and data access layers',
      'Normalized MySQL relational database with foreign key constraints and category indexing',
      'Tailwind CSS design system providing clean typography and responsive layouts',
    ],
    challenges: [
      'Designing an efficient MySQL schema to support rapid category filtering with low memory footprint',
      'Creating a distraction-free reader interface with optimal font sizing and line heights',
    ],
    outcome:
      'Deployed an efficient digital library platform with fast page load times and minimal server resource consumption.',
  },
  'amber-property-corner': {
    overview:
      'Amber Property Corner is a full-stack real estate web application built for fast property discovery, agent lead routing, and administrative listing management.',
    problem:
      'Prospective buyers and agents needed an intuitive portal for filtering listings by price, location, and property type without sluggish query times.',
    solution:
      'I developed a server-rendered Next.js platform backed by PostgreSQL and Prisma ORM, featuring role-based dashboards and indexed search.',
    highlights: [
      'Fast database query turnaround across large property catalogs',
      'Server-side role-based access control protecting admin listing workflows',
      'Responsive listing details with optimized image delivery',
    ],
    architecture: [
      'Next.js App Router with server-rendered pages for optimal indexing',
      'PostgreSQL database managed through Prisma ORM migrations and type-safe queries',
      'Secure session cookies for administrative authentication',
    ],
    challenges: [
      'Optimizing multi-parameter filter queries without full table scans',
      'Designing clean image galleries that remain lightweight on mobile devices',
    ],
    outcome:
      'Shipped a responsive real estate platform achieving fast query speeds and reliable administrative workflows.',
  },
  shifamanagement: {
    overview:
      'ShifaManagement (SMS) is an end-to-end clinical-grade operating platform engineered for Shifa Home Health Care to unify patient intake, dynamic plan renewals, consecutive zero-gap invoicing, and clinical staff coordination.',
    problem:
      'Home healthcare coverage is distributed across field caregivers with variable durations (10 to 30 days). Managing these cycles manually caused billing discrepancies, missed renewal dates, duplicate invoices, and sudden care interruptions.',
    solution:
      'I engineered a cross-platform operating platform using Flutter, Riverpod, and Supabase PostgreSQL with ACID-safe atomic billing RPCs (create_invoice_atomic), Row Level Security (RLS), dynamic 7-day advance countdown renewals, and isolated dual Staging/Production environments.',
    highlights: [
      'Smart Zero-Gap Continuity: Automatic consecutive date calculation (ToDate_prev + 1 day), completely eliminating coverage gaps and overlaps',
      'Concurrency-Safe Atomic Counter: High-reliability PostgreSQL Security Definer RPC (create_invoice_atomic) preventing duplicate invoice numbers',
      'Intelligent Renewal Engine: 7-day calibrated advance countdown with 1-click WhatsApp and telephony dispatch pre-populated with patient diagnosis',
      'Multi-Tier Role-Based Access Control (RBAC): Row Level Security isolating staff access to assigned patients while giving admins hospital-wide visibility',
      'Dual-Environment Architecture: Staging and Production database isolation preventing test data leakage into live billing sequences',
      '93 Passing Automated Tests: End-to-end verification covering dynamic expiration lifecycles, date calculations, and adversarial edge cases',
    ],
    architecture: [
      'Multi-platform Flutter 3.27+ with Riverpod 3.x reactive dependency injection and stream providers',
      'Supabase PostgreSQL 15 with Security Definer stored procedures and exclusive row locking (FOR UPDATE)',
      'Sub-millisecond single-row inline custom service editing on mobile screens (320px - 412px)',
      'Real-time PostgreSQL Change Data Capture (CDC) streams for active patient rosters and renewal feeds',
    ],
    challenges: [
      'Eliminating billing overlaps across variable plan durations (10d acute vs 30d chronic): Resolved by enforcing consecutive start-date computation',
      'Preventing invoice sequence collisions during simultaneous staff access: Solved via atomic PostgreSQL RPC counter rather than client-side incrementation',
      'Preventing testing clutter in live medical billing: Solved with dual Staging/Production environment isolation',
    ],
    outcome:
      'Engineered and delivered a production clinical operating system in 3 months, eliminating billing duplications and care gaps across mobile, desktop, and web.',
  },
}

