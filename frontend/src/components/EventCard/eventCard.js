import { api } from '../../api/client.js'

const LOCALES = { am: 'hy-AM', en: 'en-GB', ru: 'ru-RU' }

export function resolveImage(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  const base = (api.defaults.baseURL || '').replace(/\/$/, '')
  return `${base}${url}`
}

export function eventCover(event) {
  return resolveImage(event.local_image || event.image_url)
}

export function formatDate(iso, lang) {
  if (!iso) return ''
  const code = (lang || 'en').split('-')[0]
  return new Date(iso).toLocaleDateString(LOCALES[code] || 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
