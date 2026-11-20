<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import EmptyState from '@/components/EmptyState.vue'
import { matchStatusLabel } from '@/features/help-requests/statusLabels'
import { acceptMatch, listIncomingMatches, rejectMatch } from './api'
import { matchErrorMessage } from './errors'
import type { IncomingMatch } from './types'

const matches = ref<IncomingMatch[]>([])
const loading = ref(true)
const error = ref('')
// id del match que espera confirmación y de la acción en curso
const confirming = ref<{ id: string; action: 'accept' | 'reject' } | null>(null)
const busyId = ref('')
const rowError = ref<Record<string, string>>({})

const pending = computed(() =>
  matches.value.filter((m) => m.status === 'PROPOSED' && m.request.status === 'MATCHED'),
)
const answered = computed(() => matches.value.filter((m) => !pending.value.includes(m)))

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function outcome(match: IncomingMatch) {
  if (match.status === 'ACCEPTED') return 'Aceptaste ayudar'
  if (match.status === 'REJECTED') return 'No pudiste ayudar'
  if (match.request.status === 'ACCEPTED') return 'Otro compañero aceptó primero'
  return 'La solicitud se cerró'
}

async function load() {
  loading.value = matches.value.length === 0
  error.value = ''
  try {
    matches.value = await listIncomingMatches()
  } catch (caught) {
    error.value = matchErrorMessage(caught)
  } finally {
    loading.value = false
  }
}

async function confirm() {
  if (!confirming.value) return
  const { id, action } = confirming.value
  busyId.value = id
  rowError.value = { ...rowError.value, [id]: '' }
  try {
    const match = matches.value.find((m) => m.id === id)
    if (action === 'accept') {
      const { authorEmail } = await acceptMatch(id)
      if (match) {
        match.status = 'ACCEPTED'
        match.request.status = 'ACCEPTED'
        match.request.author.email = authorEmail
      }
    } else {
      await rejectMatch(id)
      if (match) match.status = 'REJECTED'
    }
    confirming.value = null
  } catch (caught) {
    rowError.value = { ...rowError.value, [id]: matchErrorMessage(caught) }
    confirming.value = null
    // el estado cambió en el servidor (por ejemplo, otro aceptó): refrescar
    await load()
  } finally {
    busyId.value = ''
  }
}

onMounted(load)
</script>

<template>
  <section>
    <div class="page-head">
      <h1>Ayudar</h1>
      <BaseButton variant="quiet" @click="load">Actualizar</BaseButton>
    </div>
    <p class="hint">
      Aquí aparecen las dudas en las que la IA te propuso como ayudante. Si aceptas, el autor recibe
      tu correo y tú el suyo.
    </p>

    <p v-if="loading" class="hint">Cargando solicitudes…</p>
    <p v-else-if="error" class="alert">{{ error }}</p>
    <EmptyState
      v-else-if="matches.length === 0"
      message="Todavía no te han propuesto como ayudante. Completa tu perfil para que la IA te encuentre."
    >
      <template #icon>
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </template>
      <BaseButton :to="{ name: 'profile' }">Ir a mi perfil</BaseButton>
    </EmptyState>

    <template v-else>
      <h2 class="section-title">Por responder ({{ pending.length }})</h2>
      <p v-if="pending.length === 0" class="hint">No tienes solicitudes por responder.</p>
      <ul class="candidate-list" aria-label="Solicitudes por responder">
        <li v-for="match in pending" :key="match.id" class="candidate" data-testid="pending-match">
          <span class="avatar">{{ match.request.author.name.charAt(0).toUpperCase() }}</span>
          <div class="match-body">
            <p class="text">{{ match.request.text }}</p>
            <p class="meta">
              {{ match.request.author.name }} · {{ formatDate(match.createdAt) }} · Puntaje:
              {{ match.score.toFixed(2) }}
            </p>
            <p v-if="match.request.area" class="meta">
              Área: {{ match.request.area }}
              <template v-if="match.request.level"> · Nivel: {{ match.request.level }}</template>
            </p>
            <p class="candidate-why">
              {{ match.explanation ?? 'Tu perfil es cercano a esta duda.' }}
            </p>

            <div v-if="confirming?.id === match.id" class="actions" role="group">
              <span class="meta">
                {{
                  confirming.action === 'accept'
                    ? '¿Confirmas que puedes ayudar? Se compartirán los correos.'
                    : '¿Seguro que no puedes ayudar?'
                }}
              </span>
              <BaseButton :disabled="busyId === match.id" @click="confirm">Confirmar</BaseButton>
              <BaseButton
                variant="quiet"
                :disabled="busyId === match.id"
                @click="confirming = null"
              >
                Cancelar
              </BaseButton>
            </div>
            <div v-else class="actions">
              <BaseButton @click="confirming = { id: match.id, action: 'accept' }">
                Puedo ayudar
              </BaseButton>
              <BaseButton
                variant="secondary"
                @click="confirming = { id: match.id, action: 'reject' }"
              >
                No puedo
              </BaseButton>
            </div>
            <p v-if="rowError[match.id]" class="alert">{{ rowError[match.id] }}</p>
          </div>
        </li>
      </ul>

      <h2 v-if="answered.length" class="section-title">Respondidas</h2>
      <ul class="candidate-list" aria-label="Solicitudes respondidas">
        <li
          v-for="match in answered"
          :key="match.id"
          class="candidate"
          data-testid="answered-match"
        >
          <span class="avatar">{{ match.request.author.name.charAt(0).toUpperCase() }}</span>
          <div class="match-body">
            <p class="text">{{ match.request.text }}</p>
            <p class="meta">
              {{ outcome(match) }} · {{ matchStatusLabel(match.status) }} ·
              {{ formatDate(match.createdAt) }}
            </p>
            <p v-if="match.status === 'ACCEPTED' && match.request.author.email" class="contact">
              Contacto de {{ match.request.author.name }}:
              <a :href="`mailto:${match.request.author.email}`">{{ match.request.author.email }}</a>
            </p>
            <p v-if="rowError[match.id]" class="alert">{{ rowError[match.id] }}</p>
          </div>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.section-title {
  margin: var(--space-5) 0 var(--space-3);
  font-size: 1.125rem;
}

.match-body {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  flex: 1;
}

.match-body p {
  margin: 0;
}

.contact a {
  color: var(--blue-text);
  word-break: break-all;
}
</style>
