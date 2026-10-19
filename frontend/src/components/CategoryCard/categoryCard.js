import { pickTranslation } from '../../api/client.js'

export function categoryLabel(category) {
  return pickTranslation(category?.translations)?.text || ''
}

export function categoryImage(category) {
  const raw = category?.local_image || category?.image_url || ''
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  const base = (import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  return `${base}${raw.startsWith('/') ? '' : '/'}${raw}`
}
