<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { useSessionStore } from '@/stores/session'
import AuthShell from './AuthShell.vue'

const router = useRouter()
const session = useSessionStore()

const name = ref('')
const email = ref('')
const password = ref('')
const acceptsDataPolicy = ref(false)
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  if (!acceptsDataPolicy.value) {
    error.value = 'Debes autorizar el tratamiento de tus datos personales para registrarte.'
    return
  }
  loading.value = true

  try {
    await session.register({
      name: name.value,
      email: email.value,
      password: password.value,
      acceptsDataPolicy: acceptsDataPolicy.value,
    })

    await router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No fue posible crear la cuenta'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell title="Crear cuenta" subtitle="Únete a la comunidad académica de RedNexus.">
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

      <details class="policy">
        <summary><AppIcon name="shield" />Cómo usamos tus datos</summary>
        <p>
          RedNexus guarda tu nombre, tu correo, lo que escribes en tu perfil y tus solicitudes solo
          para recomendarte compañeros que te ayuden y ponerlos en contacto. Tu correo solo lo ve la
          otra persona cuando un ayudante acepta. Las notas de voz se transcriben y no se guardan.
          La IA corre en nuestra propia infraestructura: tus datos no se envían a servicios
          externos.
        </p>
        <p>
          Puedes descargar todos tus datos o eliminar tu cuenta cuando quieras desde tu perfil (Ley
          1581 de 2012).
        </p>
      </details>

      <label class="consent">
        <input id="register-consent" v-model="acceptsDataPolicy" type="checkbox" required />
        <span>Autorizo el tratamiento de mis datos personales según lo descrito arriba.</span>
      </label>

      <p v-if="error" class="alert" role="alert">{{ error }}</p>

      <button type="submit" class="btn" data-variant="primary" :disabled="loading">
        {{ loading ? 'Creando cuenta...' : 'Registrarme' }}
      </button>
    </form>

    <p class="meta auth-switch">
      ¿Ya tienes cuenta?
      <RouterLink to="/login">Inicia sesión</RouterLink>
    </p>
  </AuthShell>
</template>

<style scoped>
.policy {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface-2);
  font-size: 0.9rem;
  color: var(--ink-soft);
}

.policy summary {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--ink);
  font-weight: 600;
  cursor: pointer;
}

.policy summary::after {
  margin-left: auto;
}

.policy summary svg {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--brand-text);
}

.policy p {
  margin: var(--space-3) 0 0;
}

.consent {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  font-size: 0.925rem;
  color: var(--ink-soft);
  cursor: pointer;
}

.consent input {
  margin-top: 0.2rem;
  flex: none;
}

.auth-switch {
  text-align: center;
}

.auth-switch a {
  font-weight: 600;
}
</style>
