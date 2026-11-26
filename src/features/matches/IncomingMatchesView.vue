<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
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

function percent(score: number) {
  return `${Math.round(Math.max(0, Math.min(1, score)) * 100)} %`
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
      <div>
        <p class="eyebrow"><AppIcon name="heart" />Bandeja de ayudante</p>
        <h1>Ayudar</h1>
        <p class="page-sub">
          Aquí aparecen las dudas en las que la IA te propuso como ayudante. Si aceptas, el autor
          recibe tu correo y tú el suyo.
        </p>
      </div>
      <BaseButton variant="secondary" @click="load"><AppIcon name="refresh" />Actualizar</BaseButton>
    </div>

    <p v-if="loading" class="loading">Cargando solicitudes…</p>
    <p v-else-if="error" class="alert" role="alert">{{ error }}</p>
    <EmptyState
      v-else-if="matches.length === 0"
      message="Todavía no te han propuesto como ayudante. Completa tu perfil para que la IA te encuentre."
    >
      <template #icon>
        <AppIcon name="heart" class="empty-icon" />
      </template>
      <BaseButton :to="{ name: 'profile' }">Ir a mi perfil</BaseButton>
    </EmptyState>

    <template v-else>
      <h2 class="section-title">
        Por responder <span class="count">{{ pending.length }}</span>
      </h2>
      <p v-if="pending.length === 0" class="empty-line hint">No tienes solicitudes por responder.</p>
      <ul class="candidate-list" aria-label="Solicitudes por responder">
        <li v-for="match in pending" :key="match.id" class="candidate reveal" data-testid="pending-match">
          <span class="avatar">{{ match.request.author.name.charAt(0).toUpperCase() }}</span>
          <div class="match-body">
            <div class="match-head">
              <p class="meta">
                <strong>{{ match.request.author.name }}</strong> · {{ formatDate(match.createdAt) }}
              </p>
              <span class="meter" :title="`Puntaje: ${match.score.toFixed(2)}`">
                Afinidad
                <span class="meter-track" aria-hidden="true">
                  <span class="meter-fill" :style="{ width: percent(match.score) }" />
                </span>
                {{ percent(match.score) }}
              </span>
            </div>
            <p class="text">{{ match.request.text }}</p>
            <ul v-if="match.request.area || match.request.level" class="tags">
              <li v-if="match.request.area" class="tag" data-tone="brand">
                Área: {{ match.request.area }}
              </li>
              <li v-if="match.request.level" class="tag">Nivel: {{ match.request.level }}</li>
            </ul>
            <p class="candidate-why">
              <AppIcon name="sparkles" />
              <span>{{ match.explanation ?? 'Tu perfil es cercano a esta duda.' }}</span>
            </p>

            <div v-if="confirming?.id === match.id" class="confirm actions" role="group">
              <span class="confirm-text">
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
            <p v-if="rowError[match.id]" class="alert" role="alert">{{ rowError[match.id] }}</p>
          </div>
        </li>
      </ul>

      <h2 v-if="answered.length" class="section-title answered-title">
        Respondidas <span class="count">{{ answered.length }}</span>
      </h2>
      <ul class="candidate-list" aria-label="Solicitudes respondidas">
        <li
          v-for="match in answered"
          :key="match.id"
          class="candidate is-answered"
          :data-outcome="match.status"
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
              <AppIcon name="mail" />
              <span
                >Contacto de {{ match.request.author.name }}:
                <a :href="`mailto:${match.request.author.email}`">{{
                  match.request.author.email
                }}</a></span
              >
            </p>
            <p v-if="rowError[match.id]" class="alert" role="alert">{{ rowError[match.id] }}</p>
          </div>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.answered-title {
  margin-top: var(--space-6);
}

.empty-line {
  margin-bottom: var(--space-3);
}

.match-body {
  display: grid;
  gap: var(--space-3);
  min-width: 0;
  flex: 1;
}

.match-body p {
  margin: 0;
}

.match-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2) var(--space-4);
}

.match-body .text {
  font-size: 1.05rem;
  font-weight: 550;
}

.confirm {
  padding: var(--space-3);
  border: 1px solid var(--brand-line);
  border-radius: var(--radius);
  background: var(--brand-tint);
}

.confirm-text {
  flex-basis: 100%;
  color: var(--ink);
  font-size: 0.925rem;
  font-weight: 550;
}

.is-answered {
  box-shadow: none;
  background: color-mix(in srgb, var(--surface) 75%, transparent);
}

.is-answered .avatar {
  background: var(--neutral-bg);
  color: var(--neutral);
}

.is-answered[data-outcome='ACCEPTED'] .avatar {
  background: var(--success-bg);
  color: var(--success);
}

.is-answered .text {
  font-weight: 500;
}

.contact {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--ink-soft);
  font-size: 0.9rem;
}

.contact svg {
  width: 1rem;
  height: 1rem;
  flex: none;
}

.contact a {
  overflow-wrap: anywhere;
}
</style>
