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
  mockrithm: {
    overview:
      'Mockrithm is an enterprise-grade, full-stack AI career preparation platform that simulates realistic technical, behavioral, and system design interviews in real time. It unifies low-latency voice conversations, an embedded Monaco code sandbox, real-time competency tracking (STAR framework), an ATS resume tailoring engine, and a competitive ELO rating system into a cohesive, dark-themed SaaS experience.',
    problem:
      'Engineering job seekers face prohibitive mock interview costs ($100–$300/hour), high stakes and anxiety without a safe practice environment, fragmented tooling across disparate platforms (LeetCode, ATS checkers, speech coaches), and delayed feedback that misses critical contextual learning moments.',
    solution:
      'I engineered an all-in-one AI career intelligence platform featuring sub-second voice conversations (Groq Whisper Turbo + Edge Neural TTS), live STAR methodology telemetry with filler word audits, an embedded Monaco Editor code sandbox for pair programming, instant ATS resume parsing with keyword gap analysis, and a chess-style ELO skill rating benchmark.',
    highlights: [
      'Voice AI Interviewer: Dual-mode simulator (prompt generator & live room) with real-time speech-to-text and ultra-low latency voice responses',
      'Live STAR Telemetry: Evaluates responses against role-tailored dimensions (Situation, Task, Action, Result, Metrics) with live checklists',
      'Pacing & Articulation Audits: Monitors target speaking rate (120–150 WPM) and tracks vocal disfluencies (um, ah, basically, like)',
      'Monaco Code Sandbox: In-browser code editor with syntax highlighting and live problem prompts for technical pair-programming rounds',
      'ATS Resume Engine: 0–100 match scoring against job descriptions, missing skill detection, and real-time PDF generation',
      'Competitive ELO System: Chess-style rating progression based on interview performance; benchmarks readiness against global peers',
      'Gamified Learning Suite: Interactive Three.js/WebGL mini-games (CSS Frogger, Git simulator) with verifiable e-certificates',
      'Telemetry & Admin Suite: Real-time API key health monitor, audit logs, Stripe revenue analytics, and dynamic blog CMS',
    ],
    architecture: [
      'Next.js 16 (Turbopack, App Router) and React 19 frontend with Framer Motion, GSAP, and Three.js/OGL visuals',
      'Resilient multi-key load balancer (ApiKeyManager) pooling up to 50 API keys with dynamic rate-limit header parsing and exponential cooldowns',
      'Hybrid zero-cost voice pipeline: client-side VAD → Groq Whisper Turbo transcription → LLM streaming → Microsoft Edge Neural TTS',
      'Dual-engine LLM failover: Groq LLaMA 3.3-70B primary evaluation with automatic Google Gemini 2.5 Flash schema fallback via Zod',
      'Clerk SDK authentication paired with Firebase Admin SDK (Cloud Firestore) for secure role-based access control',
      'Complete Stripe monetization lifecycle covering subscription webhooks, Freemium, Premium, and Pro tier gating',
    ],
    challenges: [
      'Resilient Multi-Key Load Balancing: High-volume LLM and STT calls quickly exhausted provider rate limits (429 errors); engineered a custom ApiKeyManager pooling up to 50 keys that parses response headers (x-ratelimit-remaining-*) and isolates rate-limited keys with exponential cooldowns',
      'Hybrid Zero-Cost Voice Pipeline: Traditional conversational voice APIs incurred prohibitive per-minute costs; built a tiered architecture combining client-side VAD, Groq Whisper Turbo, LLM streaming, and Microsoft Edge Neural TTS with browser speech synthesis redundancy',
      'Dual-Engine LLM Fallback Architecture: Strict JSON schema validation failures and token timeouts risked interrupting live speech evaluation; implemented primary evaluation on Groq LLaMA 3.3-70B with seamless failover to Google Gemini 2.5 Flash using Zod schemas',
      'Mathematical ELO Rating Algorithm: Needed an objective, non-arbitrary progression metric for non-standardized interview performances; adapted chess ELO mathematics (calculateEloChange) to compute independent ratings for overall readiness, role specialization, and session difficulty',
    ],
    outcome:
      'Achieved < 1.2s voice turnaround latency for near-human conversational pacing, 99.9% AI availability under peak loads via predictive multi-key rotation and dual-provider fallback, and a production-ready commercial architecture with end-to-end Stripe monetization.',
  },
  'amber-property-corner': {
    overview:
      'I designed and engineered the complete full-stack web platform for Amber Property Corner, replacing a sluggish legacy setup with a fast Next.js frontend, PostgreSQL database, and role-based administrative dashboard.',
    problem:
      'Traditional real estate platforms frequently suffer from slow relational lookups, poor mobile indexing, and fragmented communication between prospective buyers and listing managers.',
    solution:
      'I built a server-rendered Next.js web platform backed by PostgreSQL and Prisma ORM. The architecture features indexed multi-criteria filtering, HTTP-only authenticated admin dashboards, and server-enforced role permissions for agents and administrators.',
    highlights: [
      'Sub-150ms indexed database query responses across large listing volumes',
      'Strict runtime request validation across all API boundaries using Zod schemas',
      'Server-side RBAC protecting administrative property publishing workflows',
      'Optimized listing detail pages with responsive image delivery',
    ],
    architecture: [
      'Relational PostgreSQL schema with normalized property, agent, and inquiry models',
      'Prisma ORM handling type-safe database queries and automated schema migrations',
      'Server-rendered listing pages optimizing search engine crawling and Core Web Vitals',
      'Secure session cookies with bcryptjs password hashing for admin panel isolation',
    ],
    challenges: [
      'Optimizing multi-parameter filter queries across price, location, and property type without triggering full table scans',
      'Implementing secure image asset uploads and responsive delivery for high-resolution property galleries',
    ],
    outcome:
      'Achieved a 95+ Mobile Lighthouse score, reliable administrative property workflows, and sub-150ms query turnaround times in production.',
  },
  'careflow-connect': {
    overview:
      'ShifaManagement is an enterprise home healthcare management system engineered for clinical administrators, medical supervisors, and field staff managing decentralized home healthcare operations (including specialized nursing, elderly attendants, physiotherapy, and post-operative home ICU care) across mobile and desktop environments.',
    problem:
      'Home healthcare introduces severe operational hurdles: calculating margins and dynamic per-diem service rates across fluctuating disciplines (physiotherapy, ICU nursing, attendants), 14-day recurring care plan renewal blindspots that cause patient care gaps, paper invoice delivery failure in remote home settings, and Firebase client SDK session resets when administrators provision new staff accounts.',
    solution:
      'I engineered a Feature-First Clean Architecture system built on Flutter and Dart paired with a dual-tier Firebase backend. The system features reactive Riverpod stream synchronization, dynamic service fee computation, an automated 14-day care renewal engine with normalized WhatsApp dispatch, off-thread vector PDF/300 DPI raster invoice generation, and session-preserving staff provisioning.',
    highlights: [
      'Decentralized Clinical Intake: Captures diagnostic history, attending staff, and computes 30-day projected patient costs, staff payouts, and clinic margins via dynamic HealthcareServicesSelector',
      'Automated 14-Day Renewal Pipeline: Multi-stream provider calculating rolling expiration horizons, categorizing follow-ups (expired, today, upcoming, scheduled), and generating localized WhatsApp dispatch links',
      'Dual-Format Document Engine: Off-thread A4 vector PDF construction and high-resolution 300 DPI PNG rasterization for instant mobile messaging',
      'Session-Preserving Staff Provisioning: Dual operating modes using Cloud Functions v2 on Blaze tiers and ephemeral secondary FirebaseApp sandboxing on Spark tiers to prevent administrator session drops',
      'Real-Time Live Telemetry: Dashboard metrics tracking active patients, aggregate monthly billing, pending invoices, and regex-shortened activity audit feeds',
      'Role-Enforced Shell Layout: GoRouter ShellRoute dynamically rendering administrative controls vs. staff-restricted patient and earnings views',
      'Invariant Protection: Cloud Functions enforce immutable master accounts and a hard invariant preventing deletion or deactivation of the last remaining Admin',
    ],
    architecture: [
      'Feature-first Flutter architecture built with Dart SDK ^3.12.0 and Riverpod v3.3.2 StreamProviders',
      'GoRouter v17.3.0 ShellRoute layout managing role-based responsive navigation across mobile and desktop',
      'Google Cloud Firestore data layer with atomic batch writes linking clinical records, /activities audit trails, and /system_metrics',
      'Dual-tier administrative provisioning: Cloud Functions v2 (Node.js 18) with custom claims, backed by client-side secondary FirebaseApp sandboxing',
      'Dual-path document pipeline using pdf v3.13.0 and printing v5.15.0 for asynchronous vector and 300 DPI raster generation',
      'Regex-driven telephony normalization converting Pakistan phone formats (03xx to 923xx) for direct WhatsApp API deep linking',
    ],
    challenges: [
      'Reactive Multi-Stream Expiration Pipeline: Reconciling disparate asynchronous sources (patient records, historical invoices, ad-hoc reminders) caused UI lag; engineered a unified StreamProvider that projects deterministic 14-day renewal horizons and normalizes regional phone numbers for zero-cost WhatsApp dispatch',
      'Client-Side Document Vectorization & 300 DPI Rasterization: Multi-page graphical invoice layouts caused UI thread stutter on low-resource mobile clients; architected InvoiceExporter to assemble vector PDFs off-thread with automatic Firestore metadata fallbacks and two-stage Printing.raster image exportation',
      'Session-Preserving Administrative Staff Provisioning: FirebaseAuth.createUser switches the active client session, locking out administrators on Spark plans; engineered an ephemeral secondary FirebaseApp container that creates credentials in isolation, paired with a forceLogoutToken server timestamp listener for instant deactivation propagation',
      'Invariant Protection & Atomic Audit Logging: Admin deletions risked orphaning billing ledgers or locking clinics out; enforced backend active admin inventory checks and wrapped all clinical, financial, and metric writes inside atomic Firestore batch operations',
    ],
    outcome:
      'Delivered deterministic sub-second multi-device synchronization via Firestore streams, eliminated administrative session drops with isolated FirebaseApp sandboxing, ensured resilient offline operation with atomic batch transactions, and standardized regional telephony formatting for reliable WhatsApp renewal dispatch.',
  },
  'e-books': {
    overview:
      'I created E-Books as a lightweight digital publication library and reader application, focused on fast catalog browsing and clean reading typography with minimal server resource consumption.',
    problem:
      'Digital publication readers needed a fast, low-footprint catalog interface with reliable search, bookmarking, and low server resource consumption on standard hosting hardware.',
    solution:
      'I developed a PHP and MySQL application utilizing normalized database schemas, server-rendered views, clean RESTful endpoints, and responsive Tailwind CSS styling.',
    highlights: [
      'Normalized relational tables for authors, genres, publications, and reader bookmarks',
      'Fast catalog querying across hundreds of digital volumes with minimal memory usage',
      'Clean responsive reading views formatted for both desktop and mobile screens',
      'Modular backend code organized with explicit data access separation',
    ],
    architecture: [
      'Structured PHP backend routing with modular service and data access layers',
      'Normalized MySQL relational tables with foreign key constraints and category indexing',
      'Tailwind CSS design system providing clean typography and high-contrast reading ergonomics',
    ],
    challenges: [
      'Optimizing pagination and search queries across extensive book catalogs on limited server hardware',
      'Designing comfortable typography and dark/light reading ergonomics for longform content',
    ],
    outcome:
      'Successfully deployed an efficient, fast-loading digital library platform operating reliably with low server resource overhead.',
  },
}
