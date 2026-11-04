<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const session = useSessionStore()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true

  try {
    await session.register({
      name: name.value,
      email: email.value,
      password: password.value,
    })

    await router.push('/')
  } catch (err) {
    error.value = err instanceof Error
      ? err.message
      : 'No fue posible crear la cuenta'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-md rounded-xl bg-white p-8 text-slate-900 shadow-sm">
    <h1 class="mb-2 text-2xl font-bold">Crear cuenta</h1>

    <p class="mb-6 text-sm text-slate-500">
      Únete a la comunidad académica de RedNexus.
    </p>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <div>
        <label class="mb-1 block text-sm font-medium">Nombre completo</label>
        <input
          v-model="name"
          type="text"
          required
          minlength="2"
          maxlength="80"
          autocomplete="name"
          class="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Correo electrónico</label>
        <input
          v-model="email"
          type="email"
          required
          maxlength="120"
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
          minlength="8"
          maxlength="72"
          autocomplete="new-password"
          class="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Mínimo 8 caracteres"
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
        {{ loading ? 'Creando cuenta...' : 'Registrarme' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      ¿Ya tienes cuenta?
      <RouterLink to="/login" class="font-medium text-blue-600">
        Inicia sesión
      </RouterLink>
    </p>
  </section>
</template>
