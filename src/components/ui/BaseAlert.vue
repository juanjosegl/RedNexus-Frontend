<script setup lang="ts">
// role="alert" hace que los lectores de pantalla anuncien el error al aparecer
defineProps<{
  /** Mensaje de error que se muestra al usuario */
  message: string
}>()
</script>

<template>
  <p role="alert" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
    {{ message }}
  </p>
</template>
