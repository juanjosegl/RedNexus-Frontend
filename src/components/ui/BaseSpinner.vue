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
      class="spinner"
      aria-hidden="true"
    />
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
