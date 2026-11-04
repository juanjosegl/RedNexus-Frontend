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
      component: () => import('@/features/profile/ProfileView.vue'),
    },
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
