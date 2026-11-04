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
  <section class="page-head">
    <div>
      <h1>RedNexus</h1>
      <p>Publica tu duda y te conectamos con los compañeros que más saben del tema.</p>
      <p class="meta">
        API: <span data-testid="api-status">{{ apiStatus }}</span>
      </p>
    </div>
  </section>
</template>
