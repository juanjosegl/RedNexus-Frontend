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
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-sm font-medium">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type ?? 'text'"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      v-bind="$attrs"
      :class="
        error
          ? 'border-red-500 focus-visible:ring-red-500'
          : 'border-gray-300 focus-visible:ring-gray-900'
      "
      class="min-h-11 rounded-md border px-3 py-2 focus-visible:outline-none"
    />
    <p v-if="error" :id="`${id}-error`" role="alert" class="text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
