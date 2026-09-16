import axios from 'axios'

export const ACCESS_TOKEN_KEY = 'lne_access_token'
export const USER_KEY = 'lne_user'

const configuredApiUrl = (import.meta.env.VITE_API_URL || 'https://backendlnestock-production.up.railway.app/api').trim().replace(/\/+$/, '')
const apiBaseUrl = configuredApiUrl.endsWith('/api') ? configuredApiUrl : `${configuredApiUrl}/api`

export const responsePayload = (data) => (
  data && typeof data === 'object' && !Array.isArray(data) && data.data !== undefined
    ? data.data
    : data
)

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use((response) => {
  response.data = responsePayload(response.data)
  return response
}, (error) => {
  if (error.response?.status === 401) {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    window.dispatchEvent(new CustomEvent('lne:unauthorized'))
  }
  return Promise.reject(error)
})

export default api
