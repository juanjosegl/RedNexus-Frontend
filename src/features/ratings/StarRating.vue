<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    readonly?: boolean
    label?: string
  }>(),
  { readonly: false, label: 'Calificación' },
)
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const hovered = ref(0)
const shown = computed(() => hovered.value || props.modelValue)
const stars = [1, 2, 3, 4, 5]

function pick(value: number) {
  if (!props.readonly) emit('update:modelValue', value)
}

function onKey(event: KeyboardEvent) {
  if (props.readonly) return
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault()
    pick(Math.min(5, props.modelValue + 1))
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault()
    pick(Math.max(1, props.modelValue - 1))
  }
}
</script>

<template>
  <div
    class="stars"
    :role="readonly ? 'img' : 'radiogroup'"
    :aria-label="readonly ? `${label}: ${modelValue} de 5` : label"
    @mouseleave="hovered = 0"
    @keydown="onKey"
  >
    <template v-if="readonly">
      <span v-for="n in stars" :key="n" class="star" :data-on="n <= modelValue" aria-hidden="true">
        ★
      </span>
    </template>
    <template v-else>
      <button
        v-for="n in stars"
        :key="n"
        type="button"
        class="star"
        role="radio"
        :aria-checked="modelValue === n"
        :aria-label="`${n} ${n === 1 ? 'estrella' : 'estrellas'}`"
        :tabindex="modelValue === n || (modelValue === 0 && n === 1) ? 0 : -1"
        :data-on="n <= shown"
        @click="pick(n)"
        @mouseenter="hovered = n"
      >
        ★
      </button>
    </template>
  </div>
</template>

<style scoped>
.stars {
  display: inline-flex;
  gap: var(--space-1);
}

.star {
  border: 0;
  background: none;
  padding: 0 var(--space-1);
  font-size: 1.75rem;
  line-height: 1;
  color: var(--line-strong);
  cursor: pointer;
}

span.star {
  cursor: default;
  font-size: 1.25rem;
}

.star[data-on='true'] {
  color: #f5a524;
}

.star:focus-visible {
  outline: 2px solid var(--blue-text);
  outline-offset: 2px;
  border-radius: var(--radius);
}
</style>
