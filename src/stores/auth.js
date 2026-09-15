import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '../services/authService'
import { ACCESS_TOKEN_KEY, USER_KEY } from '../services/api'

// Acceso local temporal para revisar el panel sin depender del backend.
const DEMO_MODE = true
const DEMO_USER = {
  id: 'demo-admin',
  fullName: 'Administrador Demo',
  email: 'admin@lnestock.hn',
  role: 'admin',
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(sessionStorage.getItem(ACCESS_TOKEN_KEY))
  const user = ref(readStoredUser())
  const loading = ref(false)
  const initialized = ref(false)
  const isAuthenticated = computed(() => Boolean(token.value))

  function readStoredUser() {
    try { return JSON.parse(sessionStorage.getItem(USER_KEY) || 'null') } catch { return null }
  }

  function persist(accessToken, currentUser) {
    token.value = accessToken
    user.value = currentUser
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    sessionStorage.setItem(USER_KEY, JSON.stringify(currentUser))
  }

  async function login(credentials) {
    loading.value = true
    try {
      if (DEMO_MODE) {
        persist('demo-access-token', {
          ...DEMO_USER,
          email: credentials.email || DEMO_USER.email,
        })
        return user.value
      }

      const { data } = await authService.login(credentials)
      persist(data.accessToken, data.user)
      return data.user
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function initialize() {
    if (initialized.value) return user.value
    loading.value = true
    try {
      if (DEMO_MODE) {
        if (!token.value) return null
        return user.value
      }

      if (token.value) {
        try {
          const { data } = await authService.me()
          persist(token.value, data)
          return data
        } catch (error) {
          if (error.response?.status !== 401) throw error
        }
      }

      {
        const { data } = await authService.refresh()
        persist(data.accessToken, data.user)
      }
      const { data } = await authService.me()
      persist(token.value, data)
      return data
    } catch {
      clearSession()
      return null
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  function clearSession() {
    token.value = null
    user.value = null
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
  }

  async function logout(callApi = true) {
    if (callApi && !DEMO_MODE) { try { await authService.logout() } catch { /* la sesión puede haber expirado */ } }
    clearSession()
    initialized.value = true
  }

  return { token, user, loading, initialized, isAuthenticated, login, initialize, logout }
})
