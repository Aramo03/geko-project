const LOCALES = { am: 'hy-AM', en: 'en-GB', ru: 'ru-RU' }

export function resolveImage(url) {
  if (!url) return ''
  if (url.startsWith('https://') || url.startsWith('http://')) return url
  const base = (import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
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
