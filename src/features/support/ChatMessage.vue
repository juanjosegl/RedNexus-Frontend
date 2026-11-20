<script setup lang="ts">
import type { ChatRole } from './types'

// El autor va como texto y no solo por color, para que lo lean los lectores de pantalla
defineProps<{
  /** Quien escribe el mensaje */
  role: ChatRole
  /** Texto del mensaje */
  content: string
  /** Archivos usados para responder (solo en el asistente) */
  sources?: string[]
}>()
</script>

<template>
  <article class="bubble" :data-role="role">
    <p class="bubble-author">{{ role === 'user' ? 'Tú' : 'Asistente' }}</p>
    <p class="bubble-text">{{ content }}</p>
    <p v-if="sources?.length" class="meta">Fuentes: {{ sources.join(', ') }}</p>
  </article>
</template>

<style scoped>
.bubble {
  max-width: 85%;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  background: var(--surface-top);
  border: 1px solid var(--line);
}

.bubble[data-role='user'] {
  justify-self: end;
  background: var(--violet-tint);
  border-color: var(--violet);
}

.bubble-author {
  margin: 0 0 0.25rem;
  font-weight: 600;
}

.bubble-text {
  margin: 0;
  white-space: pre-wrap;
}
</style>
