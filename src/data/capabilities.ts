export interface CapabilityGroup {
  index: string
  title: string
  subtitle: string
  description: string
  items: string[]
  keyFocus: string
}

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    index: '01',
    title: 'Frontend Development',
    subtitle: 'INTERFACES & APPLICATION RUNTIMES',
    description:
      'I build responsive, accessible interfaces and production-ready web applications. Focused on strict TypeScript safety, clean component hierarchy, fast initial paint, and zero layout shift.',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    keyFocus: 'Semantic accessibility, responsive ergonomics, and minimal bundle footprint.',
  },
  {
    index: '02',
    title: 'Backend & APIs',
    subtitle: 'SERVER LOGIC & CONTRACT ARCHITECTURE',
    description:
      'I design RESTful APIs, server-side business logic, and backend application architectures for real products. Focused on clean controller-service separation, structured validation pipelines, and secure session management.',
    items: ['ASP.NET Core', 'REST APIs', 'PHP', 'Laravel', 'Node.js', 'Authentication', 'Authorization'],
    keyFocus: 'API contract design, middleware pipelines, and structured error handling.',
  },
  {
    index: '03',
    title: 'Data & Storage',
    subtitle: 'PERSISTENCE & SCHEMAS',
    description:
      'I architect practical data models, relational database schemas, and document layers based on real application access patterns. Focused on relational integrity, fast indexed queries, and type-safe data access.',
    items: ['PostgreSQL', 'SQL Server', 'MySQL', 'Firebase / Firestore', 'Prisma ORM', 'Entity Framework Core'],
    keyFocus: 'Relational schema modeling, query efficiency, and migration reliability.',
  },
  {
    index: '04',
    title: 'Engineering Practice',
    subtitle: 'DISCIPLINE & ARCHITECTURE',
    description:
      'The core software engineering principles that guide how I structure code, protect systems, and ensure long-term maintainability. This demonstrates how I think and solve problems, not just what tools I know.',
    items: [
      'API & Schema Design',
      'Server-Side RBAC',
      'Performance Optimization',
      'Input Validation & Sanitization',
      'Maintainable Code Structure',
      'Git Version Control & Deployment',
    ],
    keyFocus: 'Writing software that is predictable to maintain, secure by default, and practical to scale.',
  },
]
