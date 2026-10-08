import { pickTranslation } from '../../api/client.js'

export const HOME_SECTIONS = [
  'hero',
  'trial-form',
  'categories',
  'popular-courses',
  'lesson-stats',
  'completed-events',
  'reviews',
]

export function asList(data) {
  return Array.isArray(data) ? data : null
}

export function lessonTitle(lesson) {
  return pickTranslation(lesson?.translations)?.title || ''
}

export function lessonContent(lesson) {
  return pickTranslation(lesson?.translations)?.content || ''
}

export function findBlock(blocks, key) {
  if (!Array.isArray(blocks)) return null
  return blocks.find((block) => block?.key === key) || null
}

export function blockText(value, language) {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''
  const code = (language || 'en').split('-')[0]
  if (Object.prototype.hasOwnProperty.call(value, code)) {
    return typeof value[code] === 'string' ? value[code].trim() : ''
  }
  const fallback = value.en
  return typeof fallback === 'string' ? fallback.trim() : ''
}
