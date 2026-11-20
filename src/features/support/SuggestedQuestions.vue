<script setup lang="ts">
import { suggestedQuestions } from './suggestions'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  select: [question: string]
}>()
</script>

<template>
  <div class="chips" aria-label="Preguntas sugeridas">
    <button
      v-for="question in suggestedQuestions"
      :key="question"
      type="button"
      class="chip"
      :disabled="disabled"
      @click="emit('select', question)"
    >
      {{ question }}
    </button>
  </div>
</template>
