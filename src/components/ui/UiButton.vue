<script setup lang="ts">
import type { ButtonProps } from './types'

withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="rounded border border-neutral-900 bg-white px-3 py-2 text-neutral-900 disabled:opacity-50"
  >
    <slot />
  </button>
</template>
