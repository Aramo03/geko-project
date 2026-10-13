export const TABS = ['upcoming', 'happening', 'completed']
export const DEFAULT_TAB = 'completed'
export const PAST_LIMIT = 3

export function emptyEventsByStatus() {
  return { upcoming: [], happening: [], completed: [] }
}

export function groupEventsByStatus(items) {
  const next = emptyEventsByStatus()
  for (const event of items) {
    const status = event.status
    if (TABS.includes(status)) {
      next[status].push(event)
    }
  }
  return next
}

export function toRelativeApiPath(nextUrl, baseURL) {
  if (!nextUrl) return null
  const base = (baseURL || '').replace(/\/$/, '')
  if (base && nextUrl.startsWith(base)) {
    const path = nextUrl.slice(base.length)
    return path.startsWith('/') ? path : `/${path}`
  }
  if (nextUrl.startsWith('/')) return nextUrl
  try {
    const url = new URL(nextUrl)
    return url.pathname + url.search
  } catch {
    return null
  }
}

export function splitEvents(events, tab) {
  return {
    list: events[tab] || [],
    scheduled: [...events.happening, ...events.upcoming],
    past: tab === 'completed' ? [] : events.completed.slice(0, PAST_LIMIT),
  }
}
