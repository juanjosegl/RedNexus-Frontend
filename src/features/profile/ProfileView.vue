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
  <div class="mx-auto flex max-w-2xl flex-col gap-4">
    <h1 class="text-2xl font-bold">Mi perfil</h1>

    <BaseSpinner v-if="loading" />
    <BaseAlert v-else-if="error" :message="error" />

    <BaseCard v-else-if="profile" as="section">
      <ProfileForm v-if="editing" :profile="profile" @saved="onSaved" @cancel="editing = false" />

      <template v-else>
        <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 class="text-xl font-semibold">{{ profile.name }}</h2>
          <p class="text-sm text-slate-600">
            <span aria-hidden="true">★</span>
            <!-- Sin calificaciones todavia no es lo mismo que calificacion 0 -->
            {{ profile.rating !== null ? profile.rating.toFixed(1) : 'Sin calificaciones' }}
          </p>
        </div>
        <p class="text-sm text-slate-600">{{ profile.email }}</p>

        <p class="mt-4">{{ profile.bio || 'Aun no has escrito tu descripcion.' }}</p>

        <ul v-if="profile.tags.length" class="mt-4 flex flex-wrap gap-2" aria-label="Etiquetas">
          <li
            v-for="tag in profile.tags"
            :key="tag"
            class="rounded-full bg-slate-100 px-3 py-1 text-sm"
          >
            {{ tag }}
          </li>
        </ul>

        <button
          type="button"
          class="mt-4 min-h-11 rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
          @click="editing = true"
        >
          Editar perfil
        </button>
      </template>
    </BaseCard>
  </div>
</template>
