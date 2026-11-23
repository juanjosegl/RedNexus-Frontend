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
      <nav aria-label="Principal" class="frame" :class="{ 'has-session': session.isLoggedIn }">
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
            <RouterLink to="/ayudar" class="nav-link" active-class="is-active"> Ayudar </RouterLink>
            <RouterLink to="/ayuda" class="nav-link" active-class="is-active"> Ayuda </RouterLink>
            <RouterLink
              to="/perfil"
              class="nav-link nav-user"
              active-class="is-active"
              :title="session.user?.name"
            >
              {{ session.user?.name ?? 'Perfil' }}
            </RouterLink>
            <button type="button" class="nav-link nav-button" @click="handleLogout">
              Cerrar sesión
            </button>
          </template>
        </div>
      </nav>
    </header>

    <main class="page frame">
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

/* FE-16: en celular el menú con sesión no cabe en una fila. Arriba quedan el
   logo y "Cerrar sesión"; los enlaces pasan a una segunda fila y el nombre
   largo se recorta con puntos suspensivos. */
@media (max-width: 639px) {
  .frame {
    flex-wrap: wrap;
    column-gap: var(--space-4);
    row-gap: 0;
  }

  .has-session {
    justify-content: flex-start;
  }

  .has-session .nav-links {
    display: contents;
  }

  .has-session .nav-button {
    order: 1;
    margin-left: auto;
  }

  .has-session::after {
    content: '';
    order: 2;
    flex-basis: 100%;
  }

  .has-session .nav-link:not(.nav-button) {
    order: 3;
  }

  .brand,
  .nav-link {
    flex-shrink: 0;
    white-space: nowrap;
  }

  .nav-user {
    display: inline-block;
    max-width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: var(--control);
  }
}
</style>
