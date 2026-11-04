<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'quiet'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    to?: RouteLocationRaw
  }>(),
  {
    variant: 'primary',
    type: 'button',
  },
)
</script>

<template>
  <RouterLink v-if="to && !disabled" :to="to" class="btn" :data-variant="variant">
    <slot />
  </RouterLink>
  <button v-else :type="type" class="btn" :data-variant="variant" :disabled="disabled">
    <slot />
  </button>
</template>
