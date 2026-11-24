<script setup lang="ts">
import { computed } from 'vue'
import { analizarMarkdown } from './markdown'
import type { ChatRole } from './types'

// El autor va como texto y no solo por color, para que lo lean los lectores de pantalla
const props = defineProps<{
  /** Quien escribe el mensaje */
  role: ChatRole
  /** Texto del mensaje */
  content: string
  /** Archivos usados para responder (solo en el asistente) */
  sources?: string[]
}>()

// FE-17: el asistente responde en Markdown (pasos numerados y **negrita**); el usuario, en texto plano
const bloques = computed(() => (props.role === 'assistant' ? analizarMarkdown(props.content) : []))
</script>

<template>
  <article class="bubble" :data-role="role">
    <p class="bubble-author">{{ role === 'user' ? 'Tú' : 'Asistente' }}</p>
    <p v-if="role === 'user'" class="bubble-text">{{ content }}</p>
    <div v-else class="bubble-md">
      <template v-for="(bloque, i) in bloques" :key="i">
        <p v-if="bloque.tipo === 'parrafo'">
          <template v-for="(f, j) in bloque.fragmentos" :key="j">
            <strong v-if="f.negrita">{{ f.texto }}</strong>
            <template v-else>{{ f.texto }}</template>
          </template>
        </p>
        <component :is="bloque.ordenada ? 'ol' : 'ul'" v-else>
          <li v-for="(item, k) in bloque.items" :key="k">
            <template v-for="(f, j) in item" :key="j">
              <strong v-if="f.negrita">{{ f.texto }}</strong>
              <template v-else>{{ f.texto }}</template>
            </template>
          </li>
        </component>
      </template>
    </div>
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

.bubble-md p {
  margin: 0 0 0.5rem;
}

.bubble-md ol,
.bubble-md ul {
  margin: 0 0 0.5rem;
  padding-left: 1.25rem;
}

.bubble-md ol {
  list-style: decimal;
}

.bubble-md ul {
  list-style: disc;
}

.bubble-md li {
  margin-bottom: 0.25rem;
}
</style>
