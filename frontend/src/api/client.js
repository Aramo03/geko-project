import axios from 'axios'
import i18n from '../i18n'

const TOKEN_KEY = 'geko_access_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000',
})

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
