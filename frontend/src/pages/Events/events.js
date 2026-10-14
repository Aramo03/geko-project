export const TABS = ['upcoming', 'happening', 'completed']
export const DEFAULT_TAB = 'completed'

export function emptyEventsByStatus() {
  return { upcoming: [], happening: [], completed: [] }
}

export function asEventList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return null
}

export async function fetchEventsByStatus(client) {
  const grouped = emptyEventsByStatus()
  const batches = await Promise.all(
    TABS.map((status) =>
      client.get('/api/events/', { params: { status } }).then((res) => ({
        status,
        list: asEventList(res.data),
      })),
    ),
  )
  for (const batch of batches) {
    if (!batch.list) return null
    grouped[batch.status] = batch.list
  }
  return grouped
}

export function isEventsTab(tab) {
  return TABS.includes(tab)
}
