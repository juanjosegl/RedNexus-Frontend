<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import { getMyProfile, type Profile } from './api'
import MyDataSection from './MyDataSection.vue'
import ProfileForm from './ProfileForm.vue'

const profile = ref<Profile | null>(null)
const error = ref('')
const loading = ref(true)
const editing = ref(false)

onMounted(async () => {
  try {
    profile.value = await getMyProfile()
  } catch {
    error.value = 'No se pudo cargar el perfil'
  } finally {
    // finally garantiza que el spinner desaparezca aunque falle la carga
    loading.value = false
  }
})

function onSaved(updated: Profile) {
  profile.value = updated
  editing.value = false
}

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase()
}
</script>

<template>
  <section>
    <div class="page-head">
      <div>
        <p class="eyebrow"><AppIcon name="user" />Tu cuenta</p>
        <h1>Mi perfil</h1>
        <p class="page-sub">
          Tu descripción y tus etiquetas son lo que la IA compara con las dudas de la red.
        </p>
      </div>
    </div>

    <BaseSpinner v-if="loading" />
    <BaseAlert v-else-if="error" :message="error" />

    <div v-else-if="profile" class="split">
      <BaseCard as="section" class="profile-card">
        <template v-if="editing">
          <h2 class="panel-title">
            <span class="icon-tile"><AppIcon name="edit" /></span>Editar perfil
          </h2>
          <ProfileForm :profile="profile" @saved="onSaved" @cancel="editing = false" />
        </template>

        <template v-else>
          <div class="profile-head">
            <span class="avatar is-lg" aria-hidden="true">{{ initial(profile.name) }}</span>
            <div class="profile-id">
              <h2>{{ profile.name }}</h2>
              <p class="meta"><AppIcon name="mail" />{{ profile.email }}</p>
            </div>
            <p class="rating" :data-empty="profile.rating === null">
              <span aria-hidden="true">★</span>
              <!-- Sin calificaciones todavia no es lo mismo que calificacion 0 -->
              {{ profile.rating !== null ? profile.rating.toFixed(1) : 'Sin calificaciones' }}
            </p>
          </div>

          <div class="profile-section">
            <h3>Sobre mí</h3>
            <p :class="{ muted: !profile.bio }">
              {{ profile.bio || 'Aun no has escrito tu descripcion.' }}
            </p>
          </div>

          <div class="profile-section">
            <h3>Temas en los que puedo ayudar</h3>
            <ul v-if="profile.tags.length" class="tags" aria-label="Etiquetas">
              <li v-for="tag in profile.tags" :key="tag" class="tag" data-tone="brand">
                {{ tag }}
              </li>
            </ul>
            <p v-else class="muted">Agrega etiquetas para que la IA te proponga como ayudante.</p>
          </div>

          <button type="button" class="btn" data-variant="secondary" @click="editing = true">
            <AppIcon name="edit" />Editar perfil
          </button>
        </template>
      </BaseCard>

      <div class="side">
        <MyDataSection />
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-card {
  gap: var(--space-5);
}

.profile-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--line);
}

.profile-id {
  display: grid;
  gap: var(--space-1);
  flex: 1;
  min-width: 12rem;
}

.profile-id .meta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  word-break: break-all;
}

.profile-id .meta svg {
  width: 1rem;
  height: 1rem;
  flex: none;
}

.rating {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  padding: 0.35rem 0.8rem;
  border: 1px solid var(--warning-line);
  border-radius: var(--radius-pill);
  background: var(--warning-bg);
  color: var(--warning);
  font-weight: 650;
  font-size: 0.9rem;
}

.rating span {
  color: var(--star);
}

.rating[data-empty='true'] {
  border-color: var(--line);
  background: var(--surface-2);
  color: var(--ink-soft);
}

.profile-section {
  display: grid;
  gap: var(--space-2);
}

.profile-section h3 {
  margin: 0;
  color: var(--ink-faint);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.profile-section p {
  margin: 0;
}

.side {
  display: grid;
  gap: var(--space-5);
}
</style>
