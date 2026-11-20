<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
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
      <h1>Nueva solicitud</h1>
    </div>

    <form class="form" @submit.prevent="submit">
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
      />
      <VoiceNoteRecorder @recorded="voiceNote = $event" />
      <p v-if="alertMessage" class="alert">{{ alertMessage }}</p>
      <div class="actions">
        <BaseButton type="submit" :disabled="submitting">Publicar</BaseButton>
        <BaseButton variant="quiet" :to="{ name: 'help-requests' }">Volver</BaseButton>
      </div>
    </form>
  </section>
</template>
