<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import { getMyProfile, type Profile } from './api'
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
</script>

<template>
  <section>
    <div class="page-head">
      <h1>Mi perfil</h1>
    </div>

    <BaseSpinner v-if="loading" />
    <BaseAlert v-else-if="error" :message="error" />

    <BaseCard v-else-if="profile" as="section">
      <ProfileForm v-if="editing" :profile="profile" @saved="onSaved" @cancel="editing = false" />

      <template v-else>
        <div class="page-head">
          <h2>{{ profile.name }}</h2>
          <p class="meta">
            <span aria-hidden="true">★</span>
            <!-- Sin calificaciones todavia no es lo mismo que calificacion 0 -->
            {{ profile.rating !== null ? profile.rating.toFixed(1) : 'Sin calificaciones' }}
          </p>
        </div>
        <p class="meta">{{ profile.email }}</p>

        <p>{{ profile.bio || 'Aun no has escrito tu descripcion.' }}</p>

        <ul v-if="profile.tags.length" class="tags" aria-label="Etiquetas">
          <li v-for="tag in profile.tags" :key="tag" class="tag">
            {{ tag }}
          </li>
        </ul>

        <button type="button" class="btn" data-variant="secondary" @click="editing = true">
          Editar perfil
        </button>
      </template>
    </BaseCard>
  </section>
</template>
