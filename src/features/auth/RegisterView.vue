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
  <section class="panel">
    <div class="page-head">
      <div>
        <h1>Crear cuenta</h1>
        <p class="meta">Únete a la comunidad académica de RedNexus.</p>
      </div>
    </div>

    <form class="form" @submit.prevent="handleRegister">
      <div class="field">
        <label for="register-name">Nombre completo</label>
        <input
          id="register-name"
          v-model="name"
          type="text"
          required
          minlength="2"
          maxlength="80"
          autocomplete="name"
          class="input"
          placeholder="Tu nombre"
        />
      </div>

      <div class="field">
        <label for="register-email">Correo electrónico</label>
        <input
          id="register-email"
          v-model="email"
          type="email"
          required
          maxlength="120"
          autocomplete="email"
          class="input"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div class="field">
        <label for="register-password">Contraseña</label>
        <input
          id="register-password"
          v-model="password"
          type="password"
          required
          minlength="8"
          maxlength="72"
          autocomplete="new-password"
          class="input"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <p v-if="error" class="alert">{{ error }}</p>

      <button type="submit" class="btn" data-variant="primary" :disabled="loading">
        {{ loading ? 'Creando cuenta...' : 'Registrarme' }}
      </button>
    </form>

    <p class="meta">
      ¿Ya tienes cuenta?
      <RouterLink to="/login">Inicia sesión</RouterLink>
    </p>
  </section>
</template>
