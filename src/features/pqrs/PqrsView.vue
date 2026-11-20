<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import { createPqrs, listMyPqrs, pqrsErrorMessage } from './api'
import { pqrsStatusBadge, pqrsStatusLabel, pqrsTypeLabel, pqrsTypeOptions } from './labels'
import type { Pqrs, PqrsType } from './types'

const type = ref<PqrsType>('PETICION')
const subject = ref('')
const description = ref('')
const errors = ref({ subject: '', description: '' })
const alertMessage = ref('')
const created = ref<Pqrs | null>(null)
const submitting = ref(false)

const mine = ref<Pqrs[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    mine.value = await listMyPqrs()
  } catch (caught) {
    alertMessage.value = pqrsErrorMessage(caught)
  } finally {
    loading.value = false
  }
}

function validate() {
  const s = subject.value.trim().length
  const d = description.value.trim().length
  errors.value = {
    subject: s < 5 || s > 120 ? 'El asunto debe tener entre 5 y 120 caracteres.' : '',
    description: d < 20 || d > 2000 ? 'La descripción debe tener entre 20 y 2000 caracteres.' : '',
  }
  return !errors.value.subject && !errors.value.description
}

async function submit() {
  alertMessage.value = ''
  created.value = null
  if (!validate()) return

  submitting.value = true
  try {
    created.value = await createPqrs({
      type: type.value,
      subject: subject.value.trim(),
      description: description.value.trim(),
    })
    mine.value = [created.value, ...mine.value]
    subject.value = ''
    description.value = ''
  } catch (caught) {
    alertMessage.value = pqrsErrorMessage(caught)
  } finally {
    submitting.value = false
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-CO', { dateStyle: 'medium' })
}

onMounted(load)
</script>

<template>
  <section class="pqrs">
    <div class="page-head">
      <h1>PQRS</h1>
      <BaseButton variant="quiet" :to="{ name: 'support' }">Volver a la ayuda</BaseButton>
    </div>
    <p class="intro">
      Radica una petición, queja, reclamo o sugerencia sobre RedNexus. Recibes un número de radicado
      y la respuesta del equipo aparece aquí mismo.
    </p>

    <p v-if="created" class="success" role="status">
      Tu PQRS quedó radicada con el número <strong>{{ created.radicado }}</strong
      >.
    </p>
    <p v-if="alertMessage" class="alert" role="alert">{{ alertMessage }}</p>

    <form class="form" @submit.prevent="submit">
      <BaseSelect id="pqrs-type" v-model="type" label="Tipo" :options="pqrsTypeOptions" />
      <BaseInput
        id="pqrs-subject"
        v-model="subject"
        label="Asunto"
        placeholder="No me llegan candidatos"
        maxlength="120"
        :error="errors.subject"
        :disabled="submitting"
      />
      <BaseTextarea
        id="pqrs-description"
        v-model="description"
        label="Descripción"
        placeholder="Cuéntanos qué pasó, cuándo y qué esperabas que ocurriera."
        :maxlength="2000"
        :hint="`${description.trim().length} / 2000 · mínimo 20 caracteres`"
        :error="errors.description"
        :disabled="submitting"
      />
      <div class="actions">
        <BaseButton type="submit" :disabled="submitting">Radicar</BaseButton>
      </div>
    </form>

    <h2>Mis PQRS</h2>
    <p v-if="loading" class="meta">Cargando…</p>
    <p v-else-if="mine.length === 0" class="meta">Todavía no has radicado ninguna PQRS.</p>
    <ul v-else class="pqrs-list">
      <li v-for="item in mine" :key="item.id" class="pqrs-item">
        <div class="pqrs-head">
          <span class="meta"
            >{{ item.radicado }} · {{ pqrsTypeLabel(item.type) }} ·
            {{ formatDate(item.createdAt) }}</span
          >
          <span class="badge" :data-status="pqrsStatusBadge(item.status)">
            {{ pqrsStatusLabel(item.status) }}
          </span>
        </div>
        <p class="pqrs-subject">{{ item.subject }}</p>
        <p v-if="item.response" class="pqrs-response">
          <strong>Respuesta:</strong> {{ item.response }}
        </p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.pqrs {
  display: grid;
  gap: var(--space-4);
  max-width: var(--measure);
}

.intro {
  margin: 0;
  color: var(--ink-soft);
}

h2 {
  margin: var(--space-4) 0 0;
  font-size: 1.25rem;
}

.success {
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--st-accepted-fg);
  border-radius: var(--radius);
  background: var(--st-accepted-bg);
  color: var(--st-accepted-fg);
}

.pqrs-list {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.pqrs-item {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.pqrs-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.pqrs-subject,
.pqrs-response {
  margin: 0;
}

.pqrs-response {
  color: var(--ink-soft);
  white-space: pre-wrap;
}
</style>
