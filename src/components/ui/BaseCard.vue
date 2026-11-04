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
  <component :is="as" class="panel">
    <slot />
  </component>
</template>
