import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from '../HomeView.vue'

describe('HomeView', () => {
  it('muestra el estado de la API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ status: 'ok' }) }),
    )
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/help-requests/new', name: 'help-request-new', component: { template: '<div />' } },
        { path: '/help-requests', name: 'help-requests', component: { template: '<div />' } },
      ],
    })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.get('[data-testid="api-status"]').text()).toBe('ok')
    expect(wrapper.text()).toContain('Nueva solicitud')
  })
})
