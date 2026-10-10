import { pickTranslation } from '../../api/client.js'

export const TITLE = 'Contacts'

export function categoryOptions(data) {
  const list = Array.isArray(data) ? data : data?.results
  if (!Array.isArray(list)) return []
  return list.map((item) => ({
    id: item.id,
    label: pickTranslation(item.translations)?.text || `#${item.id}`,
  }))
}

export function contactPayload(data) {
  const payload = {
    full_name: data.full_name,
    email: data.email,
    whatsapp: data.whatsapp || '',
    country: data.country || '',
    message: data.message,
  }
  if (data.category) {
    payload.category = Number(data.category)
  }
  return payload
}
