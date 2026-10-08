const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'

export function resolveImage(url) {
  if (!url) return null
  return url.startsWith('http') ? url : `${BASE_URL}${url}`
}

export function eventCover(event) {
  return resolveImage(event.local_image || event.image_url)
}

export function formatDate(iso, lang) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang)
}