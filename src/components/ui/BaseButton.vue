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
    class="btn"
    data-variant="primary"
  >
    <slot />
  </button>
</template>
