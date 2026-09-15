import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '../services/authService'
import { ACCESS_TOKEN_KEY, USER_KEY } from '../services/api'

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
    if (callApi) { try { await authService.logout() } catch { /* la sesión puede haber expirado */ } }
    clearSession()
    initialized.value = true
  }

  return { token, user, loading, initialized, isAuthenticated, login, initialize, logout }
})
