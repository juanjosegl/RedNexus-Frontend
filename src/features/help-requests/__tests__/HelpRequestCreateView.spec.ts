import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import HelpRequestCreateView from '../HelpRequestCreateView.vue'
import type { CreatedHelpRequest } from '../types'

const createHelpRequest = vi.fn<(text: string) => Promise<CreatedHelpRequest>>()
const createHelpRequestFromVoice = vi.fn<(audio: Blob) => Promise<CreatedHelpRequest>>()

vi.mock('../api', () => ({
  createHelpRequest: (text: string) => createHelpRequest(text),
  createHelpRequestFromVoice: (audio: Blob) => createHelpRequestFromVoice(audio),
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
    createHelpRequestFromVoice.mockReset()
  })

  it('asks for a longer doubt and does not call the api', async () => {
    const { wrapper } = await mountView()
    await wrapper.get('textarea').setValue('corta')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain(
      'Escribe la duda (entre 10 y 1000 caracteres) o graba una nota de voz.',
    )
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
  it('publishes the voice note when there is no text', async () => {
    createHelpRequestFromVoice.mockResolvedValue({ id: 'voice-1', status: 'PENDING' })
    const { wrapper, router } = await mountView()
    const note = new Blob(['audio'], { type: 'audio/webm' })

    wrapper.findComponent({ name: 'VoiceNoteRecorder' }).vm.$emit('recorded', note)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(createHelpRequestFromVoice).toHaveBeenCalledWith(note)
    expect(createHelpRequest).not.toHaveBeenCalled()
    expect(router.currentRoute.value.params.id).toBe('voice-1')
  })

  it('prefers the written doubt over the voice note', async () => {
    createHelpRequest.mockResolvedValue({ id: 'request-2', status: 'PENDING' })
    const { wrapper } = await mountView()

    wrapper
      .findComponent({ name: 'VoiceNoteRecorder' })
      .vm.$emit('recorded', new Blob(['a'], { type: 'audio/webm' }))
    await wrapper.get('textarea').setValue('No entiendo la recursión en Python')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(createHelpRequest).toHaveBeenCalledWith('No entiendo la recursión en Python')
    expect(createHelpRequestFromVoice).not.toHaveBeenCalled()
  })
})
