<script setup lang="ts">
import { nextTick, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import SuggestedQuestions from './SuggestedQuestions.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import { askSupport, supportErrorMessage } from './api'
import type { ChatEntry } from './types'

const messages = ref<ChatEntry[]>([])
const text = ref('')
const sending = ref(false)
const alertMessage = ref('')
const listEl = ref<HTMLElement | null>(null)

async function scrollToEnd() {
  await nextTick()
  listEl.value?.scrollTo?.({ top: listEl.value.scrollHeight, behavior: 'smooth' })
}

// Se exporta para que las preguntas sugeridas (FE-10) puedan enviar su texto
async function send(question = text.value) {
  const value = question.trim()
  alertMessage.value = ''
  if (value.length < 2 || value.length > 1000 || sending.value) return

  const history = messages.value.map(({ role, content }) => ({ role, content }))
  messages.value.push({ role: 'user', content: value })
  text.value = ''
  sending.value = true
  await scrollToEnd()

  try {
    const reply = await askSupport(value, history)
    messages.value.push({ role: 'assistant', content: reply.answer, sources: reply.sources })
  } catch (caught) {
    alertMessage.value = supportErrorMessage(caught)
  } finally {
    sending.value = false
    await scrollToEnd()
  }
}

defineExpose({ send })
</script>

<template>
  <section class="support">
    <div class="page-head">
      <h1>Ayuda</h1>
    </div>
    <p class="intro">
      Pregúntale al asistente de RedNexus cómo usar la plataforma: registro, solicitudes de ayuda,
      emparejamiento, calificaciones y normas de la comunidad.
    </p>

    <SuggestedQuestions :disabled="sending" @select="send" />

    <div ref="listEl" class="chat" aria-live="polite">
      <p v-if="messages.length === 0" class="meta">
        Aún no hay mensajes. Escribe tu primera pregunta.
      </p>

      <!-- FE-11: reemplazar este bloque por <ChatMessage v-for=... /> -->
      <article
        v-for="(entry, index) in messages"
        :key="index"
        class="bubble"
        :data-role="entry.role"
      >
        <p class="bubble-text">{{ entry.content }}</p>
        <p v-if="entry.sources?.length" class="meta">Fuentes: {{ entry.sources.join(', ') }}</p>
      </article>

      <p v-if="sending" class="meta typing">El asistente está escribiendo…</p>
    </div>

    <p v-if="alertMessage" class="alert" role="alert">{{ alertMessage }}</p>

    <form class="form" @submit.prevent="send()">
      <BaseTextarea
        id="support-question"
        v-model="text"
        label="Tu pregunta"
        placeholder="¿Cómo creo una solicitud de ayuda?"
        :maxlength="1000"
        :disabled="sending"
        required
      />
      <div class="actions">
        <BaseButton type="submit" :disabled="sending || text.trim().length < 2">Enviar</BaseButton>
      </div>
    </form>

    <!-- FE-12: aquí va la lista de preguntas frecuentes (<FaqList />) -->
  </section>
</template>

<style scoped>
.support {
  display: grid;
  gap: var(--space-4);
  max-width: var(--measure);
}

.intro {
  margin: 0;
  color: var(--ink-soft);
}

.chat {
  display: grid;
  gap: var(--space-3);
  max-height: 28rem;
  overflow-y: auto;
  padding: var(--space-4);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

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

.bubble-text {
  margin: 0;
  white-space: pre-wrap;
}

.typing {
  font-style: italic;
}
</style>
