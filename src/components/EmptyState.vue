<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="empty">
    <slot name="icon" />
    <p>{{ message }}</p>
    <div class="actions">
      <slot />
    </div>
  </div>
</template>
