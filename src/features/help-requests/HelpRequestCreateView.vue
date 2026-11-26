<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon, { type IconName } from '@/components/AppIcon.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import VoiceNoteRecorder from './VoiceNoteRecorder.vue'
import { createHelpRequest, createHelpRequestFromVoice } from './api'
import { helpRequestErrorMessage } from './errors'

const router = useRouter()
const text = ref('')
const fieldError = ref('')
const alertMessage = ref('')
const submitting = ref(false)
const voiceNote = ref<Blob | null>(null)

const hint = computed(() => `${text.value.trim().length} / 1000 · mínimo 10 caracteres`)

const tips: { icon: IconName; text: string }[] = [
  { icon: 'tag', text: 'Menciona el tema concreto: «joins en SQL» funciona mejor que «bases de datos».' },
  { icon: 'layers', text: 'Cuenta qué intentaste y en qué punto te quedaste.' },
  { icon: 'sparkles', text: 'La IA clasifica el área, los temas y el nivel, y busca a los compañeros más cercanos.' },
]

async function submit() {
  const value = text.value.trim()
  fieldError.value = ''
  alertMessage.value = ''
  // sin texto y con nota de voz: se publica la nota (el texto tiene prioridad)
  const useVoice = value.length === 0 && voiceNote.value !== null
  if (!useVoice && (value.length < 10 || value.length > 1000)) {
    fieldError.value = 'Escribe la duda (entre 10 y 1000 caracteres) o graba una nota de voz.'
    return
  }

  submitting.value = true
  try {
    const created =
      useVoice && voiceNote.value
        ? await createHelpRequestFromVoice(voiceNote.value)
        : await createHelpRequest(value)
    await router.push({ name: 'help-request-detail', params: { id: created.id } })
  } catch (caught) {
    alertMessage.value = helpRequestErrorMessage(caught)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section>
    <div class="page-head">
      <div>
        <BaseButton variant="quiet" class="is-sm back" :to="{ name: 'help-requests' }">
          <AppIcon name="arrowLeft" />Volver
        </BaseButton>
        <h1>Nueva solicitud</h1>
        <p class="page-sub">Escribe tu duda o grábala. En segundos te proponemos compañeros.</p>
      </div>
    </div>

    <div class="split">
      <form class="form panel" @submit.prevent="submit">
        <BaseTextarea
          id="help-request-text"
          v-model="text"
          label="Tu duda"
          placeholder="No entiendo cómo hacer joins en SQL"
          :maxlength="1000"
          :hint="hint"
          :error="fieldError"
          :disabled="submitting"
          :required="voiceNote === null"
          rows="6"
        />
        <div class="or" aria-hidden="true"><span>o</span></div>
        <VoiceNoteRecorder @recorded="voiceNote = $event" />
        <p v-if="alertMessage" class="alert" role="alert">{{ alertMessage }}</p>
        <div class="actions form-actions">
          <BaseButton type="submit" :disabled="submitting">
            <AppIcon name="send" />{{ submitting ? 'Publicando…' : 'Publicar' }}
          </BaseButton>
        </div>
      </form>

      <aside class="card tips" aria-labelledby="tips-title">
        <h2 id="tips-title" class="section-title">Consejos para una buena duda</h2>
        <ul>
          <li v-for="tip in tips" :key="tip.text">
            <span class="icon-tile" data-tone="blue"><AppIcon :name="tip.icon" /></span>
            <span>{{ tip.text }}</span>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.back {
  margin: 0 0 var(--space-2) calc(var(--space-3) * -1);
}

.or {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--ink-faint);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.or::before,
.or::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}

.form-actions {
  justify-content: flex-end;
  padding-top: var(--space-2);
  border-top: 1px solid var(--line);
}

.tips {
  padding: var(--space-5);
}

.tips ul {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.tips li {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  color: var(--ink-soft);
  font-size: 0.925rem;
}

.tips .icon-tile {
  width: 2.1rem;
  height: 2.1rem;
}

.tips .icon-tile svg {
  width: 1.1rem;
  height: 1.1rem;
}
</style>
