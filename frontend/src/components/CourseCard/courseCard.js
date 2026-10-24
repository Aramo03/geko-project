import { mediaUrl, pickTranslation } from '../../api/client.js'

export function courseTitle(course) {
  return pickTranslation(course?.translations)?.title || ''
}

export function courseDescription(course) {
  return pickTranslation(course?.translations)?.description || ''
}

export function courseImage(course) {
  const raw = course?.local_image || course?.image_url || ''
  if (!raw || raw.startsWith('https://')) return raw
  return mediaUrl(raw)
}
