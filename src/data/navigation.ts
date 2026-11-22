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
    description: 'Selected work & skills',
    index: '01',
  },
  {
    label: 'Work',
    href: '/work',
    description: 'Projects & case studies',
    index: '02',
  },
  {
    label: 'About',
    href: '/about',
    description: 'Background, stack & contact',
    index: '03',
  },
  {
    label: 'Writing',
    href: '/writing',
    description: 'Articles & field notes',
    index: '04',
  },
]
