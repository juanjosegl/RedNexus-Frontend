import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const tokenKey = 'rednexus.token'

function readToken(): string | null {
  return localStorage.getItem(tokenKey)
}

// The auth feature fills this store on login. The key stays stable so both sides connect.
export const useSessionStore = defineStore('session', () => {
  const token = ref<string | null>(readToken())
  const isLoggedIn = computed(() => token.value !== null)

  function setToken(value: string | null) {
    token.value = value
    if (value) localStorage.setItem(tokenKey, value)
    else localStorage.removeItem(tokenKey)
  }

  function logout() {
    setToken(null)
  }

  return { token, isLoggedIn, setToken, logout }
})
