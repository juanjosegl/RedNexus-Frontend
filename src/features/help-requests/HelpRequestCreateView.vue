<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import VoiceNoteRecorder from './VoiceNoteRecorder.vue'
import { createHelpRequest } from './api'
import { helpRequestErrorMessage } from './errors'

const router = useRouter()
const text = ref('')
const fieldError = ref('')
const alertMessage = ref('')
const submitting = ref(false)

const hint = computed(() => `${text.value.trim().length} / 1000 · mínimo 10 caracteres`)

async function submit() {
  const value = text.value.trim()
  fieldError.value = ''
  alertMessage.value = ''
  if (value.length < 10 || value.length > 1000) {
    fieldError.value = 'La duda debe tener entre 10 y 1000 caracteres.'
    return
  }

  submitting.value = true
  try {
    const created = await createHelpRequest(value)
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
        required
      />
      <VoiceNoteRecorder />
      <p v-if="alertMessage" class="alert">{{ alertMessage }}</p>
      <div class="actions">
        <BaseButton type="submit" :disabled="submitting">Publicar</BaseButton>
        <BaseButton variant="quiet" :to="{ name: 'help-requests' }">Volver</BaseButton>
      </div>
    </form>
  </section>
</template>
