<script setup lang="ts">
import { fieldClass } from './fieldClass'
import type { TextFieldProps } from './types'

const props = defineProps<TextFieldProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const errorId = `${props.id}-error`
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm" :for="id">{{ label }}</label>
    <input
      :id="id"
      :name="name"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? errorId : undefined"
      :class="fieldClass(Boolean(error))"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" :id="errorId" class="text-sm">{{ error }}</p>
  </div>
</template>
