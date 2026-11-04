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
  <form class="form" @submit.prevent="onSubmit">
    <BaseInput id="profile-name" v-model="name" label="Nombre" autocomplete="name" required />

    <div class="field">
      <label for="profile-bio">Descripción</label>
      <textarea id="profile-bio" v-model="bio" rows="4" class="textarea" />
    </div>

    <BaseInput
      id="profile-tags"
      v-model="tagsText"
      label="Etiquetas (separadas por comas)"
      placeholder="matematicas, python, bases de datos"
    />

    <BaseAlert v-if="error" :message="error" />

    <div class="actions">
      <button type="button" class="btn" data-variant="secondary" @click="emit('cancel')">
        Cancelar
      </button>
      <BaseButton :loading="saving">Guardar</BaseButton>
    </div>
  </form>
</template>
