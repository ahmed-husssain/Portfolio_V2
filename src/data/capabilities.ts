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
    title: 'Backend & Core',
    subtitle: 'SERVER RUNTIMES & APIS',
    description:
      'Building scalable web applications and robust APIs with clean architecture, strong typing, and production-grade reliability.',
    items: [
      'C#',
      'ASP.NET Core (MVC & Web API)',
      'EF Core',
      'LINQ',
      'REST APIs',
      'Idempotent API Design',
      'PHP',
    ],
    keyFocus: 'Clean architecture, idempotent API design, and maintainable business logic.',
  },
  {
    index: '02',
    title: 'Database & Security',
    subtitle: 'PERSISTENCE & ACCESS CONTROL',
    description:
      'Designing relational schemas, optimizing query indexing, and enforcing multi-provider authentication and role-based access control.',
    items: [
      'SQL Server',
      'MySQL',
      'OAuth 2.0',
      'ASP.NET Core Identity',
      'Role-Based Access (RBAC)',
      'Schema Design & Indexing',
    ],
    keyFocus: 'Relational schema design, query indexing, and secure authentication.',
  },
  {
    index: '03',
    title: 'Frontend & UI',
    subtitle: 'CLIENT INTERFACES & STYLING',
    description:
      'Crafting fast, responsive interfaces that communicate seamlessly with backend services using modern component architecture.',
    items: ['JavaScript', 'React.js', 'Tailwind CSS', 'Next.js', 'HTML5 & CSS3'],
    keyFocus: 'Responsive design, clean component hierarchy, and fast user interactions.',
  },
  {
    index: '04',
    title: 'Tools & Workflow',
    subtitle: 'DEVELOPMENT & COLLABORATION',
    description:
      'Employing industry-standard developer tooling to write, inspect, test, and ship maintainable software with confidence.',
    items: [
      'Git & GitHub',
      'Visual Studio',
      'Postman',
      'Clean Architecture',
      'Query Optimization',
      'API Testing',
    ],
    keyFocus: 'Version control workflows, API endpoint testing, and code maintainability.',
  },
]
