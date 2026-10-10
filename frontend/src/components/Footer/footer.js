export const NAV_ITEMS = [
  { to: '/', key: 'nav.home' },
  { to: '/about-us', key: 'nav.about' },
  { to: '/course-category', key: 'nav.courses' },
  { to: '/events', key: 'nav.events' },
  { to: '/contacts', key: 'nav.contacts' },
]

export function findBlock(blocks, key) {
  if (!Array.isArray(blocks)) return null
  return blocks.find((block) => block?.key === key) || null
}

export function footerValue(blocks, field) {
  const footer = findBlock(blocks, 'footer')?.payload?.[field]
  const bar = findBlock(blocks, 'contacts_bar')?.payload?.[field]
  const value = typeof footer === 'string' && footer.trim() ? footer : bar
  return typeof value === 'string' ? value.trim() : ''
}
