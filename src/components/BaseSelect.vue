<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  label: string
  modelValue: string
  options: { value: string; label: string }[]
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
    <select
      v-bind="attrs"
      class="select"
      :class="{ 'is-invalid': Boolean(error) }"
      :value="modelValue"
      :aria-invalid="Boolean(error)"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="hint" class="hint">{{ hint }}</p>
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>
