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
    title: 'Server Logic',
    stack: ['C#', '.NET 8', 'ASP.NET Core', 'SignalR', 'EF Core', 'CQRS'],
    description: "Fast .NET endpoints that don't deadlock when lots of users click at once.",
    projectSlug: 'online-art-gallery',
    projectLabel: 'Online Art Gallery',
  },
  {
    index: '02',
    title: 'Data Storage',
    stack: ['PostgreSQL 15', 'SQL Server', 'Supabase', 'Row-Level Security', 'B-Tree'],
    description: 'Clean schemas, protected patient records, and indexes that keep queries fast.',
    projectSlug: 'shifamanagement',
    projectLabel: 'ShifaManagement',
  },
  {
    index: '03',
    title: 'User Interfaces',
    stack: ['Flutter 3.27+', 'Dart', 'React 19', 'TypeScript', 'Tailwind CSS'],
    description: 'Flutter apps for phones and tablets, plus clean React frontends for the web.',
    projectSlug: 'mockrithm',
    projectLabel: 'Mockrithm',
  },
  {
    index: '04',
    title: 'Security & Shipping',
    stack: ['OAuth 2.0', 'TOTP 2FA', 'BackgroundService', 'Git', 'Postman'],
    description: 'Safe logins with 2FA, background worker queues, and disciplined Git commits.',
    projectSlug: 'e-books',
    projectLabel: 'E-Books',
  },
]
