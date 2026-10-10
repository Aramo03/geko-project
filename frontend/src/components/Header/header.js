export const NAV_ITEMS = [
  { to: '/', key: 'nav.home' },
  { to: '/about-us', key: 'nav.about' },
  { to: '/course-category', key: 'nav.courses' },
  { to: '/events', key: 'nav.events' },
  { to: '/contacts', key: 'nav.contacts' },
]

export const LANGUAGES = [
  { code: 'am', flag: '/images/flags/Armenia-flag.webp' },
  { code: 'en', flag: '/images/flags/USA-flag.webp' },
  { code: 'ru', flag: '/images/flags/Russia-flag.webp' },
]

export function findBlock(blocks, key) {
  if (!Array.isArray(blocks)) return null
  return blocks.find((block) => block?.key === key) || null
}

export function contactValue(blocks, field) {
  const header = findBlock(blocks, 'header')?.payload?.[field]
  const bar = findBlock(blocks, 'contacts_bar')?.payload?.[field]
  const value = typeof header === 'string' && header.trim() ? header : bar
  return typeof value === 'string' ? value.trim() : ''
}
