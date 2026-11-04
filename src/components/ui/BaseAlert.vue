<script setup lang="ts">
// role="alert" hace que los lectores de pantalla anuncien el error al aparecer
defineProps<{
  /** Mensaje de error que se muestra al usuario */
  message: string
}>()
</script>

<template>
  <p role="alert" class="alert">
    {{ message }}
  </p>
</template>
