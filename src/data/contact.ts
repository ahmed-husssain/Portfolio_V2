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
  name: 'Ahmed Hussain',
  title: 'Full-Stack Web Developer',
  email: 'ahmedhusssain.dev@gmail.com',
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
    timezoneNote: 'Comfortable with distributed, asynchronous communication workflows.',
  },
  availability: {
    status: 'AVAILABLE FOR SELECT WORK',
    workTypes: [
      'Web Application Engineering',
      'Backend & API Architecture',
      'Relational Database Modeling',
      'Performance Optimization',
      'Full-Stack Engineering Roles',
    ],
    note: 'Open for select product contracts, engineering roles, and system consulting.',
  },
  services: [
    'Web Application Development',
    'Backend Systems & API Design',
    'Database Architecture & Indexing',
    'Performance Profiling & Optimization',
    'Technical Architecture Consulting',
    'Full-Stack Engineering Role',
  ],
  budgetRanges: [
    'Not yet defined / Exploratory',
    '< $2,500 (Scattered sprint / audit)',
    '$2,500 - $5,000 (Defined feature / MVP)',
    '$5,000+ (Full product build / retainer)',
    'Employment / Contract Role',
  ],
}

export const CONTACT_LINKS = {
  github: CONTACT_CONFIG.github.url,
  linkedin: CONTACT_CONFIG.linkedin.url,
  email: CONTACT_CONFIG.email,
  review: '/review',
} as const

