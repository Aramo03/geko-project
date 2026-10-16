import { pickTranslation } from '../../api/client.js'

export function asList(data) {
  return Array.isArray(data) ? data : null
}

export function lessonTitle(lesson) {
  return pickTranslation(lesson?.translations)?.title || ''
}

export function lessonContent(lesson) {
  return pickTranslation(lesson?.translations)?.content || ''
}
