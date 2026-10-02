import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Sesion del usuario. El modulo auth la llenara al hacer login.
export const useSessionStore = defineStore('session', () => {
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => token.value !== null)

  function logout() {
    token.value = null
  }

  return { token, isLoggedIn, logout }
})
