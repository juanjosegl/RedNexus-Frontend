<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Deshabilita el boton mientras se espera respuesta evitando envios dobles */
    loading?: boolean
    /** Tipo nativo del boton. Dentro de un formulario, "submit" lo envia */
    type?: 'button' | 'submit'
  }>(),
  { loading: false, type: 'submit' },
)
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    class="min-h-11 w-full rounded-md px-4 py-2 font-medium focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot />
  </button>
</template>
