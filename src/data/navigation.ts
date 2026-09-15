export interface NavItem {
  label: string
  href: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const AVAILABILITY_STATUS = {
  active: true,
  label: 'AVAILABLE FOR SELECT PROJECTS',
  indicator: 'ONLINE',
}
