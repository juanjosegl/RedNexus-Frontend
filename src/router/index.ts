import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/features/home/HomeView.vue'
import { useSessionStore } from '@/stores/session'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/features/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/features/auth/RegisterView.vue'),
    },
    {
      path: '/perfil',
      name: 'profile',
      meta: { requiresAuth: true },
      component: () => import('@/features/profile/ProfileView.vue'),
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
  ],
})

router.beforeEach(async (to) => {
  const session = useSessionStore()

  if (session.token && !session.user) {
    await session.loadUser()
  }

  if (to.meta.requiresAuth && !session.isLoggedIn) {
    return { name: 'login' }
  }

  if ((to.name === 'login' || to.name === 'register') && session.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
