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
  <section class="mx-auto max-w-md rounded-xl bg-white p-8 shadow-sm">
    <h1 class="mb-2 text-2xl font-bold">Iniciar sesión</h1>

    <p class="mb-6 text-sm text-slate-500">
      Bienvenido de nuevo a RedNexus.
    </p>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <div>
        <label class="mb-1 block text-sm font-medium">Correo electrónico</label>
        <input
          v-model="email"
          type="email"
          required
          autocomplete="email"
          class="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Contraseña</label>
        <input
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Tu contraseña"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">
        {{ error }}
      </p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      ¿No tienes cuenta?
      <RouterLink to="/register" class="font-medium text-blue-600">
        Regístrate
      </RouterLink>
    </p>
  </section>
</template>
