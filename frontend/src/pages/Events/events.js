export const TABS = ['upcoming', 'happening', 'completed']
export const DEFAULT_TAB = 'completed'
export const PAST_LIMIT = 3

export function splitEvents(events, tab) {
  return {
    list: events[tab] || [],
    scheduled: [...events.happening, ...events.upcoming],
    past: tab === 'completed' ? [] : events.completed.slice(0, PAST_LIMIT),
  }
}
