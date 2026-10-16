import { pickTranslation } from '../../api/client.js'
import { contactChannels } from '../../lib/uiBlocks.jsx'

export const TITLE = 'Contacts'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function categoryOptions(data) {
  const list = Array.isArray(data) ? data : data?.results
  if (!Array.isArray(list)) return []
  return list.map((item) => ({
    id: item.id,
    label: pickTranslation(item.translations)?.text || `#${item.id}`,
  }))
}

export function contactDetails(blocks, addressLine) {
  const { phone, email, map } = contactChannels(blocks)
  return {
    phone,
    email,
    address: typeof addressLine === 'string' ? addressLine.trim() : '',
    map,
  }
}

export function telHref(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, '')}`
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
