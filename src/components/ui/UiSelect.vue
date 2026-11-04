<script setup lang="ts">
import { fieldClass } from './fieldClass'
import type { SelectFieldProps } from './types'

const props = defineProps<SelectFieldProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const errorId = `${props.id}-error`
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm" :for="id">{{ label }}</label>
    <select
      :id="id"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? errorId : undefined"
      :class="fieldClass(Boolean(error))"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" :id="errorId" class="text-sm">{{ error }}</p>
  </div>
</template>
