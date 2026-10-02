import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'

describe('HomeView', () => {
  it('muestra el estado de la API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ status: 'ok' }) }),
    )
    const wrapper = mount(HomeView)
    await flushPromises()
    expect(wrapper.get('[data-testid="api-status"]').text()).toBe('ok')
  })
})
