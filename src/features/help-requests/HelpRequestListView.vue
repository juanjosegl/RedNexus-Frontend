<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import EmptyState from '@/components/EmptyState.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useSessionStore } from '@/stores/session'
import { listMyHelpRequests } from './api'
import { devLoginAvailable, loginWithDevAccount } from './devLogin'
import { helpRequestErrorMessage, sessionRequiredMessage } from './errors'
import { badgeStatus, requestStatusOptions } from './statusLabels'
import type { HelpRequestSummary } from './types'

const requests = ref<HelpRequestSummary[]>([])
const query = ref('')
const status = ref('')
const loading = ref(true)
const error = ref('')
const entering = ref(false)
const session = useSessionStore()

const needsSession = computed(() => error.value === sessionRequiredMessage)

const visibleRequests = computed(() => {
  const term = query.value.trim().toLowerCase()
  return requests.value.filter((item) => {
    const matchesStatus = status.value === '' || item.status === status.value
    const matchesQuery = item.text.toLowerCase().includes(term)
    return matchesStatus && matchesQuery
  })
})

const emptyMessage = computed(() =>
  requests.value.length === 0
    ? 'Todavía no tienes solicitudes.'
    : 'Ninguna solicitud coincide con la búsqueda.',
)

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function clearFilters() {
  query.value = ''
  status.value = ''
}

async function load() {
  loading.value = requests.value.length === 0
  error.value = ''
  try {
    requests.value = await listMyHelpRequests()
  } catch (caught) {
    error.value = helpRequestErrorMessage(caught)
  } finally {
    loading.value = false
  }
}

async function enterWithDemo() {
  entering.value = true
  try {
    await loginWithDevAccount()
    await load()
  } catch {
    error.value = 'No se pudo entrar con la cuenta de prueba.'
  } finally {
    entering.value = false
  }
}

onMounted(load)
watch(
  () => session.token,
  () => {
    void load()
  },
)
</script>

<template>
  <section>
    <div class="page-head">
      <h1>Solicitudes</h1>
      <BaseButton :to="{ name: 'help-request-new' }">Nueva solicitud</BaseButton>
    </div>

    <EmptyState v-if="needsSession" :message="sessionRequiredMessage">
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

    <template v-else>
      <div class="toolbar">
        <BaseInput
          id="help-request-query"
          v-model="query"
          label="Buscar"
          placeholder="Texto de la duda"
        />
        <div class="field">
          <span id="help-request-status-label" class="field-label">Estado</span>
          <div
            id="help-request-status"
            class="chips"
            role="radiogroup"
            aria-labelledby="help-request-status-label"
          >
            <button
              v-for="option in requestStatusOptions"
              :key="option.value"
              type="button"
              class="chip"
              role="radio"
              :aria-checked="status === option.value"
              @click="status = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <p v-if="loading" class="hint">Cargando solicitudes…</p>
      <p v-else-if="error" class="alert">{{ error }}</p>
      <EmptyState v-else-if="visibleRequests.length === 0" :message="emptyMessage">
        <template #icon>
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5" />
            <path d="M16 16l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </template>
        <BaseButton v-if="requests.length === 0" :to="{ name: 'help-request-new' }">
          Nueva solicitud
        </BaseButton>
        <BaseButton v-else variant="secondary" @click="clearFilters">Ver todas</BaseButton>
      </EmptyState>

      <ul v-else class="request-list">
        <li v-for="item in visibleRequests" :key="item.id">
          <RouterLink
            :to="{ name: 'help-request-detail', params: { id: item.id } }"
            class="request-item"
            :data-status="badgeStatus(item.status)"
          >
            <p class="text">{{ item.text }}</p>
            <StatusBadge :status="badgeStatus(item.status)" />
            <p class="meta">{{ formatCreatedAt(item.createdAt) }}</p>
          </RouterLink>
        </li>
      </ul>
    </template>
  </section>
</template>
