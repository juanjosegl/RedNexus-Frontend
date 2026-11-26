<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import { useTheme } from '@/composables/useTheme'
import { useSessionStore } from '@/stores/session'

const session = useSessionStore()
const router = useRouter()
const { theme, toggle } = useTheme()

const initial = computed(() => session.user?.name?.trim().charAt(0).toUpperCase() || '·')

function handleLogout() {
  session.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <nav aria-label="Principal" class="frame" :class="{ 'has-session': session.isLoggedIn }">
        <RouterLink class="brand" to="/" aria-label="RedNexus, inicio">
          <BrandLogo />
          <span class="brand-name" aria-hidden="true">Red<span>Nexus</span></span>
        </RouterLink>

        <div v-if="!session.isLoggedIn" class="nav-guest">
          <RouterLink to="/login" class="nav-link" active-class="is-active">
            Iniciar sesión
          </RouterLink>
          <RouterLink to="/register" class="btn is-sm" data-variant="primary">
            Registrarse
          </RouterLink>
        </div>

        <template v-else>
          <div class="nav-links">
            <RouterLink to="/" class="nav-link" exact-active-class="is-active">
              <AppIcon name="home" />Inicio
            </RouterLink>
            <RouterLink to="/help-requests" class="nav-link" active-class="is-active">
              <AppIcon name="requests" />Solicitudes
            </RouterLink>
            <RouterLink to="/ayudar" class="nav-link" active-class="is-active">
              <AppIcon name="heart" />Ayudar
            </RouterLink>
            <RouterLink to="/ayuda" class="nav-link" active-class="is-active">
              <AppIcon name="chat" />Ayuda
            </RouterLink>
          </div>

          <div class="nav-account">
            <RouterLink
              to="/perfil"
              class="nav-link nav-user"
              active-class="is-active"
              :title="session.user?.name"
            >
              <span class="avatar is-sm" aria-hidden="true">{{ initial }}</span>
              <span class="nav-user-name">{{ session.user?.name ?? 'Perfil' }}</span>
            </RouterLink>
            <button type="button" class="nav-link nav-button" @click="handleLogout">
              <AppIcon name="logout" /><span class="nav-button-text">Cerrar sesión</span>
            </button>
          </div>
        </template>
      </nav>
    </header>

    <main class="page frame">
      <slot />
    </main>

    <footer class="app-footer">
      <div class="frame">
        <p>
          © 2026 <strong>RedNexus</strong> · Red de apoyo académico con IA local · Diplomado
          CloudForge AI 5.0, Unicomfacauca
        </p>
        <button
          type="button"
          class="btn is-sm theme-toggle"
          data-variant="secondary"
          :aria-label="theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
          @click="toggle"
        >
          <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" />
          {{ theme === 'dark' ? 'Tema claro' : 'Tema oscuro' }}
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.nav-guest {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: auto;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-left: var(--space-4);
}

.nav-account {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-left: auto;
  min-width: 0;
}

.nav-user {
  min-width: 0;
  padding-left: 0.35rem;
}

.nav-user .avatar {
  font-size: 0.8rem;
}

.nav-user-name {
  max-width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-button {
  border: 0;
  background: none;
  font: inherit;
  font-size: 0.95rem;
  cursor: pointer;
}

.nav-button:hover {
  color: var(--danger);
  background: var(--danger-bg);
}

.theme-toggle {
  font-weight: 550;
}

/* En pantallas medianas "Cerrar sesión" queda solo con el ícono (el texto sigue para lectores) */
@media (max-width: 1023px) {
  .nav-button-text {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}

/* FE-16: en celular el menú con sesión no cabe en una fila. Arriba quedan el logo, el
   perfil y "Cerrar sesión"; los enlaces pasan a una segunda fila en cuatro columnas
   (ícono arriba, texto abajo) y el nombre largo se recorta con puntos suspensivos. */
@media (max-width: 767px) {
  .frame.has-session {
    flex-wrap: wrap;
    row-gap: 0;
    padding-bottom: var(--space-2);
  }

  .has-session .nav-links {
    order: 3;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    flex-basis: 100%;
    margin: 0;
    gap: var(--space-1);
  }

  .has-session .nav-links .nav-link {
    flex-direction: column;
    justify-content: center;
    gap: 0.15rem;
    min-height: 3.1rem;
    padding: 0.3rem 0.2rem;
    font-size: 0.75rem;
  }

  .has-session .nav-links .nav-link svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .brand,
  .nav-link {
    flex-shrink: 0;
  }

  .nav-user-name {
    max-width: 7rem;
  }
}

@media (max-width: 379px) {
  .brand-name {
    display: none;
  }
}
</style>
