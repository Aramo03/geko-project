export { asList } from '../../pages/Home/home.js'
export {
  lessonTitle,
  lessonContent,
} from '../../pages/Home/home.js'

export function lessonImage(lesson) {
  const raw = lesson?.image || lesson?.local_image || lesson?.image_url || ''
  if (!raw || raw.startsWith('https://') || raw.startsWith('http://')) return raw
  const base = (import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  return `${base}${raw.startsWith('/') ? '' : '/'}${raw}`
}
