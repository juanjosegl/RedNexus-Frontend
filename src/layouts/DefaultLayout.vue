<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import logoFull from '@/assets/logo/logo-rednexus.svg'
import logoMark from '@/assets/logo/logo-mark.svg'
import { useSessionStore } from '@/stores/session'

const session = useSessionStore()
const router = useRouter()

function handleLogout() {
  session.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <header class="app-header">
      <nav aria-label="Principal" class="container">
        <RouterLink class="brand" to="/">
          <img class="brand-full" :src="logoFull" alt="RedNexus" />
          <img class="brand-mark" :src="logoMark" alt="RedNexus" />
        </RouterLink>

        <div class="nav-links">
          <template v-if="!session.isLoggedIn">
            <RouterLink to="/login" class="nav-link" active-class="is-active">
              Iniciar sesión
            </RouterLink>
            <RouterLink to="/register" class="nav-link" active-class="is-active">
              Registrarse
            </RouterLink>
          </template>

          <template v-else>
            <RouterLink to="/help-requests" class="nav-link" active-class="is-active">
              Solicitudes
            </RouterLink>
            <RouterLink to="/perfil" class="nav-link" active-class="is-active">
              {{ session.user?.name ?? 'Perfil' }}
            </RouterLink>
            <button type="button" class="nav-link nav-button" @click="handleLogout">
              Cerrar sesión
            </button>
          </template>
        </div>
      </nav>
    </header>

    <main class="page container">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.nav-button {
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
}
</style>
