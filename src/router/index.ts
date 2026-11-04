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
    {
      path: '/help-requests',
      name: 'help-requests',
      meta: { requiresAuth: true },
      component: () => import('@/features/help-requests/HelpRequestListView.vue'),
    },
    {
      path: '/help-requests/new',
      name: 'help-request-new',
      meta: { requiresAuth: true },
      component: () => import('@/features/help-requests/HelpRequestCreateView.vue'),
    },
    {
      path: '/help-requests/:id',
      name: 'help-request-detail',
      meta: { requiresAuth: true },
      component: () => import('@/features/help-requests/HelpRequestDetailView.vue'),
    },
    { path: '/solicitudes/nueva', redirect: '/help-requests/new' },
    { path: '/solicitudes/:id', redirect: (to) => `/help-requests/${String(to.params.id)}` },
    { path: '/solicitudes', redirect: '/help-requests' },
    // Cada feature agrega sus rutas aqui con carga diferida, por ejemplo:
    // { path: '/login', name: 'login', component: () => import('@/features/auth/LoginView.vue') },
  ],
})

export default router
