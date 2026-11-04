<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Etiqueta HTML del contenedor: "section", "article", "div" etc. */
    as?: string
  }>(),
  { as: 'div' },
)
</script>

<template>
  <component :is="as" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
    <slot />
  </component>
</template>
