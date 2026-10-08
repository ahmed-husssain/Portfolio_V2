export interface NavItem {
  label: string
  href: string
  description?: string
  index?: string
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Index',
    href: '/',
    description: 'Overview & flagship systems',
    index: '01',
  },
  {
    label: 'Work',
    href: '/work',
    description: 'Case studies & architecture',
    index: '02',
  },
  {
    label: 'About',
    href: '/about',
    description: 'Engineering background & stack',
    index: '03',
  },
  {
    label: 'Writing',
    href: '/writing',
    description: 'Technical notes & breakdowns',
    index: '04',
  },
  {
    label: 'Contact',
    href: '/contact',
    description: "Get in touch & inquiries",
    index: '05',
  },
]

export const AVAILABILITY_STATUS = {
  active: true,
  label: 'AVAILABLE FOR ROLES',
  indicator: 'ONLINE',
}
