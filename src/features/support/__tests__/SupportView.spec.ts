import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { HttpError } from '@/services/http'
import SupportView from '../SupportView.vue'
import type { ChatTurn, SupportReply } from '../types'

const askSupport = vi.fn<(message: string, history: ChatTurn[]) => Promise<SupportReply>>()

vi.mock('../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api')>()),
  askSupport: (message: string, history: ChatTurn[]) => askSupport(message, history),
}))

function mountView() {
  return mount(SupportView, { global: { stubs: { RouterLink: RouterLinkStub } } })
}

function reply(answer: string, sources: string[] = []): SupportReply {
  return { answer, sources, provider: 'mock', latencyMs: 10 }
}

describe('SupportView', () => {
  beforeEach(() => {
    askSupport.mockReset()
  })

  it('envía la pregunta y muestra la respuesta con sus fuentes', async () => {
    askSupport.mockResolvedValue(reply('Califica de 1 a 5.', ['calificaciones.md']))
    const wrapper = mountView()

    await wrapper.get('textarea').setValue('¿Cómo califico?')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(askSupport).toHaveBeenCalledWith('¿Cómo califico?', [])
    expect(wrapper.text()).toContain('¿Cómo califico?')
    expect(wrapper.text()).toContain('Califica de 1 a 5.')
    expect(wrapper.text()).toContain('calificaciones.md')
  })

  it('manda el historial en la segunda pregunta', async () => {
    askSupport.mockResolvedValueOnce(reply('Primera')).mockResolvedValueOnce(reply('Segunda'))
    const wrapper = mountView()

    await wrapper.get('textarea').setValue('Hola')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    await wrapper.get('textarea').setValue('¿Y después?')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(askSupport).toHaveBeenLastCalledWith('¿Y después?', [
      { role: 'user', content: 'Hola' },
      { role: 'assistant', content: 'Primera' },
    ])
  })

  it('muestra un aviso si el asistente no está disponible', async () => {
    askSupport.mockRejectedValue(new HttpError('no disponible', 503))
    const wrapper = mountView()

    await wrapper.get('textarea').setValue('Hola')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('no está disponible')
  })

  it('no envía preguntas vacías', async () => {
    const wrapper = mountView()

    await wrapper.get('textarea').setValue('   ')
    await wrapper.get('form').trigger('submit')

    expect(askSupport).not.toHaveBeenCalled()
  })
})
