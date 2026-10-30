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
]
