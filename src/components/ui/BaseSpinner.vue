<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Descripcion oculta que anuncian las tecnologias de apoyo */
    label?: string
  }>(),
  { label: 'Cargando' },
)
</script>

<template>
  <span role="status" class="inline-flex items-center">
    <span
      class="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700"
      aria-hidden="true"
    />
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
