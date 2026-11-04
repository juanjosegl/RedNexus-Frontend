import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import HelpRequestListView from '../HelpRequestListView.vue'
import type { HelpRequestSummary } from '../types'

const listMyHelpRequests = vi.fn<() => Promise<HelpRequestSummary[]>>()

vi.mock('../api', () => ({
  listMyHelpRequests: () => listMyHelpRequests(),
}))

const requests: HelpRequestSummary[] = [
  {
    id: 'pending-1',
    text: 'No entiendo los joins de SQL',
    area: null,
    topics: [],
    level: null,
    status: 'PENDING',
    createdAt: '2026-11-04T00:00:00.000Z',
  },
  {
    id: 'matched-1',
    text: 'Cómo normalizar una tabla',
    area: 'bases-de-datos',
    topics: ['modelado'],
    level: 'básico',
    status: 'MATCHED',
    createdAt: '2026-11-03T00:00:00.000Z',
  },
]

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/help-requests', name: 'help-requests', component: HelpRequestListView },
      { path: '/help-requests/new', name: 'help-request-new', component: { template: '<div />' } },
      {
        path: '/help-requests/:id',
        name: 'help-request-detail',
        component: { template: '<div />' },
      },
    ],
  })
  await router.push('/help-requests')
  await router.isReady()
  const wrapper = mount(HelpRequestListView, { global: { plugins: [router, createPinia()] } })
  await flushPromises()
  return wrapper
}

describe('HelpRequestListView', () => {
  beforeEach(() => {
    listMyHelpRequests.mockReset()
    listMyHelpRequests.mockResolvedValue(requests)
  })

  it('lists my requests with their status', async () => {
    const wrapper = await mountView()

    expect(wrapper.text()).toContain('No entiendo los joins de SQL')
    expect(wrapper.text()).toContain('Pendiente')
    expect(wrapper.text()).toContain('Cómo normalizar una tabla')
    expect(wrapper.text()).toContain('Con candidatos')
  })

  it('filters by text and status', async () => {
    const wrapper = await mountView()

    await wrapper.get('#help-request-query').setValue('joins')
    expect(wrapper.text()).toContain('No entiendo los joins de SQL')
    expect(wrapper.text()).not.toContain('Cómo normalizar una tabla')

    await wrapper.get('#help-request-query').setValue('')
    const matched = wrapper
      .findAll('[role="radio"]')
      .find((chip) => chip.text() === 'Con candidatos')
    await matched?.trigger('click')
    expect(wrapper.text()).toContain('Cómo normalizar una tabla')
    expect(wrapper.text()).not.toContain('No entiendo los joins de SQL')
  })
})
