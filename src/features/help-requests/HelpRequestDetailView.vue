<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import EmptyState from '@/components/EmptyState.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import StarRating from '@/features/ratings/StarRating.vue'
import { rateHelpRequest } from '@/features/ratings/api'
import { HttpError } from '@/services/http'
import { closeHelpRequest } from './api'
import { devLoginAvailable, loginWithDevAccount } from './devLogin'
import { helpRequestErrorMessage, sessionRequiredMessage } from './errors'
import { badgeStatus, matchStatusLabel } from './statusLabels'
import { useHelpRequestDetail } from './useHelpRequestDetail'

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))
const { request, loading, error } = useHelpRequestDetail(id)

const candidates = computed(() => request.value?.matches.slice(0, 3) ?? [])
const needsSession = computed(() => error.value === sessionRequiredMessage)
const entering = ref(false)

// FE-07: calificar la ayuda de una solicitud aceptada
const stars = ref(0)
const rating = ref(false)
const ratingError = ref('')
const closing = ref(false)
const acceptedHelper = computed(
  () => request.value?.matches.find((m) => m.status === 'ACCEPTED')?.helper ?? null,
)
const canRate = computed(
  () => request.value?.status === 'ACCEPTED' && !request.value.rating && acceptedHelper.value,
)
const canClose = computed(
  () => request.value && request.value.status !== 'CLOSED' && request.value.status !== 'PENDING',
)

async function submitRating() {
  if (!request.value || stars.value < 1) return
  rating.value = true
  ratingError.value = ''
  try {
    const saved = await rateHelpRequest(request.value.id, stars.value)
    request.value.rating = { stars: saved.stars }
  } catch (caught) {
    ratingError.value =
      caught instanceof HttpError && caught.status === 409
        ? 'Ya calificaste esta ayuda.'
        : helpRequestErrorMessage(caught)
  } finally {
    rating.value = false
  }
}

async function closeRequest() {
  if (!request.value) return
  closing.value = true
  try {
    const closed = await closeHelpRequest(request.value.id)
    request.value.status = closed.status
  } catch (caught) {
    error.value = helpRequestErrorMessage(caught)
  } finally {
    closing.value = false
  }
}

async function enterWithDemo() {
  entering.value = true
  try {
    await loginWithDevAccount()
  } catch {
    error.value = 'No se pudo entrar con la cuenta de prueba.'
  } finally {
    entering.value = false
  }
}

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase()
}
</script>

<template>
  <section>
    <div class="page-head">
      <h1>Solicitud</h1>
      <BaseButton variant="quiet" :to="{ name: 'help-requests' }">Volver</BaseButton>
    </div>

    <p v-if="loading" class="hint">Cargando solicitud…</p>
    <EmptyState v-else-if="needsSession" :message="sessionRequiredMessage">
      <template #icon>
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="5"
            y="11"
            width="14"
            height="9"
            rx="2"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M8 11V8a4 4 0 0 1 8 0v3"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </template>
      <BaseButton v-if="devLoginAvailable" :disabled="entering" @click="enterWithDemo">
        Entrar con la cuenta de prueba
      </BaseButton>
      <BaseButton v-else to="/login">Iniciar sesión</BaseButton>
    </EmptyState>
    <p v-else-if="error && !request" class="alert">{{ error }}</p>

    <template v-else-if="request">
      <article class="panel">
        <StatusBadge :status="badgeStatus(request.status)" />
        <p class="text">{{ request.text }}</p>
        <p class="meta">{{ formatCreatedAt(request.createdAt) }}</p>
        <p v-if="request.area" class="meta">Área: {{ request.area }}</p>
        <p v-if="request.topics.length" class="meta">Temas: {{ request.topics.join(', ') }}</p>
        <p v-if="request.level" class="meta">Nivel: {{ request.level }}</p>
        <BaseButton v-if="canClose" variant="quiet" :disabled="closing" @click="closeRequest">
          Cerrar solicitud
        </BaseButton>
      </article>

      <article v-if="canRate" class="panel" aria-labelledby="rate-title">
        <h2 id="rate-title">¿Cómo te ayudó {{ acceptedHelper?.name }}?</h2>
        <p class="meta">Tu calificación mejora las recomendaciones de la IA para los demás.</p>
        <StarRating v-model="stars" label="Calificación de la ayuda" />
        <p v-if="ratingError" class="alert">{{ ratingError }}</p>
        <BaseButton :disabled="stars < 1 || rating" @click="submitRating">Calificar</BaseButton>
      </article>
      <p v-else-if="request.rating" class="rated">
        Calificaste la ayuda con
        <StarRating :model-value="request.rating.stars" readonly label="Tu calificación" />
      </p>

      <p v-if="request.status === 'PENDING'" class="hint">
        Buscando compañeros. Esta página se actualiza sola.
      </p>
      <EmptyState v-else-if="candidates.length === 0" message="Todavía no hay candidatos.">
        <template #icon>
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="3" stroke="currentColor" stroke-width="1.5" />
            <circle cx="16" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5" />
            <path
              d="M4 19c.6-2.4 2.4-3.5 5-3.5s4.4 1.1 5 3.5M14 16.2c.7-.4 1.6-.7 2.5-.7 1.8 0 3.2.8 3.5 2.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </template>
        <BaseButton variant="quiet" :to="{ name: 'help-requests' }">Volver</BaseButton>
      </EmptyState>

      <ul v-else class="candidate-list">
        <li v-for="match in candidates" :key="match.id" class="candidate">
          <span class="avatar">{{ initial(match.helper.name) }}</span>
          <div>
            <p>{{ match.helper.name }}</p>
            <p class="meta">
              {{ matchStatusLabel(match.status) }} · Puntaje: {{ match.score.toFixed(2) }}
            </p>
            <p v-if="match.helper.bio" class="meta">{{ match.helper.bio }}</p>
            <p v-if="match.helper.tags.length" class="meta">{{ match.helper.tags.join(', ') }}</p>
            <p class="candidate-why">{{ match.explanation ?? 'Sin explicación todavía.' }}</p>
            <p v-if="match.helper.email" class="meta">Contacto: {{ match.helper.email }}</p>
          </div>
        </li>
      </ul>

      <p v-if="error" class="alert">{{ error }}</p>
    </template>
  </section>
</template>

<style scoped>
.rated {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0 0 var(--space-5);
}
</style>
