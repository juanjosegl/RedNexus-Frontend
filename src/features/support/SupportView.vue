<script setup lang="ts">
import { nextTick, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import BaseButton from '@/components/BaseButton.vue'
import SuggestedQuestions from './SuggestedQuestions.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import FaqList from './FaqList.vue'
import { askSupport, supportErrorMessage } from './api'
import ChatMessage from './ChatMessage.vue'
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
      <div>
        <p class="eyebrow"><AppIcon name="sparkles" />Asistente con IA</p>
        <h1>Ayuda</h1>
        <p class="intro">
          Pregúntale al asistente de RedNexus cómo usar la plataforma: registro, solicitudes de
          ayuda, emparejamiento, calificaciones y normas de la comunidad.
        </p>
      </div>
      <BaseButton variant="secondary" :to="{ name: 'pqrs' }">
        <AppIcon name="inbox" />Radicar una PQRS
      </BaseButton>
    </div>

    <div class="split">
      <div class="card chat-card">
        <header class="chat-head">
          <span class="bot-avatar" aria-hidden="true"><AppIcon name="sparkles" /></span>
          <div>
            <p class="chat-title">Asistente RedNexus</p>
            <p class="chat-status">
              <span class="online" aria-hidden="true" />Responde con la base de conocimiento de la
              plataforma
            </p>
          </div>
        </header>

        <div ref="listEl" class="chat" aria-live="polite">
          <div v-if="messages.length === 0" class="chat-empty">
            <span class="icon-tile"><AppIcon name="chat" /></span>
            <p class="meta">Aún no hay mensajes. Escribe tu primera pregunta.</p>
          </div>

          <ChatMessage v-for="(entry, index) in messages" :key="index" v-bind="entry" />

          <p v-if="sending" class="meta typing">
            <span class="dots" aria-hidden="true"><span /><span /><span /></span>
            El asistente está escribiendo…
          </p>
        </div>

        <div class="composer">
          <SuggestedQuestions :disabled="sending" @select="send" />

          <p v-if="alertMessage" class="alert" role="alert">{{ alertMessage }}</p>

          <form class="composer-form" @submit.prevent="send()">
            <BaseTextarea
              id="support-question"
              v-model="text"
              label="Tu pregunta"
              placeholder="¿Cómo creo una solicitud de ayuda?"
              :maxlength="1000"
              :disabled="sending"
              rows="2"
              required
              @keydown.enter.exact.prevent="send()"
            />
            <BaseButton
              type="submit"
              class="send"
              :disabled="sending || text.trim().length < 2"
              aria-label="Enviar"
            >
              <AppIcon name="send" /><span class="send-text">Enviar</span>
            </BaseButton>
          </form>
          <p class="hint">Enter envía · Shift + Enter hace un salto de línea</p>
        </div>
      </div>

      <aside class="card faq-card">
        <FaqList />
      </aside>
    </div>
  </section>
</template>

<style scoped>
.chat-card {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

@media (min-width: 960px) {
  .chat-card {
    min-height: 34rem;
  }
}

.chat-head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--line);
}

.chat-head p {
  margin: 0;
}

.bot-avatar {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, var(--brand), var(--violet));
  color: var(--on-brand);
}

.bot-avatar svg {
  width: 1.25rem;
  height: 1.25rem;
}

.chat-title {
  font-weight: 700;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--ink-faint);
  font-size: 0.82rem;
}

.online {
  width: 0.5rem;
  height: 0.5rem;
  flex: none;
  border-radius: var(--radius-pill);
  background: var(--success);
  box-shadow: 0 0 0 3px var(--success-bg);
}

.chat {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-height: 30rem;
  overflow-y: auto;
  padding: var(--space-5);
  background: var(--surface-2);
}

.chat-empty {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  margin: auto;
  padding: var(--space-5) 0;
  text-align: center;
}

.typing {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  font-style: italic;
}

.dots {
  display: inline-flex;
  gap: 3px;
}

.dots span {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-pill);
  background: var(--ink-faint);
  animation: pulse 1.2s ease-in-out infinite;
}

.dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.composer {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5) var(--space-4);
  border-top: 1px solid var(--line);
  background: var(--surface);
}

.composer .alert {
  margin: 0;
}

.composer-form {
  display: flex;
  align-items: flex-end;
  gap: var(--space-3);
}

.composer-form > :first-child {
  flex: 1;
}

.composer-form :deep(.textarea) {
  min-height: 3.25rem;
  max-height: 10rem;
}

.send {
  min-height: 3.25rem;
}

@media (max-width: 479px) {
  .send-text {
    display: none;
  }
}

.faq-card {
  padding: var(--space-5);
}
</style>
