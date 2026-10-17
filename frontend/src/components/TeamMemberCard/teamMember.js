import i18n from '../../i18n'

export function getTeamTranslation(translations) {
  if (!Array.isArray(translations) || translations.length === 0) return null
  const language = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]
  return translations.find((translation) => translation.language === language) || translations[0]
}

export function getTeamImage(member) {
  const image = member?.local_image || member?.image_url
  if (!image) return ''
  if (/^https?:\/\//i.test(image)) return image
  const baseUrl = (import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  return `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`
}
