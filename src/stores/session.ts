import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  login as loginRequest,
  register as registerRequest,
  getMe,
  type LoginData,
  type RegisterData,
  type User,
} from '@/features/auth/auth'

export const useSessionStore = defineStore('session', () => {
  const token = ref<string | null>(localStorage.getItem('rednexus_token'))
  const user = ref<User | null>(null)

  const isLoggedIn = computed(() => token.value !== null)

  async function login(data: LoginData) {
    const response = await loginRequest(data)
    token.value = response.accessToken
    user.value = response.user
    localStorage.setItem('rednexus_token', response.accessToken)
  }

  async function register(data: RegisterData) {
    const response = await registerRequest(data)
    token.value = response.accessToken
    user.value = response.user
    localStorage.setItem('rednexus_token', response.accessToken)
  }

  async function loadUser() {
    if (!token.value) return

    try {
      user.value = await getMe(token.value)
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('rednexus_token')
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    register,
    loadUser,
    logout,
  }
})
