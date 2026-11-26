<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { useSessionStore } from '@/stores/session'
import { deleteMyAccount, exportMyData } from './api'

const router = useRouter()

const exporting = ref(false)
const confirming = ref(false)
const confirmText = ref('')
const deleting = ref(false)
const error = ref('')

async function download() {
  exporting.value = true
  error.value = ''
  try {
    const data = await exportMyData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'mis-datos-rednexus.json'
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    error.value = 'No se pudieron descargar tus datos. Inténtalo de nuevo.'
  } finally {
    exporting.value = false
  }
}

async function remove() {
  if (confirmText.value.trim().toUpperCase() !== 'ELIMINAR') return
  deleting.value = true
  error.value = ''
  try {
    await deleteMyAccount()
    useSessionStore().logout()
    await router.push('/login')
  } catch {
    error.value = 'No se pudo eliminar la cuenta. Inténtalo de nuevo.'
    deleting.value = false
  }
}
</script>

<template>
  <section class="panel my-data" aria-labelledby="my-data-title">
    <h2 id="my-data-title" class="panel-title">
      <span class="icon-tile" data-tone="success"><AppIcon name="shield" /></span>Mis datos
    </h2>
    <p class="meta">
      Por la Ley 1581 de 2012 puedes conocer todo lo que RedNexus guarda de ti y pedir que se borre.
    </p>
    <div class="actions">
      <button
        type="button"
        class="btn"
        data-variant="secondary"
        :disabled="exporting"
        @click="download"
      >
        <AppIcon name="download" />{{ exporting ? 'Preparando…' : 'Descargar mis datos' }}
      </button>
      <button
        v-if="!confirming"
        type="button"
        class="btn delete-link"
        data-variant="quiet"
        @click="confirming = true"
      >
        Eliminar mi cuenta
      </button>
    </div>

    <div v-if="confirming" class="danger" role="group" aria-labelledby="delete-title">
      <p id="delete-title">
        Se borrarán tu cuenta, tus solicitudes, tus candidaturas, tus calificaciones y tus PQRS. No
        se puede deshacer. Escribe <strong>ELIMINAR</strong> para confirmar.
      </p>
      <input
        id="delete-confirm"
        v-model="confirmText"
        class="input"
        aria-label="Escribe ELIMINAR para confirmar"
        autocomplete="off"
      />
      <div class="actions">
        <button
          type="button"
          class="btn"
          data-variant="primary"
          :disabled="deleting || confirmText.trim().toUpperCase() !== 'ELIMINAR'"
          @click="remove"
        >
          {{ deleting ? 'Eliminando…' : 'Eliminar definitivamente' }}
        </button>
        <button
          type="button"
          class="btn"
          data-variant="quiet"
          :disabled="deleting"
          @click="((confirming = false), (confirmText = ''))"
        >
          Cancelar
        </button>
      </div>
    </div>
    <p v-if="error" class="alert" role="alert">{{ error }}</p>
  </section>
</template>

<style scoped>
.my-data {
  margin: 0;
}

.my-data p {
  margin: 0;
}

.delete-link[data-variant='quiet'] {
  color: var(--danger);
}

.delete-link[data-variant='quiet']:hover:not(:disabled) {
  background: var(--danger-bg);
  color: var(--danger);
}

.danger {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--danger-line);
  border-radius: var(--radius);
  background: var(--danger-bg);
  color: var(--ink);
  font-size: 0.925rem;
}

.danger .btn[data-variant='primary'] {
  background: #dc2626;
  border-color: #b91c1c;
  box-shadow: none;
}

.danger .btn[data-variant='primary']:hover:not(:disabled) {
  background: #b91c1c;
}
</style>
