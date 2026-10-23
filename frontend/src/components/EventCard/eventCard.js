import { mediaUrl } from '../../api/client.js'

const LOCALES = { am: 'hy-AM', en: 'en-GB', ru: 'ru-RU' }

export function resolveImage(url) {
  if (!url) return ''
  if (url.startsWith('https://') || url.startsWith('http://')) return url
  return mediaUrl(url)
}

export function eventCover(event) {
  return resolveImage(event?.local_image || event?.image_url || '')
}

export function formatDate(iso, lang) {
  if (!iso) return ''
  const code = (lang || 'en').split('-')[0]
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  try {
    return date.toLocaleDateString(LOCALES[code] || 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return date.toLocaleDateString()
  }
}
