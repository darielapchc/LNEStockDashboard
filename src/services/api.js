import axios from 'axios'

export const ACCESS_TOKEN_KEY = 'lne_access_token'
export const USER_KEY = 'lne_user'

const configuredApiUrl = (import.meta.env.VITE_API_URL || 'https://backendlnestock-production.up.railway.app/api').replace(/\/$/, '')
const apiBaseUrl = configuredApiUrl.endsWith('/api') ? configuredApiUrl : `${configuredApiUrl}/api`

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshRequest

api.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config
  const isAuthRequest = originalRequest?.url?.includes('/auth/')

  if (error.response?.status === 401 && !isAuthRequest && !originalRequest?._retry) {
    originalRequest._retry = true
    try {
      refreshRequest ||= api.post('/auth/refresh')
      const { data } = await refreshRequest
      refreshRequest = null
      sessionStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user))
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      refreshRequest = null
      sessionStorage.removeItem(ACCESS_TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
      window.dispatchEvent(new CustomEvent('lne:unauthorized'))
      return Promise.reject(refreshError)
    }
  }

  return Promise.reject(error)
})

export default api
