<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
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
  <article class="message reveal" :data-role="role">
    <span class="message-avatar" aria-hidden="true">
      <AppIcon :name="role === 'user' ? 'user' : 'sparkles'" />
    </span>
    <div class="bubble">
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
      <p v-if="sources?.length" class="sources">Fuentes: {{ sources.join(', ') }}</p>
    </div>
  </article>
</template>

<style scoped>
.message {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
  max-width: 88%;
}

.message[data-role='user'] {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.message-avatar {
  display: grid;
  place-items: center;
  flex: none;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, var(--brand), var(--violet));
  color: var(--on-brand);
}

.message[data-role='user'] .message-avatar {
  background: var(--surface);
  border: 1px solid var(--line-strong);
  color: var(--ink-soft);
}

.message-avatar svg {
  width: 1rem;
  height: 1rem;
}

.bubble {
  min-width: 0;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
  font-size: 0.95rem;
}

.message[data-role='user'] .bubble {
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg);
  background: var(--brand);
  border-color: var(--brand);
  color: var(--on-brand);
}

.bubble-author {
  margin: 0 0 0.2rem;
  color: var(--ink-faint);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.message[data-role='user'] .bubble-author {
  color: color-mix(in srgb, var(--on-brand) 75%, transparent);
}

.bubble-text {
  margin: 0;
  white-space: pre-wrap;
}

.bubble-md p {
  margin: 0 0 0.5rem;
}

.bubble-md > :last-child {
  margin-bottom: 0;
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

.bubble-md li::marker {
  color: var(--brand-text);
  font-weight: 600;
}

.sources {
  margin: var(--space-3) 0 0;
  padding-top: var(--space-2);
  border-top: 1px solid var(--line);
  color: var(--ink-faint);
  font-size: 0.8rem;
}
</style>
