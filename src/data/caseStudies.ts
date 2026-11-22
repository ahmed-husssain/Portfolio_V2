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
      'Gallrex is an online art marketplace and live auction web platform built with ASP.NET Core, EF Core, and SQL Server. It features live bid updates with SignalR WebSockets, conflict protection using optimistic concurrency (RowVersion), in-memory duplicate submission checks, and an automatic background worker to close expired auctions.',
    problem:
      'Live online auctions face rapid bidding collisions when multiple users bid at the exact same second, accidental double-clicks from impatient buyers, and expired auctions that remain open unless someone manually refreshes the page.',
    solution:
      'I built a clean ASP.NET Core application using CQRS via MediatR for high-volume actions like bidding and checkout. It uses SQL Server RowVersion timestamps to catch bid conflicts, an in-memory cache to ignore duplicate double-clicks, SignalR rooms for live price updates, and a background service that automatically closes finished auctions.',
    highlights: [
      'Optimistic Concurrency Control: Uses EF Core [Timestamp] RowVersion to catch and resolve simultaneous bids cleanly without locking database tables',
      'Double-Click Prevention: In-memory cache filter verifies request keys to ignore accidental duplicate clicks before they hit the database',
      'Live Room Broadcasting: Real-time price updates pushed to active auction rooms via ASP.NET Core SignalR WebSockets',
      'Automated Auction Closing: A background worker runs every 15 seconds to safely check and finalize expired auctions without requiring user traffic',
      'Multi-Provider OAuth 2.0: Supports Google, GitHub, and Discord sign-in alongside two-factor authentication (TOTP) and local avatar storage',
      'Targeted SQL Indexing: Database index on (IsApproved, Name) with included price columns for fast catalog search queries',
    ],
    architecture: [
      'CQRS Action Separation: Standard pages use clean MVC controllers, while high-risk monetary actions (bidding, checkout) use MediatR commands',
      'Conflict Handling: Gracefully catches EF Core DbUpdateConcurrencyException to inform bidders when a higher bid placed first',
      'Memory Cache Guard: In-memory sliding cache absorbs rapid repeated clicks to protect SQL Server connection pools',
      'Background Service: Uses ASP.NET Core BackgroundService with IServiceScopeFactory to query and settle expired auctions cleanly',
      'Covering SQL Index: Satisfies catalog search queries directly from index pages to keep database turnaround fast',
    ],
    challenges: [
      'Handling simultaneous bids smoothly: Resolved by replacing slow pessimistic table locks with an 8-byte rowversion column and catching concurrency exceptions',
      'Finalizing auctions when no users are online: Resolved with an ASP.NET Core background service that checks expiration times every 15 seconds',
      'Managing external OAuth avatars: Built an HttpClient download pipeline to mirror third-party avatars locally so profiles always render reliably',
    ],
    outcome:
      'Delivered a stable, production-ready online auction platform that handles simultaneous bids cleanly, prevents duplicate charges, and updates prices live with SignalR.',
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
  hotelms: {
    overview:
      'Stayza is a full-stack hotel management system (PMS) and guest reservation portal designed for boutique resorts and luxury suites. It simplifies guest bookings with clear room catalogs, upfront 30% deposit calculation, and dedicated operational views for resort staff.',
    problem:
      'Resorts often struggle with disjointed systems: guests want a seamless, visual booking experience without hidden fees, while hotel staff need simple tools to manage rooms, check-ins, and cleaning schedules without complicated enterprise software.',
    solution:
      'I built a full-stack web application featuring an intuitive guest booking interface alongside role-based staff workflows. Guests can browse suites with clear amenity breakdowns and transparent 30% deposits, while staff access dedicated views for General Management, Front Desk Reception, and Housekeeping.',
    highlights: [
      'Suite Showcase with Transparent Pricing: Comprehensive room catalog detailing floor plans, amenities (helipad, private spa), and automated 30% deposit calculation',
      'Multi-Role Operational Portals: Dedicated workspaces for General Manager (Admin), Front Desk Reception, Housekeeping, and Guests with 1-click test authentication',
      'Slide-Out Guest Concierge: Convenient navigation drawer providing direct access to active reservation dates, digital keys, room service, and estate amenities',
      'Clean MERN Architecture: Structured RESTful API backend managing room availability, guest bookings, and operational status updates',
      'Responsive Editorial Design: Polished, modern UI built with React and Tailwind CSS that looks sharp on mobile, tablet, and desktop',
    ],
    architecture: [
      'RESTful API endpoints handling room availability, pricing calculations, and reservation records',
      'Role-based authorization distinguishing administrative reporting from front desk check-ins and housekeeping statuses',
      'Component-driven frontend with Tailwind CSS and responsive modal drawers for smooth guest navigation',
      'Schema-backed data models tracking room statuses (Available, Occupied, Maintenance) and reservation lifecycles',
    ],
    challenges: [
      'Designing Role-Specific Interfaces: Ensuring staff members only see the operational data relevant to their shift (e.g., Housekeeping sees room cleanliness status, Reception handles check-in/out) without cluttering the screen',
      'Transparent Booking Calculations: Accurately calculating nightly totals and required 30% advance deposits on the frontend while verifying calculations on the server',
    ],
    outcome:
      'Successfully delivered a responsive, easy-to-use resort management platform that streamlines guest reservations and unifies daily hotel operations across 4 distinct staff roles.',
  },
  shifamanagement: {
    overview:
      'ShifaManagement (SMS) is a clinical management platform built for Shifa Home Health Care to handle patient intake, care plan renewals, billing, and nursing staff coordination.',
    problem:
      'Home healthcare plans vary in duration (10 to 30 days) across distributed field nurses. Managing patient care manually caused billing discrepancies, missed renewal dates, duplicate invoice numbers, and care plan interruptions.',
    solution:
      'I built a cross-platform application using Flutter, Riverpod, and Supabase PostgreSQL. It features safe database-level invoice numbering, Row Level Security (RLS) for patient data privacy, 7-day advance renewal alerts, and isolated Staging and Production databases.',
    highlights: [
      'Consecutive Date Calculations: Automatically calculates renewal dates (Previous End Date + 1 day) to prevent coverage gaps and overlapping schedules',
      'Duplicate-Free Invoicing: A PostgreSQL stored procedure generates consecutive invoice numbers safely on the database, preventing number collisions',
      '7-Day Renewal Alerts: Calibrated renewal warnings with 1-click WhatsApp message generation pre-filled with patient details and care summaries',
      'Role-Based Data Privacy: Row Level Security (RLS) restricts staff to their assigned patients while giving supervisors full clinic visibility',
      'Dual Database Setup: Separate Staging and Production databases to keep testing data completely isolated from live billing records',
      '93 Automated Tests: Unit and widget test suite verifying plan expiration logic, date calculations, and common user errors',
    ],
    architecture: [
      'Cross-platform Flutter application with Riverpod for state management and stream providers',
      'Supabase PostgreSQL with stored procedures and database-level row locking (FOR UPDATE)',
      'Responsive mobile layout designed for single-row service editing on phone screens (320px – 412px)',
      'Real-time Supabase subscriptions for active patient rosters and renewal lists',
    ],
    challenges: [
      'Preventing billing date overlaps across different plan lengths: Enforced strict consecutive date formulas on all plan renewals',
      'Preventing duplicate invoice numbers when multiple staff create bills simultaneously: Solved by generating invoice numbers on the database rather than relying on client state',
      'Keeping test bills out of live accounting: Set up completely isolated Staging and Production databases',
    ],
    outcome:
      'Delivered a dependable clinical operating app currently used in production, eliminating duplicate billing and care plan gaps across mobile and desktop.',
  },
}

