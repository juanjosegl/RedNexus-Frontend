<script setup lang="ts">
import { RouterLink } from 'vue-router'
import logoFull from '@/assets/logo/logo-rednexus.svg'
import logoMark from '@/assets/logo/logo-mark.svg'
</script>

<template>
  <div>
    <header class="app-header">
      <div class="container">
        <RouterLink class="brand" to="/help-requests">
          <img class="brand-full" :src="logoFull" alt="RedNexus" />
          <img class="brand-mark" :src="logoMark" alt="RedNexus" />
        </RouterLink>
        <RouterLink :to="{ name: 'help-requests' }" class="nav-link" active-class="is-active">
          Solicitudes
        </RouterLink>
      </div>
    </header>
    <main class="page container">
      <slot />
    </main>
  </div>
</template>
