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
    <textarea
      v-bind="attrs"
      class="textarea"
      :class="{ 'is-invalid': Boolean(error) }"
      :value="modelValue"
      :aria-invalid="Boolean(error)"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p v-if="hint" class="hint">{{ hint }}</p>
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>
