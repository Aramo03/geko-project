import { pickTranslation } from '../../api/client.js'

export function asList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return null
}

export function categoryTitle(category) {
  return pickTranslation(category?.translations)?.text || ''
}
