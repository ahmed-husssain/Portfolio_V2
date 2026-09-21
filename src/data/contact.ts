export interface ContactConfig {
  name: string
  title: string
  email: string
  github: {
    label: string
    handle: string
    url: string
  }
  linkedin: {
    label: string
    handle: string
    url: string
  }
  location: {
    city: string
    country: string
    timezone: string
    timezoneNote: string
  }
  availability: {
    status: string
    workTypes: string[]
    note: string
  }
  services: string[]
  budgetRanges: string[]
}

export const CONTACT_CONFIG: ContactConfig = {
  name: 'Syed Ahmed Hussain',
  title: 'Backend-Focused .NET Developer',
  email: 'ahamedhussain067@gmail.com',
  github: {
    label: 'GitHub',
    handle: '@ahmed-husssain',
    url: 'https://github.com/ahmed-husssain',
  },
  linkedin: {
    label: 'LinkedIn',
    handle: 'in/ahmed-husssain',
    url: 'https://linkedin.com/in/ahmed-husssain',
  },
  location: {
    city: 'Karachi',
    country: 'Pakistan',
    timezone: 'Pakistan Standard Time (PKT / UTC+5)',
    timezoneNote: 'Available for remote and local engineering opportunities.',
  },
  availability: {
    status: 'AVAILABLE FOR ENGINEERING ROLES & SELECT WORK',
    workTypes: [
      '.NET & C# Web Applications',
      'ASP.NET Core Web API Development',
      'Relational Database Modeling & SQL Server',
      'Full-Stack Web Development',
      'Software Engineering Roles',
    ],
    note: 'Open for backend engineering roles, full-stack positions, and contract development.',
  },
  services: [
    'ASP.NET Core & Web API Development',
    'Relational Database Schema Design (SQL Server / MySQL)',
    'Full-Stack Web Applications (React / Tailwind CSS)',
    'Authentication & OAuth 2.0 Integration',
    'Software Engineering Roles',
  ],
  budgetRanges: [
    'Not yet defined / Exploratory',
    '< $1,000 (Small project / feature)',
    '$1,000 - $3,000 (Defined feature / MVP)',
    '$3,000+ (Full platform build)',
    'Employment / Contract Role',
  ],
}

export const CONTACT_LINKS = {
  github: CONTACT_CONFIG.github.url,
  linkedin: CONTACT_CONFIG.linkedin.url,
  email: CONTACT_CONFIG.email,
  review: '/review',
} as const

