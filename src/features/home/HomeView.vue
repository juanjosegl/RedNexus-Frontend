<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { http } from '@/services/http'

const apiStatus = ref('comprobando...')

onMounted(async () => {
  try {
    const res = await http<{ status: string }>('/health')
    apiStatus.value = res.status
  } catch {
    apiStatus.value = 'sin conexion'
  }
})
</script>

<template>
  <section>
    <div class="page-head">
      <div>
        <h1>RedNexus</h1>
        <p>Publica tu duda y te conectamos con los compañeros que más saben del tema.</p>
        <p>
          Escribes o grabas la duda. Te proponemos compañeros. Abres la solicitud y ves la
          explicación.
        </p>
      </div>
    </div>
    <div class="actions">
      <BaseButton :to="{ name: 'help-request-new' }">Nueva solicitud</BaseButton>
      <BaseButton variant="secondary" :to="{ name: 'help-requests' }">Mis solicitudes</BaseButton>
    </div>
    <p class="meta">
      API: <span data-testid="api-status">{{ apiStatus }}</span>
    </p>
  </section>
</template>
