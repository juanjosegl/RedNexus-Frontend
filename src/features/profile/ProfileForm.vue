<script setup lang="ts">
import { ref } from 'vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { updateMyProfile, type Profile } from './api'

const props = defineProps<{
  /** Perfil actual, usado como valores iniciales del formulario */
  profile: Profile
}>()

const emit = defineEmits<{
  /** Se emite con el perfil ya guardado en el backend */
  saved: [profile: Profile]
  cancel: []
}>()

const name = ref(props.profile.name)
const bio = ref(props.profile.bio ?? '')
// Las etiquetas se editan como texto separado por comas
const tagsText = ref(props.profile.tags.join(', '))
const error = ref('')
const saving = ref(false)

function parseTags(text: string): string[] {
  // El Set elimina etiquetas repetidas
  return [
    ...new Set(
      text
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ]
}

async function onSubmit() {
  error.value = ''
  saving.value = true
  try {
    const updated = await updateMyProfile({
      name: name.value.trim(),
      bio: bio.value.trim(),
      tags: parseTags(tagsText.value),
    })
    emit('saved', updated)
  } catch {
    error.value = 'No se pudieron guardar los cambios'
  } finally {
    // finally reactiva el boton aunque falle el guardado
    saving.value = false
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <BaseInput id="profile-name" v-model="name" label="Nombre" autocomplete="name" required />

    <div class="flex flex-col gap-1">
      <label for="profile-bio" class="text-sm font-medium">Descripción</label>
      <textarea
        id="profile-bio"
        v-model="bio"
        rows="4"
        class="rounded-md border border-gray-300 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
      />
    </div>

    <BaseInput
      id="profile-tags"
      v-model="tagsText"
      label="Etiquetas (separadas por comas)"
      placeholder="matematicas, python, bases de datos"
    />

    <BaseAlert v-if="error" :message="error" />

    <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        class="min-h-11 rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
        @click="emit('cancel')"
      >
        Cancelar
      </button>
      <div class="sm:w-40">
        <BaseButton :loading="saving">Guardar</BaseButton>
      </div>
    </div>
  </form>
</template>
