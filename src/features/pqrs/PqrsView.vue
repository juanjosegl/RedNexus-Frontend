<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
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
      <div>
        <BaseButton variant="quiet" class="is-sm back" :to="{ name: 'support' }">
          <AppIcon name="arrowLeft" />Volver a la ayuda
        </BaseButton>
        <h1>PQRS</h1>
        <p class="intro">
          Radica una petición, queja, reclamo o sugerencia sobre RedNexus. Recibes un número de
          radicado y la respuesta del equipo aparece aquí mismo.
        </p>
      </div>
    </div>

    <div class="split is-even">
      <div class="panel form-panel">
        <h2 class="panel-title">
          <span class="icon-tile" data-tone="warning"><AppIcon name="inbox" /></span>Nueva PQRS
        </h2>

        <p v-if="created" class="success" role="status">
          <AppIcon name="checkCircle" />
          <span
            >Tu PQRS quedó radicada con el número <strong>{{ created.radicado }}</strong
            >.</span
          >
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
          <div class="actions form-actions">
            <BaseButton type="submit" :disabled="submitting">
              <AppIcon name="send" />Radicar
            </BaseButton>
          </div>
        </form>
      </div>

      <div class="history">
        <h2 class="section-title">
          Mis PQRS <span v-if="!loading" class="count">{{ mine.length }}</span>
        </h2>
        <p v-if="loading" class="loading">Cargando…</p>
        <div v-else-if="mine.length === 0" class="empty">
          <AppIcon name="inbox" class="empty-icon" />
          <p>Todavía no has radicado ninguna PQRS.</p>
        </div>
        <ul v-else class="pqrs-list">
          <li v-for="item in mine" :key="item.id" class="pqrs-item">
            <div class="pqrs-head">
              <span class="radicado">{{ item.radicado }}</span>
              <span class="badge" :data-status="pqrsStatusBadge(item.status)">
                {{ pqrsStatusLabel(item.status) }}
              </span>
            </div>
            <p class="pqrs-subject">{{ item.subject }}</p>
            <p class="meta">{{ pqrsTypeLabel(item.type) }} · {{ formatDate(item.createdAt) }}</p>
            <p v-if="item.response" class="pqrs-response">
              <strong>Respuesta:</strong> {{ item.response }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.back {
  margin: 0 0 var(--space-2) calc(var(--space-3) * -1);
}

.form-panel {
  gap: var(--space-4);
  margin: 0;
}

.form-panel .success,
.form-panel .alert {
  margin: 0;
}

.form-actions {
  justify-content: flex-end;
}

.history {
  display: grid;
  min-width: 0;
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
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.pqrs-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.radicado {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--brand-text);
}

.pqrs-subject,
.pqrs-response {
  margin: 0;
}

.pqrs-subject {
  font-weight: 600;
}

.pqrs-response {
  margin-top: var(--space-1);
  padding: var(--space-3);
  border-left: 3px solid var(--success);
  border-radius: 0 var(--radius) var(--radius) 0;
  background: var(--success-bg);
  color: var(--ink);
  font-size: 0.925rem;
  white-space: pre-wrap;
}
</style>
