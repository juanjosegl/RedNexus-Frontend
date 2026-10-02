import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/features/home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // Cada feature agrega sus rutas aqui con carga diferida, por ejemplo:
    // { path: '/login', name: 'login', component: () => import('@/features/auth/LoginView.vue') },
  ],
})

export default router
