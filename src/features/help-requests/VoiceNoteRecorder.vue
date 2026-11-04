<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const maxSeconds = 60

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
}

function finishRecording() {
  window.clearInterval(timer)
  timer = 0
  const blob = new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' })
  clearAudio()
  audioUrl.value = URL.createObjectURL(blob)
  status.value = 'ready'
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
  <section class="field" aria-labelledby="voice-note-label">
    <span id="voice-note-label" class="field-label">Nota de voz</span>
    <div class="actions">
      <button
        v-if="status !== 'recording'"
        type="button"
        class="btn"
        data-variant="secondary"
        @click="status === 'ready' ? recordAgain() : startRecording()"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M6 11a6 6 0 0 0 12 0M12 17v3"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        {{ status === 'ready' ? 'Volver a grabar' : 'Grabar' }}
      </button>
      <button v-else type="button" class="btn" data-variant="secondary" @click="stopRecording">
        Detener
      </button>
    </div>
    <p v-if="status === 'recording'" class="hint">Grabando {{ clock(seconds) }} de 1:00</p>
    <audio v-if="audioUrl" class="note-audio" :src="audioUrl" controls />
    <p v-if="status === 'ready'" class="hint">
      Puedes escucharla. El envío de la nota todavía no está disponible.
    </p>
    <p v-else-if="status === 'idle'" class="hint">Hasta 60 segundos.</p>
    <p v-if="status === 'denied'" class="alert">
      No hay permiso para usar el micrófono. Actívalo en el navegador e inténtalo de nuevo.
    </p>
    <p v-if="status === 'missing'" class="alert">No encontramos un micrófono.</p>
    <p v-if="status === 'unsupported'" class="alert">Este navegador no puede grabar audio.</p>
  </section>
</template>
