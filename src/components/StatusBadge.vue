<script setup lang="ts">
const labels = {
  pending: 'Pendiente',
  matched: 'Con candidatos',
  accepted: 'Aceptada',
  closed: 'Cerrada',
} as const

defineProps<{
  status: keyof typeof labels
}>()
</script>

<template>
  <span class="badge" :data-status="status">{{ labels[status] }}</span>
</template>
