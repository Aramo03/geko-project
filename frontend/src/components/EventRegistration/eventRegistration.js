import { pickTranslation } from '../../api/client.js'

export function eventLabel(event, fallback) {
  return pickTranslation(event.translations)?.title || fallback
}

export function registrationPayload(data, events, fallbackTitle) {
  const event = events.find((item) => String(item.id) === String(data.event_id))
  const title = event ? eventLabel(event, fallbackTitle) : fallbackTitle
  return {
    full_name: data.full_name,
    email: data.email,
    message: `Event registration: ${title} (#${data.event_id})`,
  }
}
