<script setup lang="ts">
// Isotipo de RedNexus (los tres nodos conectados) dibujado en línea para que se adapte al tema.
</script>

<template>
  <svg class="brand-logo" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="rn-tile" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#6366f1" />
        <stop offset="1" stop-color="#2563eb" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="9" fill="url(#rn-tile)" />
    <g stroke="#c7d2fe" stroke-width="1.6" stroke-linecap="round">
      <path d="M16 16.5V9" />
      <path d="M16 16.5 9.5 21" />
      <path d="M16 16.5 22.5 21" />
    </g>
    <circle cx="16" cy="16.5" r="3.6" fill="#ffffff" />
    <circle cx="16" cy="8.5" r="2.4" fill="#e0e7ff" />
    <circle cx="9" cy="21.5" r="2.4" fill="#bfdbfe" />
    <circle cx="23" cy="21.5" r="2.4" fill="#bfdbfe" />
  </svg>
</template>
