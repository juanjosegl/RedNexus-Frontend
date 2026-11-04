<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useSessionStore } from '@/stores/session'

const session = useSessionStore()

onMounted(() => {
  session.loadUser()
})
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>
