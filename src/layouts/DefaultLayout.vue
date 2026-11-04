<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useSessionStore } from '@/stores/session'

// El store como unica fuente de verdad de la sesion: la barra solo la lee
const session = useSessionStore()
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <!-- aria-label va distinguir esta navegacion de otras que se agreguen despues -->
      <nav
        aria-label="Principal"
        class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3"
      >
        <RouterLink to="/" class="text-lg font-semibold">RedNexus</RouterLink>

        <!-- Accion sobre la sesion: se usa <button>, no <a>, por semantica y accesibilidad -->
        <button
          v-if="session.isLoggedIn"
          type="button"
          class="min-h-11 rounded-md px-3 text-sm font-medium hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          @click="session.logout()"
        >
          Cerrar sesión
        </button>
        <!-- Iniciar sesion si es una navegacion a otra pagina: por eso es enlace -->
        <RouterLink
          v-else
          to="/login"
          class="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          Iniciar sesión
        </RouterLink>
      </nav>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
