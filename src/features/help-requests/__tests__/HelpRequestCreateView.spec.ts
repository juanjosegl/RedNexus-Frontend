import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import HelpRequestCreateView from '../HelpRequestCreateView.vue'
import type { CreatedHelpRequest } from '../types'

const createHelpRequest = vi.fn<(text: string) => Promise<CreatedHelpRequest>>()

vi.mock('../api', () => ({
  createHelpRequest: (text: string) => createHelpRequest(text),
}))

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/help-requests/new', name: 'help-request-new', component: HelpRequestCreateView },
      { path: '/help-requests', name: 'help-requests', component: { template: '<div />' } },
      {
        path: '/help-requests/:id',
        name: 'help-request-detail',
        component: { template: '<div>detalle</div>' },
      },
    ],
  })
  await router.push('/help-requests/new')
  await router.isReady()
  const wrapper = mount(HelpRequestCreateView, { global: { plugins: [router] } })
  return { wrapper, router }
}

describe('HelpRequestCreateView', () => {
  beforeEach(() => {
    createHelpRequest.mockReset()
  })

  it('asks for a longer doubt and does not call the api', async () => {
    const { wrapper } = await mountView()
    await wrapper.get('textarea').setValue('corta')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('La duda debe tener entre 10 y 1000 caracteres.')
    expect(createHelpRequest).not.toHaveBeenCalled()
  })

  it('publishes the doubt and opens its detail', async () => {
    createHelpRequest.mockResolvedValue({ id: 'request-1', status: 'PENDING' })
    const { wrapper, router } = await mountView()

    await wrapper.get('textarea').setValue('No entiendo los joins de SQL')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(createHelpRequest).toHaveBeenCalledWith('No entiendo los joins de SQL')
    expect(router.currentRoute.value.name).toBe('help-request-detail')
    expect(router.currentRoute.value.params.id).toBe('request-1')
  })
})
