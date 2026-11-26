import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from '../HomeView.vue'

const blank = { template: '<div />' }

async function mountHome(fetchMock: ReturnType<typeof vi.fn>) {
  vi.stubGlobal('fetch', fetchMock)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/help-requests/new', name: 'help-request-new', component: blank },
      { path: '/help-requests', name: 'help-requests', component: blank },
      { path: '/ayuda', name: 'support', component: blank },
      { path: '/ayudar', component: blank },
      { path: '/perfil', component: blank },
      { path: '/pqrs', component: blank },
    ],
  })
  await router.push('/')
  await router.isReady()
  const wrapper = mount(HomeView, { global: { plugins: [router, createPinia()] } })
  await flushPromises()
  return wrapper
}

describe('HomeView', () => {
  it('muestra el estado de la API', async () => {
    const wrapper = await mountHome(
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ status: 'ok' }) }),
    )
    expect(wrapper.get('[data-testid="api-status"]').text()).toBe('ok')
    expect(wrapper.text()).toContain('Nueva solicitud')
    expect(wrapper.get('a[href="/ayuda"]').text()).toBe('¿Necesitas ayuda?')
    // sin estadísticas válidas la sección de cifras no aparece
    expect(wrapper.find('.stats').exists()).toBe(false)
  })

  it('muestra las cifras públicas de la red (BE-23)', async () => {
    const stats = { users: 51, helpRequests: 13, matchedPercent: 100, averageRating: 4.5 }
    const wrapper = await mountHome(
      vi.fn((url: string) =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(url.endsWith('/stats') ? stats : { status: 'ok' }),
        }),
      ),
    )
    expect(wrapper.text()).toContain('Estudiantes en la red')
    expect(wrapper.text()).toContain('51')
    expect(wrapper.text()).toContain('100 %')
    expect(wrapper.text()).toContain('4,5 ★')
  })
})
