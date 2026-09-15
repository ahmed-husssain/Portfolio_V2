export interface Project {
  id: string
  index: string
  title: string
  category: string
  tagline: string
  description: string
  role: string
  problem: string
  solution: string
  outcome: string
  keyDecisions: string[]
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

export const PROJECTS: Project[] = [
  {
    id: 'mockrithm',
    index: '01',
    title: 'Mockrithm',
    category: 'AI / Full-Stack Web Application',
    tagline: 'AI-Powered Interview Simulation & Resume Assessment',
    description:
      'A technical interview preparation platform that conducts interactive voice interviews and evaluates resumes with structured, actionable feedback.',
    role: 'Full-Stack Developer (End-to-End Architecture)',
    problem:
      'Job seekers lack low-stakes environments to practice vocal technical interviews and receive objective scoring against specific job descriptions.',
    solution:
      'Engineered an automated interview simulator integrating conversational AI voice agents with document parsing algorithms to conduct live question-and-answer sessions and deliver detailed performance rubrics.',
    outcome:
      'Sub-second voice response latency with persistent session logging and multi-criteria interview scoring.',
    keyDecisions: [
      'Implemented real-time bidirectional audio streaming via Vapi for natural conversational cadence',
      'Leveraged Google AI SDK for structured rubric scoring and targeted resume critique',
      'Designed Firestore collections with strict indexing to query user session histories efficiently',
    ],
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
    liveUrl: 'https://mockrithm.vercel.app/',
    githubUrl: 'https://github.com/AhapraxAhmed/mockrithm',
    featured: true,
  },
  {
    id: 'amber-property-corner',
    index: '02',
    title: 'Amber Property Corner',
    category: 'Real Estate / Full-Stack Web Application',
    tagline: 'High-Throughput Property Discovery & Lead Routing Platform',
    description:
      'A production real estate portal designed for fast property discovery, multi-parameter geographic queries, and secure administrative listing workflows.',
    role: 'Full-Stack Developer & Database Architect',
    problem:
      'Traditional agency portals suffered from slow database queries, poor mobile SEO indexing, and fragmented lead communication between agents and buyers.',
    solution:
      'Built a server-rendered Next.js application backed by PostgreSQL and Prisma ORM, featuring indexed filtering, HTTP-only authenticated admin dashboards, and role-based permissions.',
    outcome:
      '95+ Mobile Lighthouse performance score, sub-150ms query responses, and a fully centralized listing pipeline.',
    keyDecisions: [
      'Architected relational schema in PostgreSQL with Prisma ORM for efficient relational lookups',
      'Enforced strict runtime validation across all API boundaries using Zod schemas',
      'Implemented secure cookie-based session management with bcryptjs password hashing and server-side RBAC',
    ],
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
    liveUrl: 'https://amberpropertycorner.com',
    featured: true,
  },
  {
    id: 'shifa-careflow',
    index: '03',
    title: 'Shifa / CareFlow',
    category: 'Healthcare / Mobile Application',
    tagline: 'Cross-Platform Patient Record & Appointment Management',
    description:
      'A mobile clinical administration system built to streamline patient intake, practitioner schedules, medical documentation, and push appointment notifications.',
    role: 'Mobile Application Developer',
    problem:
      'Outpatient clinics struggled with missed consultations, paper patient charts, and inconsistent scheduling records between front desk and clinicians.',
    solution:
      'Developed a responsive Flutter application utilizing reactive Riverpod state management and Firebase backend services to provide instant appointment synchronization and record access.',
    outcome:
      'Instant multi-device scheduling updates and reliable real-time push dispatching across Android and iOS.',
    keyDecisions: [
      'Utilized Riverpod for declarative, testable state management across nested patient data flows',
      'Configured Firebase Cloud Messaging with targeted topic dispatch for automated appointment alerts',
      'Enforced Firebase Security Rules for role-segmented data isolation between staff and patients',
    ],
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
    githubUrl: 'https://github.com/ahmed-husssain',
    featured: false,
  },
  {
    id: 'ebooks',
    index: '04',
    title: 'E-Books',
    category: 'Digital Library / Full-Stack Web Application',
    tagline: 'Digital Publication Catalog & Reading Platform',
    description:
      'A full-stack digital publication repository providing catalog indexing, book reader views, user profiles, and administrative book management.',
    role: 'Backend & Web Developer',
    problem:
      'Independent readers required a lightweight, fast catalog interface with reliable search, bookmarking, and low server footprint.',
    solution:
      'Constructed a PHP and MySQL web application with normalized relational tables, server-rendered views, and responsive styling.',
    outcome:
      'Fast catalog queries across extensive book listings with minimal server resource overhead.',
    keyDecisions: [
      'Designed normalized MySQL database schema for categories, authors, and reader activities',
      'Implemented clean RESTful endpoints for catalog filtering and member authentication',
      'Applied utility-first Tailwind CSS for consistent typography across desktop and mobile readers',
    ],
    technologies: ['PHP', 'MySQL', 'Tailwind CSS', 'JavaScript', 'REST API'],
    liveUrl: 'http://64.23.237.187/ebooks',
    githubUrl: 'https://github.com/AhapraxAhmed/E-books',
    featured: false,
  },
]
