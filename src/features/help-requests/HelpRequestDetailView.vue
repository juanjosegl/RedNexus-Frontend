<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import EmptyState from '@/components/EmptyState.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { devLoginAvailable, loginWithDevAccount } from './devLogin'
import { sessionRequiredMessage } from './errors'
import { badgeStatus, matchStatusLabel } from './statusLabels'
import { useHelpRequestDetail } from './useHelpRequestDetail'

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))
const { request, loading, error } = useHelpRequestDetail(id)

const candidates = computed(() => request.value?.matches.slice(0, 3) ?? [])
const needsSession = computed(() => error.value === sessionRequiredMessage)
const entering = ref(false)

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
          <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.5" />
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
      </article>

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
