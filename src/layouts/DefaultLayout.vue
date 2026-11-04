<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'

const session = useSessionStore()
const router = useRouter()

function handleLogout() {
  session.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <nav
        aria-label="Principal"
        class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3"
      >
        <RouterLink to="/" class="text-lg font-semibold">
          RedNexus
        </RouterLink>

        <div class="flex items-center gap-4">
          <template v-if="!session.isLoggedIn">
            <RouterLink
              to="/login"
              class="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              Iniciar sesión
            </RouterLink>

            <RouterLink
              to="/register"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Registrarse
            </RouterLink>
          </template>

          <template v-else>
            <span class="text-sm text-slate-600">
              Hola, {{ session.user?.name ?? 'Estudiante' }}
            </span>

            <button
              type="button"
              class="min-h-11 rounded-md px-3 text-sm font-medium text-red-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              @click="handleLogout"
            >
              Cerrar sesión
            </button>
          </template>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
