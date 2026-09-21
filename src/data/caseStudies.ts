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
      'Online Art Gallery is a full-stack e-commerce and auction web platform built for digital and AI-generated artwork. It features real-time bidding, user authentication, shopping cart workflows, and relational database management.',
    problem:
      'Digital art creators and collectors need a trustworthy marketplace where they can showcase work, participate in transparent auctions, and purchase artwork securely without complex setup.',
    solution:
      'I architected a full-stack web application using ASP.NET Core MVC, Entity Framework Core, and SQL Server, complete with multi-provider OAuth 2.0 authentication, an automated auction engine, and clean shopping cart workflows.',
    highlights: [
      'Multi-provider authentication using OAuth 2.0 (Google, GitHub, Discord) and ASP.NET Core Identity',
      'Automated bidding and auction engine with live price recalculation and bid history tracking',
      'Integrated shopping cart and checkout pipeline for instant purchases',
      'Normalized SQL Server database schema with indexing on high-traffic listings',
    ],
    architecture: [
      'ASP.NET Core MVC with clean separation between controllers, services, and repository layers',
      'Entity Framework Core with LINQ queries and automated database migrations',
      'OAuth 2.0 and cookie-based authentication with role-based permissions (RBAC)',
      'SQL Server relational database with foreign key integrity and query index tuning',
    ],
    challenges: [
      'Preventing race conditions during live bidding when multiple users submit competing bids simultaneously',
      'Configuring multi-provider OAuth claims and merging them into unified user profiles',
    ],
    outcome:
      'Successfully delivered a production-grade e-commerce and auction platform with reliable authentication, fast SQL queries, and a smooth checkout experience.',
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
      'ShifaManagement is a cross-platform healthcare operations system designed for patient intake, service fee calculation, care plan tracking, and invoice dispatch.',
    problem:
      'Home healthcare services needed a centralized system to coordinate staff schedules, track 14-day renewal dates, and dispatch digital invoices reliably.',
    solution:
      'I engineered a cross-platform application using Flutter and Firebase, featuring automated renewal reminders and WhatsApp invoice generation.',
    highlights: [
      'Patient intake workflows with diagnostic history and dynamic service fee calculation',
      'Automated 14-day care plan renewal tracking to prevent coverage lapses',
      'PDF invoice generation with direct WhatsApp dispatch links',
      'Multi-platform support across Android, Windows, macOS, and Web',
    ],
    architecture: [
      'Flutter application architecture with reactive state management',
      'Cloud Firestore real-time database with role-based security rules',
      'Asynchronous document pipeline for PDF and invoice generation',
    ],
    challenges: [
      'Automating care plan renewal dates across rolling patient schedules',
      'Generating lightweight invoices that send instantly through mobile messaging apps',
    ],
    outcome:
      'Successfully deployed a comprehensive healthcare operations system simplifying patient billing and staff coordination.',
  },
}

