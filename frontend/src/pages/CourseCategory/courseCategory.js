import { pickTranslation } from '../../api/client.js'

export function asList(data) {
  return Array.isArray(data) ? data : null
}

export function categoryTitle(category) {
  return pickTranslation(category?.translations)?.text || ''
}
