export interface NavItem {
  label: string
  href: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Index', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Writing', href: '/writing' },
  { label: 'Contact', href: '/contact' },
]

export const AVAILABILITY_STATUS = {
  active: true,
  label: 'AVAILABLE FOR SELECT PROJECTS',
  indicator: 'ONLINE',
}
