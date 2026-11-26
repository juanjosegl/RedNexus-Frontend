<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon, { type IconName } from '@/components/AppIcon.vue'
import BaseButton from '@/components/BaseButton.vue'
import { http } from '@/services/http'
import { useSessionStore } from '@/stores/session'

interface PublicStats {
  users: number
  helpRequests: number
  matchedPercent: number
  averageRating: number | null
}

const session = useSessionStore()
const apiStatus = ref('comprobando...')
const stats = ref<PublicStats | null>(null)

const firstName = computed(() => session.user?.name?.trim().split(/\s+/)[0] ?? '')

const steps: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'mic',
    title: 'Escribe o graba tu duda',
    text: 'Entre 10 y 1000 caracteres, o una nota de voz de hasta 60 segundos que la IA transcribe.',
  },
  {
    icon: 'sparkles',
    title: 'La IA te propone compañeros',
    text: 'Compara tu duda con los perfiles de la red y explica por qué cada candidato puede ayudarte.',
  },
  {
    icon: 'users',
    title: 'Conecta y califica',
    text: 'Cuando alguien acepta, ambos ven el correo del otro. Tu calificación mejora las recomendaciones.',
  },
]

const shortcuts: { to: string; icon: IconName; tone: string; title: string; text: string }[] = [
  {
    to: '/ayudar',
    icon: 'heart',
    tone: 'violet',
    title: 'Ayudar a otros',
    text: 'Responde las dudas en las que la IA te propuso como ayudante.',
  },
  {
    to: '/perfil',
    icon: 'user',
    tone: 'blue',
    title: 'Mi perfil',
    text: 'Tus temas y tu descripción son lo que la IA usa para encontrarte.',
  },
  {
    to: '/pqrs',
    icon: 'inbox',
    tone: 'warning',
    title: 'PQRS',
    text: 'Radica una petición, queja, reclamo o sugerencia y sigue su respuesta.',
  },
]

const statCards = computed(() => {
  if (!stats.value) return []
  const s = stats.value
  return [
    { label: 'Estudiantes en la red', value: s.users.toLocaleString('es-CO') },
    { label: 'Dudas publicadas', value: s.helpRequests.toLocaleString('es-CO') },
    { label: 'Con candidatos', value: `${Math.round(s.matchedPercent)} %` },
    {
      label: 'Calificación promedio',
      value:
        s.averageRating !== null
          ? `${s.averageRating.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ★`
          : '—',
    },
  ]
})

onMounted(async () => {
  try {
    const res = await http<{ status: string }>('/health')
    apiStatus.value = res.status
  } catch {
    apiStatus.value = 'sin conexion'
  }

  try {
    const data = await http<PublicStats>('/stats')
    if (typeof data?.users === 'number' && typeof data.helpRequests === 'number') stats.value = data
  } catch {
    // las estadísticas son decorativas: si fallan, la sección no se muestra
  }
})
</script>

<template>
  <section class="home">
    <div class="hero reveal">
      <div class="hero-copy">
        <p class="eyebrow"><AppIcon name="sparkles" />Red de apoyo académico</p>
        <h1>
          <template v-if="firstName">Hola, {{ firstName }}. ¿Qué quieres aprender hoy?</template>
          <template v-else>Aprende con tus compañeros, guiado por IA</template>
        </h1>
        <p class="lead">
          Publica tu duda y te conectamos con los compañeros que más saben del tema.
        </p>
        <p class="hero-steps">
          Escribes o grabas la duda. Te proponemos compañeros. Abres la solicitud y ves la
          explicación.
        </p>
        <div class="actions">
          <BaseButton :to="{ name: 'help-request-new' }">
            <AppIcon name="plus" />Nueva solicitud
          </BaseButton>
          <BaseButton variant="secondary" :to="{ name: 'help-requests' }">Mis solicitudes</BaseButton>
          <BaseButton variant="quiet" :to="{ name: 'support' }">¿Necesitas ayuda?</BaseButton>
        </div>
      </div>

      <svg class="hero-art" viewBox="0 0 240 200" fill="none" aria-hidden="true">
        <g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.55">
          <path d="M120 100 60 52M120 100l64-44M120 100l-58 58M120 100l62 54M120 100V28" />
          <path d="M60 52 120 28l64 28M62 158l58 20 62-24" stroke-dasharray="3 5" opacity="0.6" />
        </g>
        <circle cx="120" cy="100" r="22" class="node-core" />
        <circle cx="120" cy="100" r="34" class="node-halo" />
        <circle cx="60" cy="52" r="11" class="node-a" />
        <circle cx="184" cy="56" r="13" class="node-b" />
        <circle cx="62" cy="158" r="12" class="node-b" />
        <circle cx="182" cy="154" r="10" class="node-a" />
        <circle cx="120" cy="28" r="8" class="node-c" />
        <circle cx="120" cy="178" r="6" class="node-c" />
      </svg>
    </div>

    <ul v-if="statCards.length" class="stats" aria-label="La red en cifras">
      <li v-for="item in statCards" :key="item.label" class="stat">
        <span class="stat-value">{{ item.value }}</span>
        <span class="stat-label">{{ item.label }}</span>
      </li>
    </ul>

    <section class="block" aria-labelledby="how-title">
      <h2 id="how-title" class="section-title">Cómo funciona</h2>
      <ol class="steps">
        <li v-for="(step, index) in steps" :key="step.title" class="card step">
          <div class="step-top">
            <span class="icon-tile"><AppIcon :name="step.icon" /></span>
            <span class="step-number">Paso {{ index + 1 }}</span>
          </div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <section class="block" aria-labelledby="shortcuts-title">
      <h2 id="shortcuts-title" class="section-title">Accesos rápidos</h2>
      <div class="shortcuts">
        <RouterLink v-for="item in shortcuts" :key="item.to" :to="item.to" class="card link-card">
          <span class="icon-tile" :data-tone="item.tone"><AppIcon :name="item.icon" /></span>
          <span class="link-card-body">
            <span class="link-card-title">{{ item.title }}</span>
            <span class="link-card-text">{{ item.text }}</span>
          </span>
          <AppIcon name="arrowRight" class="link-card-arrow" />
        </RouterLink>
      </div>
    </section>

    <p class="status-line meta">
      <span class="status-dot" :data-ok="apiStatus === 'ok'" aria-hidden="true" />
      API: <span data-testid="api-status">{{ apiStatus }}</span>
      <span class="status-sep" aria-hidden="true">·</span>
      <AppIcon name="cpu" class="status-icon" />IA local, tus datos no salen de la plataforma
    </p>
  </section>
</template>

<style scoped>
.home {
  display: grid;
  gap: var(--space-6);
}

.hero {
  position: relative;
  display: grid;
  gap: var(--space-5);
  align-items: center;
  padding: clamp(1.5rem, 1rem + 3vw, 3.25rem);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--hero);
  box-shadow: var(--shadow);
  overflow: hidden;
}

@media (min-width: 860px) {
  .hero {
    grid-template-columns: minmax(0, 1fr) 16rem;
  }
}

.hero h1 {
  margin: 0;
  max-width: 36rem;
  font-size: clamp(1.75rem, 1.2rem + 2.2vw, 2.6rem);
  line-height: 1.12;
  font-weight: 750;
  letter-spacing: -0.03em;
}

.hero .lead {
  margin-top: var(--space-3);
}

@media (max-width: 479px) {
  .hero .actions .btn {
    flex: 1 1 100%;
  }
}

@media (min-width: 1440px) {
  .hero {
    grid-template-columns: minmax(0, 1fr) 20rem;
  }
}

.hero-steps {
  margin: var(--space-2) 0 var(--space-5);
  color: var(--ink-faint);
  font-size: 0.95rem;
}

.hero-art {
  display: none;
  width: 100%;
  color: var(--brand);
}

@media (min-width: 860px) {
  .hero-art {
    display: block;
  }
}

.node-core {
  fill: var(--brand);
}

.node-halo {
  fill: none;
  stroke: var(--brand);
  stroke-width: 1.5;
  opacity: 0.25;
}

.node-a {
  fill: var(--blue);
  opacity: 0.85;
}

.node-b {
  fill: var(--violet);
  opacity: 0.75;
}

.node-c {
  fill: var(--brand-line);
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
  margin: calc(var(--space-5) * -0.5) 0 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 768px) {
  .stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.stat {
  display: grid;
  gap: 0.15rem;
  padding: var(--space-4) var(--space-5);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 750;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  color: var(--ink-soft);
  font-size: 0.85rem;
}

.block {
  display: grid;
}

.steps {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  display: grid;
  gap: var(--space-2);
  align-content: start;
  padding: var(--space-5);
}

/* Tablet y celular: cada paso en una fila, ícono a la izquierda y texto a la derecha */
@media (max-width: 959px) {
  .step {
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: var(--space-4);
    row-gap: var(--space-1);
    padding: var(--space-4) var(--space-5);
  }

  .step .step-top {
    grid-row: 1 / span 2;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: var(--space-1);
    margin: 0;
  }
}

@media (min-width: 960px) {
  .steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.step-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.step-number {
  color: var(--ink-faint);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.step h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.step p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 0.95rem;
}

.shortcuts {
  display: grid;
  gap: var(--space-3);
}

@media (min-width: 960px) {
  .shortcuts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.link-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  color: var(--ink);
  text-decoration: none;
  transition:
    border-color var(--move) ease,
    box-shadow var(--move) ease,
    transform var(--move) ease;
}

.link-card:hover {
  color: var(--ink);
  border-color: var(--brand-line);
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.link-card-body {
  display: grid;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.link-card-title {
  font-weight: 650;
}

.link-card-text {
  color: var(--ink-soft);
  font-size: 0.875rem;
  line-height: 1.45;
}

.link-card-arrow {
  width: 1.1rem;
  height: 1.1rem;
  flex: none;
  color: var(--ink-faint);
  transition:
    transform var(--move) ease,
    color var(--move) ease;
}

.link-card:hover .link-card-arrow {
  color: var(--brand-text);
  transform: translateX(3px);
}

.status-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;
  color: var(--ink-faint);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--danger);
}

.status-dot[data-ok='true'] {
  background: var(--success);
  box-shadow: 0 0 0 3px var(--success-bg);
}

.status-sep {
  margin: 0 0.25rem;
}

.status-icon {
  width: 1rem;
  height: 1rem;
}
</style>
