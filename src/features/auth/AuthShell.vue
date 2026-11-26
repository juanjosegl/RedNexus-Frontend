<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'

// Marco común de inicio de sesión y registro: a la izquierda la propuesta de valor, a la derecha el formulario.
defineProps<{
  title: string
  subtitle: string
}>()

const points = [
  'Te conectamos con los compañeros que más saben de tu duda.',
  'Cada recomendación viene con la explicación de la IA.',
  'Puedes preguntar por texto o con una nota de voz.',
]
</script>

<template>
  <section class="auth">
    <aside class="auth-aside" aria-hidden="true">
      <p class="eyebrow"><AppIcon name="sparkles" />Red de apoyo académico</p>
      <p class="auth-claim">Aprende con tus compañeros, guiado por IA.</p>
      <ul class="auth-points">
        <li v-for="point in points" :key="point">
          <AppIcon name="checkCircle" />
          <span>{{ point }}</span>
        </li>
      </ul>
      <p class="auth-foot">
        <AppIcon name="shield" />La IA corre en infraestructura propia: tus datos no se envían a
        servicios externos.
      </p>
    </aside>

    <div class="auth-card panel">
      <div class="auth-head">
        <h1>{{ title }}</h1>
        <p class="meta">{{ subtitle }}</p>
      </div>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.auth {
  display: grid;
  gap: var(--space-5);
  align-items: stretch;
  max-width: 60rem;
  margin: 0 auto;
}

@media (min-width: 900px) {
  .auth {
    grid-template-columns: minmax(0, 1fr) minmax(0, 27rem);
    min-height: calc(100vh - 16rem);
    align-items: center;
  }
}

.auth-aside {
  display: none;
}

@media (min-width: 900px) {
  .auth-aside {
    display: grid;
    gap: var(--space-4);
    align-content: center;
    padding: var(--space-6);
    border-radius: var(--radius-xl);
    background: var(--hero);
    border: 1px solid var(--line);
    min-height: 100%;
  }
}

.auth-claim {
  margin: 0;
  font-size: 2rem;
  line-height: 1.15;
  font-weight: 750;
  letter-spacing: -0.03em;
}

.auth-points {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-2) 0 0;
  padding: 0;
  list-style: none;
  color: var(--ink-soft);
}

.auth-points li {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.auth-points svg {
  width: 1.25rem;
  height: 1.25rem;
  flex: none;
  margin-top: 0.1rem;
  color: var(--success);
}

.auth-foot {
  display: flex;
  gap: var(--space-2);
  align-items: flex-start;
  margin: var(--space-4) 0 0;
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
  color: var(--ink-faint);
  font-size: 0.875rem;
}

.auth-foot svg {
  width: 1.1rem;
  height: 1.1rem;
  flex: none;
  margin-top: 0.1rem;
}

.auth-card {
  gap: var(--space-5);
  margin: 0;
  padding: clamp(1.25rem, 1rem + 2vw, 2.25rem);
  box-shadow: var(--shadow-lg);
}

.auth-head h1 {
  font-size: 1.6rem;
}

.auth-head .meta {
  margin-top: var(--space-1);
}
</style>
