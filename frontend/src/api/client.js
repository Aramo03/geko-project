import axios from 'axios'

// TODO: interceptors, language query, JWT for admin reply
export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000',
})
