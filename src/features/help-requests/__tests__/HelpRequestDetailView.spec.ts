import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import HelpRequestDetailView from '../HelpRequestDetailView.vue'
import type { HelpRequestDetail } from '../types'

const getHelpRequest = vi.fn<(id: string) => Promise<HelpRequestDetail>>()

vi.mock('../api', () => ({
  getHelpRequest: (id: string) => getHelpRequest(id),
}))

const pending: HelpRequestDetail = {
  id: 'request-1',
  text: 'No entiendo los joins de SQL',
  area: null,
  topics: [],
  level: null,
  status: 'PENDING',
  createdAt: '2026-11-04T00:00:00.000Z',
  matches: [],
}

const matched: HelpRequestDetail = {
  ...pending,
  status: 'MATCHED',
  area: 'bases-de-datos',
  topics: ['sql'],
  matches: [
    {
      id: 'match-1',
      score: 0.83,
      explanation: 'Ana encaja porque su perfil menciona joins.',
      status: 'PROPOSED',
      helper: {
        id: 'ana',
        name: 'Ana Gómez',
        bio: 'Sé SQL y joins.',
        tags: ['sql'],
      },
    },
  ],
}

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/help-requests', name: 'help-requests', component: { template: '<div />' } },
      {
        path: '/help-requests/:id',
        name: 'help-request-detail',
        component: HelpRequestDetailView,
      },
    ],
  })
  await router.push('/help-requests/request-1')
  await router.isReady()
  const wrapper = mount(HelpRequestDetailView, { global: { plugins: [router, createPinia()] } })
  await flushPromises()
  return wrapper
}

describe('HelpRequestDetailView', () => {
  beforeEach(() => {
    getHelpRequest.mockReset()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows candidates after a pending request is refreshed', async () => {
    getHelpRequest.mockResolvedValueOnce(pending).mockResolvedValueOnce(matched)
    const wrapper = await mountView()

    expect(wrapper.text()).toContain('Pendiente')
    expect(wrapper.text()).toContain('Buscando compañeros')

    await vi.advanceTimersByTimeAsync(5000)
    await flushPromises()

    expect(wrapper.text()).toContain('Ana Gómez')
    expect(wrapper.text()).toContain('Ana encaja porque su perfil menciona joins.')
    expect(getHelpRequest).toHaveBeenCalledTimes(2)
  })
})
