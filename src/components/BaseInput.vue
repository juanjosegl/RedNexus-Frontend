<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  label: string
  modelValue: string
  error?: string
  hint?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
</script>

<template>
  <div class="field">
    <label :for="typeof attrs.id === 'string' ? attrs.id : undefined">{{ label }}</label>
    <input
      v-bind="attrs"
      class="input"
      :class="{ 'is-invalid': Boolean(error) }"
      :value="modelValue"
      :aria-invalid="Boolean(error)"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="hint" class="hint">{{ hint }}</p>
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>
