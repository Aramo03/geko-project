import { pickTranslation } from '../../api/client.js'

export const TITLE = 'Contacts'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function asBlockList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return []
}

export function categoryOptions(data) {
  const list = Array.isArray(data) ? data : data?.results
  if (!Array.isArray(list)) return []
  return list.map((item) => ({
    id: item.id,
    label: pickTranslation(item.translations)?.text || `#${item.id}`,
  }))
}

export function localizedText(value, language) {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''
  const code = (language || 'en').split('-')[0]
  const pick = value[code] || value.en || value.am || value.ru || ''
  return typeof pick === 'string' ? pick.trim() : ''
}

function payloadOf(blocks, key) {
  const block = (blocks || []).find(
    (item) => item?.key === key && item.is_visible !== false,
  )
  return block?.payload && typeof block.payload === 'object' ? block.payload : {}
}

export function contactDetails(blocks, language) {
  const contacts = payloadOf(blocks, 'contacts_bar')
  const header = payloadOf(blocks, 'header')
  const footer = payloadOf(blocks, 'footer')
  return {
    phone: localizedText(contacts.phone || header.phone || footer.phone, language),
    email: localizedText(contacts.email || header.email || footer.email, language),
    address: localizedText(footer.address || contacts.address, language),
    map: localizedText(footer.map, language),
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
