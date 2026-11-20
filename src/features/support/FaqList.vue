<script setup lang="ts">
const faqs = [
  {
    question: '¿Cómo publico una duda?',
    answer:
      'En el inicio, elige Nueva solicitud. El texto va de 10 a 1000 caracteres y se publica con Publicar. También puedes grabar una nota de voz.',
  },
  {
    question: '¿Dónde veo mis solicitudes?',
    answer:
      'En Mis solicitudes. Si aún no hay ninguna, la página dice «Todavía no tienes solicitudes.»',
  },
  {
    question: '¿Qué pasa después de publicar?',
    answer:
      'La solicitud muestra hasta 3 candidatos y la explicación de cada uno. Si nadie en la red sabe del tema, te sugiere preguntarle al asistente o radicar una PQRS.',
  },
  {
    question: '¿Qué significa «sin conexion» en el inicio?',
    answer: 'El inicio no pudo consultar el estado de la API.',
  },
  {
    question: '¿Cómo llego a esta página de ayuda?',
    answer: 'Desde el inicio, con ¿Necesitas ayuda? Hace falta tener la sesión iniciada.',
  },
]
</script>

<template>
  <section class="faq" aria-labelledby="faq-title">
    <h2 id="faq-title">Preguntas frecuentes</h2>
    <details v-for="item in faqs" :key="item.question">
      <summary>{{ item.question }}</summary>
      <p>{{ item.answer }}</p>
    </details>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  gap: var(--space-3);
}

.faq h2 {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.25;
  font-weight: 650;
}

.faq details {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
}

.faq summary {
  cursor: pointer;
  font-weight: 600;
}

.faq p {
  margin: var(--space-3) 0 0;
  color: var(--ink-soft);
}
</style>
