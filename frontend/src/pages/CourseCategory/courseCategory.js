import { pickTranslation } from '../../api/client.js'

export function asList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return null
}

export function categoryTitle(category) {
  return pickTranslation(category?.translations)?.text || ''
}

export function courseTitle(course) {
  return pickTranslation(course?.translations)?.title || ''
}

export function courseDescription(course) {
  const translation = pickTranslation(course?.translations)
  return translation?.description || translation?.desc || ''
}

export function mediaUrl(raw) {
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  const base = (import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  return `${base}${raw.startsWith('/') ? '' : '/'}${raw}`
}

export function courseImage(course) {
  return mediaUrl(course?.image_url || course?.local_image)
}
