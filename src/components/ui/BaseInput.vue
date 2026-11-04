<script setup lang="ts">
// Los atributos nativos (autocomplete, required y demas) deberan ir al <input>, no en <div>
defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ required: true })

defineProps<{
  /** Texto de la etiqueta visible */
  label: string
  /** Enlaza la etiqueta con el campo */
  id: string
  /** Tipo de input: text, email, password...*/
  type?: string
  /** Si existe, el campo se marca como invalido y se muestra el mensaje */
  error?: string
}>()
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type ?? 'text'"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      v-bind="$attrs"
      class="input"
      :class="{ 'is-invalid': Boolean(error) }"
    />
    <p v-if="error" :id="`${id}-error`" role="alert" class="field-error">
      {{ error }}
    </p>
  </div>
</template>
