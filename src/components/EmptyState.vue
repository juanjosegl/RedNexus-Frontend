<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="empty reveal">
    <slot name="icon" />
    <p>{{ message }}</p>
    <div v-if="$slots.default" class="actions">
      <slot />
    </div>
  </div>
</template>
