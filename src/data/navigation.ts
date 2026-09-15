export interface NavItem {
  label: string
  href: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'System', href: '#system' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const AVAILABILITY_STATUS = {
  active: true,
  label: 'AVAILABLE FOR Q2 / Q3',
  indicator: 'ONLINE',
}
