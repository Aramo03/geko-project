import { pickTranslation } from '../../api/client.js'

export function courseTitle(course) {
  return pickTranslation(course?.translations)?.title || ''
}

export function courseDescription(course) {
  const translation = pickTranslation(course?.translations)
  return translation?.description || translation?.desc || ''
}

export function courseImage(course) {
  const raw = course?.local_image || course?.image_url || ''
  if (!raw || raw.startsWith('https://')) return raw
  const base = (import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  if (raw.startsWith('http://')) return raw
  return `${base}${raw.startsWith('/') ? '' : '/'}${raw}`
}
