export interface Capability {
  index: string
  title: string
  stack: string[]
  description: string
  projectSlug: string
  projectLabel: string
}

export const CAPABILITIES: Capability[] = [
  {
    index: '01',
    title: 'Backend Systems',
    stack: ['C#', '.NET 8', 'ASP.NET Core', 'SignalR', 'EF Core 8', 'CQRS'],
    description: 'REST APIs, real-time WebSocket bidding streams, and background tasks in C# and .NET 8.',
    projectSlug: 'online-art-gallery',
    projectLabel: 'Online Art Gallery',
  },
  {
    index: '02',
    title: 'Database Design',
    stack: ['PostgreSQL 15', 'SQL Server', 'Supabase', 'Row-Level Security', 'B-Tree Indexes'],
    description: 'Relational database schemas, index tuning for fast queries, and Row-Level Security for patient privacy.',
    projectSlug: 'shifamanagement',
    projectLabel: 'ShifaManagement',
  },
  {
    index: '03',
    title: 'Client Applications',
    stack: ['Flutter 3.27+', 'Dart', 'Riverpod', 'React 19', 'TypeScript', 'Tailwind CSS'],
    description: 'Cross-platform mobile apps for iOS and Android in Flutter, and responsive web interfaces in React.',
    projectSlug: 'mockrithm',
    projectLabel: 'Mockrithm',
  },
  {
    index: '04',
    title: 'Tooling & Security',
    stack: ['OAuth 2.0', 'TOTP 2FA', 'BackgroundService', 'Git & GitHub', 'Postman'],
    description: 'Two-factor authentication, automated background jobs, version control, and tested API endpoints.',
    projectSlug: 'e-books',
    projectLabel: 'E-Books',
  },
]
