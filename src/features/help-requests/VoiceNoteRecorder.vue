<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'

const maxSeconds = 60

const emit = defineEmits<{ recorded: [audio: Blob | null] }>()

type RecorderStatus = 'idle' | 'recording' | 'ready' | 'denied' | 'unsupported' | 'missing'

const status = ref<RecorderStatus>('idle')
const seconds = ref(0)
const audioUrl = ref<string | null>(null)

let recorder: MediaRecorder | null = null
let stream: MediaStream | null = null
let chunks: Blob[] = []
let timer = 0

function clock(total: number) {
  const mins = Math.floor(total / 60)
  const secs = String(total % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function releaseStream() {
  stream?.getTracks().forEach((track) => track.stop())
  stream = null
}

function clearAudio() {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
  audioUrl.value = null
  emit('recorded', null)
}

function finishRecording() {
  window.clearInterval(timer)
  timer = 0
  const blob = new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' })
  clearAudio()
  audioUrl.value = URL.createObjectURL(blob)
  status.value = 'ready'
  emit('recorded', blob)
  releaseStream()
  recorder = null
}

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    status.value = 'unsupported'
    return
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (caught) {
    status.value =
      caught instanceof DOMException && caught.name === 'NotFoundError' ? 'missing' : 'denied'
    return
  }

  chunks = []
  clearAudio()
  const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
  recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
  recorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) chunks.push(event.data)
  })
  recorder.addEventListener('stop', finishRecording)
  recorder.start()
  status.value = 'recording'
  seconds.value = 0
  timer = window.setInterval(() => {
    seconds.value += 1
    if (seconds.value >= maxSeconds) stopRecording()
  }, 1000)
}

function stopRecording() {
  window.clearInterval(timer)
  timer = 0
  if (recorder && recorder.state !== 'inactive') recorder.stop()
  else releaseStream()
}

function recordAgain() {
  void startRecording()
}

onUnmounted(() => {
  window.clearInterval(timer)
  recorder?.removeEventListener('stop', finishRecording)
  if (recorder && recorder.state !== 'inactive') recorder.stop()
  releaseStream()
  clearAudio()
})
</script>

<template>
  <section class="field voice" aria-labelledby="voice-note-label">
    <div class="voice-row">
      <span class="icon-tile" :data-tone="status === 'recording' ? 'danger' : 'violet'">
        <AppIcon name="mic" />
      </span>
      <div class="voice-copy">
        <span id="voice-note-label" class="field-label">Nota de voz</span>
        <p v-if="status === 'recording'" class="hint recording" role="status">
          <span class="rec-dot" aria-hidden="true" />Grabando {{ clock(seconds) }} de 1:00
        </p>
        <p v-else-if="status === 'ready'" class="hint">
          Escúchala antes de publicar. Si no escribes la duda, se publica esta nota de voz y la IA
          la transcribe.
        </p>
        <p v-else-if="status === 'idle'" class="hint">Hasta 60 segundos.</p>
      </div>
      <button
        v-if="status !== 'recording'"
        type="button"
        class="btn"
        data-variant="secondary"
        @click="status === 'ready' ? recordAgain() : startRecording()"
      >
        <AppIcon :name="status === 'ready' ? 'refresh' : 'mic'" />
        {{ status === 'ready' ? 'Volver a grabar' : 'Grabar' }}
      </button>
      <button v-else type="button" class="btn" data-variant="danger" @click="stopRecording">
        <AppIcon name="stop" />Detener
      </button>
    </div>
    <audio v-if="audioUrl" class="note-audio" :src="audioUrl" controls />
    <p v-if="status === 'denied'" class="alert">
      No hay permiso para usar el micrófono. Actívalo en el navegador e inténtalo de nuevo.
    </p>
    <p v-if="status === 'missing'" class="alert">No encontramos un micrófono.</p>
    <p v-if="status === 'unsupported'" class="alert">Este navegador no puede grabar audio.</p>
  </section>
</template>

<style scoped>
.voice {
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-lg);
  background: var(--surface-2);
}

.voice-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.voice-copy {
  display: grid;
  gap: 0.15rem;
  flex: 1;
  min-width: 12rem;
}

.voice .alert {
  margin: 0;
}

.recording {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--danger);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.rec-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: var(--radius-pill);
  background: currentColor;
  animation: pulse 1s ease-in-out infinite;
}
</style>
