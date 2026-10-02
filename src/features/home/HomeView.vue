<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
  <section class="space-y-4">
    <h1 class="text-3xl font-bold">RedNexus</h1>
    <p class="text-slate-600">
      Publica tu duda y te conectamos con los compañeros que más saben del tema.
    </p>
    <p class="text-sm">
      API: <span data-testid="api-status">{{ apiStatus }}</span>
    </p>
  </section>
</template>
