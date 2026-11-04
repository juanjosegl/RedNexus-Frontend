<script setup lang="ts">
defineProps<{
  /** Mensaje de error que se muestra al usuario */
  message: string
}>()
</script>

<template>
  <!-- role="alert" hace que los lectores de pantalla anuncien el error al aparecer -->
  <p role="alert" class="rounded-md border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
    {{ message }}
  </p>
</template>
