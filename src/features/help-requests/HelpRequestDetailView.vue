<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
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

function humanize(value: string) {
  const text = value.replace(/[-_]/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function percent(score: number) {
  return `${Math.round(Math.max(0, Math.min(1, score)) * 100)} %`
}

const nextStep = computed(() => {
  switch (request.value?.status) {
    case 'PENDING':
      return 'La IA está clasificando tu duda y buscando a los compañeros más cercanos.'
    case 'MATCHED':
      return 'Les avisamos a los compañeros sugeridos. Cuando uno acepte, verás su correo aquí.'
    case 'ACCEPTED':
      return 'Un compañero aceptó ayudarte. Escríbele al correo de contacto y, al terminar, califica la ayuda.'
    default:
      return 'Esta solicitud está cerrada. Puedes publicar una nueva cuando quieras.'
  }
})

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase()
}
</script>

<template>
  <section>
    <div class="page-head">
      <div>
        <BaseButton variant="quiet" class="is-sm back" :to="{ name: 'help-requests' }">
          <AppIcon name="arrowLeft" />Volver
        </BaseButton>
        <h1>Solicitud</h1>
      </div>
    </div>

    <p v-if="loading" class="loading">Cargando solicitud…</p>
    <EmptyState v-else-if="needsSession" :message="sessionRequiredMessage">
      <template #icon>
        <AppIcon name="lock" class="empty-icon" />
      </template>
      <BaseButton v-if="devLoginAvailable" :disabled="entering" @click="enterWithDemo">
        Entrar con la cuenta de prueba
      </BaseButton>
      <BaseButton v-else to="/login">Iniciar sesión</BaseButton>
    </EmptyState>
    <p v-else-if="error && !request" class="alert" role="alert">{{ error }}</p>

    <div v-else-if="request" class="split detail">
      <div class="detail-main">
        <article class="panel request-card">
          <div class="panel-head">
            <StatusBadge :status="badgeStatus(request.status)" />
            <span class="meta date"><AppIcon name="clock" />{{ formatCreatedAt(request.createdAt) }}</span>
          </div>
          <p class="text">{{ request.text }}</p>
          <ul v-if="request.area || request.level || request.topics.length" class="kv">
            <li v-if="request.area">
              <span class="k">Área</span><span class="v">{{ humanize(request.area) }}</span>
            </li>
            <li v-if="request.level">
              <span class="k">Nivel</span><span class="v">{{ humanize(request.level) }}</span>
            </li>
          </ul>
          <ul v-if="request.topics.length" class="tags" aria-label="Temas">
            <li v-for="topic in request.topics" :key="topic" class="tag" data-tone="brand">
              {{ topic }}
            </li>
          </ul>
        </article>

        <h2 class="section-title">
          Compañeros sugeridos
          <span v-if="candidates.length" class="count">{{ candidates.length }}</span>
        </h2>

        <p v-if="request.status === 'PENDING'" class="notice" role="status">
          <span class="spinner" aria-hidden="true" />
          Buscando compañeros. Esta página se actualiza sola.
        </p>
        <EmptyState
          v-else-if="candidates.length === 0"
          message="Nadie en la red sabe de este tema todavía. Puedes preguntarle al asistente o radicar una PQRS."
        >
          <template #icon>
            <AppIcon name="users" class="empty-icon" />
          </template>
          <BaseButton variant="secondary" :to="{ name: 'support' }"
            >Preguntar al asistente</BaseButton
          >
          <BaseButton variant="secondary" :to="{ name: 'pqrs' }">Radicar una PQRS</BaseButton>
        </EmptyState>

        <ul v-else class="candidate-list">
          <li v-for="match in candidates" :key="match.id" class="candidate reveal">
            <span class="avatar">{{ initial(match.helper.name) }}</span>
            <div class="candidate-body">
              <div class="candidate-head">
                <div>
                  <p class="candidate-name">{{ match.helper.name }}</p>
                  <p class="meta">{{ matchStatusLabel(match.status) }}</p>
                </div>
                <span class="meter" :title="`Puntaje: ${match.score.toFixed(2)}`">
                  Afinidad
                  <span class="meter-track" aria-hidden="true">
                    <span class="meter-fill" :style="{ width: percent(match.score) }" />
                  </span>
                  {{ percent(match.score) }}
                </span>
              </div>
              <p v-if="match.helper.bio" class="meta">{{ match.helper.bio }}</p>
              <ul v-if="match.helper.tags.length" class="tags" aria-label="Temas del compañero">
                <li v-for="tag in match.helper.tags" :key="tag" class="tag">{{ tag }}</li>
              </ul>
              <p class="candidate-why">
                <AppIcon name="sparkles" />
                <span>{{ match.explanation ?? 'Sin explicación todavía.' }}</span>
              </p>
              <p v-if="match.helper.email" class="contact">
                <AppIcon name="mail" />
                <span
                  >Contacto:
                  <a :href="`mailto:${match.helper.email}`">{{ match.helper.email }}</a></span
                >
              </p>
            </div>
          </li>
        </ul>

        <p v-if="error" class="alert" role="alert">{{ error }}</p>
      </div>

      <aside class="detail-side">
        <article v-if="canRate" class="panel" aria-labelledby="rate-title">
          <span class="icon-tile" data-tone="warning"><AppIcon name="star" /></span>
          <h2 id="rate-title">¿Cómo te ayudó {{ acceptedHelper?.name }}?</h2>
          <p class="meta">Tu calificación mejora las recomendaciones de la IA para los demás.</p>
          <StarRating v-model="stars" label="Calificación de la ayuda" />
          <p v-if="ratingError" class="alert" role="alert">{{ ratingError }}</p>
          <BaseButton :disabled="stars < 1 || rating" @click="submitRating">Calificar</BaseButton>
        </article>
        <div v-else-if="request.rating" class="panel rated">
          <p class="meta">Calificaste la ayuda con</p>
          <StarRating :model-value="request.rating.stars" readonly label="Tu calificación" />
        </div>

        <div class="panel side-info">
          <h2 class="panel-title">
            <span class="icon-tile" data-tone="blue"><AppIcon name="info" /></span>¿Qué sigue?
          </h2>
          <p class="meta">{{ nextStep }}</p>
          <BaseButton
            v-if="canClose"
            variant="secondary"
            class="is-sm"
            :disabled="closing"
            @click="closeRequest"
          >
            <AppIcon name="checkCircle" />Cerrar solicitud
          </BaseButton>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.back {
  margin: 0 0 var(--space-2) calc(var(--space-3) * -1);
}

.detail-main,
.detail-side {
  display: grid;
  align-content: start;
  min-width: 0;
}

.detail-side .panel {
  justify-items: start;
}

.detail-side .panel h2 {
  font-size: 1.15rem;
}

.request-card {
  gap: var(--space-4);
}

.date {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--ink-faint);
}

.date svg,
.contact svg {
  width: 1rem;
  height: 1rem;
  flex: none;
}

.notice .spinner {
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.1rem;
  border-top-color: currentColor;
}

.candidate-body {
  display: grid;
  gap: var(--space-3);
  flex: 1;
  min-width: 0;
}

.candidate-body p {
  margin: 0;
}

.candidate-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2) var(--space-4);
}

.candidate-name {
  font-weight: 650;
  font-size: 1.05rem;
}

.contact {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--ink-soft);
  font-size: 0.9rem;
  word-break: break-all;
}

.rated {
  gap: var(--space-2);
}
</style>
