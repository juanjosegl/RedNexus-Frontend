<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const session = useSessionStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await session.login({
      email: email.value,
      password: password.value,
    })

    await router.push('/')
  } catch (err) {
    error.value = err instanceof Error
      ? err.message
      : 'No fue posible iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="panel">
    <div class="page-head">
      <div>
        <h1>Iniciar sesión</h1>
        <p class="meta">Bienvenido de nuevo a RedNexus.</p>
      </div>
    </div>

    <form class="form" @submit.prevent="handleLogin">
      <div class="field">
        <label for="login-email">Correo electrónico</label>
        <input
          id="login-email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          class="input"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div class="field">
        <label for="login-password">Contraseña</label>
        <input
          id="login-password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="input"
          placeholder="Tu contraseña"
        />
      </div>

      <p v-if="error" class="alert">{{ error }}</p>

      <button type="submit" class="btn" data-variant="primary" :disabled="loading">
        {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
      </button>
    </form>

    <p class="meta">
      ¿No tienes cuenta?
      <RouterLink to="/register">Regístrate</RouterLink>
    </p>
  </section>
</template>
