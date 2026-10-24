import { mediaUrl, pickTranslation } from '../../api/client.js'

export function categoryLabel(category) {
  return pickTranslation(category?.translations)?.text || ''
}

export function categoryImage(category) {
  const raw = category?.local_image || category?.image_url || ''
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  return mediaUrl(raw)
}
