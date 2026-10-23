import axios from 'axios'
import i18n from '../i18n'

const TOKEN_KEY = 'geko_access_token'

// Empty or missing VITE_BASE_URL means the API is on the same origin
// (`/api` via the Vite proxy or the production nginx). An absolute URL
// is used only when it is set on purpose.
const configuredBase = import.meta.env.VITE_BASE_URL
const baseURL =
  configuredBase == null || configuredBase === '' ? '' : configuredBase

export const api = axios.create({
  baseURL,
})

export function mediaUrl(path) {
  if (typeof path !== 'string') return ''
  const raw = path.trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  const suffix = raw.startsWith('/') ? raw : `/${raw}`
  return `${baseURL.replace(/\/$/, '')}${suffix}`
}

function currentLanguage() {
  const code = i18n.language || 'en'
  return code.split('-')[0]
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const method = (config.method || 'get').toLowerCase()
  if (method === 'get') {
    config.params = {
      ...config.params,
      language: config.params?.language ?? currentLanguage(),
    }
  }
  return config
})

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function pickTranslation(translations) {
  if (!translations?.length) return null
  return translations[0]
}
