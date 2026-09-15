export interface Project {
  id: string
  index: string
  title: string
  tagline: string
  description: string
  specs: { label: string; value: string }[]
  stack: string[]
  liveUrl?: string
  githubUrl?: string
}

export const PREVIEW_PROJECTS: Project[] = [
  {
    id: 'amber-property',
    index: '01',
    title: 'Amber Property Corner',
    tagline: 'Enterprise Real Estate Platform',
    description:
      'Engineered a multi-tier real estate system with SSR property indexing, interactive geographical query filters, and high-performance server caching.',
    specs: [
      { label: 'ARCHITECTURE', value: 'Next.js App Router + Node.js' },
      { label: 'DATABASE', value: 'PostgreSQL + Prisma ORM' },
      { label: 'PERFORMANCE', value: '98/100 Mobile Lighthouse' },
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma', 'Docker'],
    liveUrl: 'https://amberpropertycorner.com',
  },
  {
    id: 'shifa-healthcare',
    index: '02',
    title: 'Shifa Healthcare Platform',
    tagline: 'HIPAA-Compliant Patient Portal',
    description:
      'Full-stack digital healthcare management platform delivering real-time appointment dispatching, patient records management, and teleconsultation scheduling.',
    specs: [
      { label: 'ARCHITECTURE', value: 'React + Node/Express REST API' },
      { label: 'SECURITY', value: 'RBAC + Encrypted Storage' },
      { label: 'LATENCY', value: '<120ms P95 API Response' },
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Tailwind CSS'],
    liveUrl: '#',
  },
]
