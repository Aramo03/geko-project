import { pickTranslation } from '../../api/client.js'

export function asCourseList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return null
}

export function courseTitle(course) {
  return pickTranslation(course?.translations)?.title || ''
}

export function courseDescription(course) {
  return pickTranslation(course?.translations)?.description || ''
}

export function courseSlug(title) {
  if (!title) return ''
  const map = {
    'Full-Stack Program': 'full-stack-program',
    JavaScript: 'javascript',
    Deployment: 'deployment',
  }
  if (map[title]) return map[title]
  return title.toLowerCase().replace(/\s+/g, '-')
}

export function courseCategoryLabel(course) {
  const cat = course?.category
  if (!cat) return ''
  return pickTranslation(cat.translations)?.text || ''
}

export function courseImage(course) {
  const url = course?.local_image || course?.image_url || ''
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = (import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  return `${base}${url.startsWith('/') ? url : `/${url}`}`
}
