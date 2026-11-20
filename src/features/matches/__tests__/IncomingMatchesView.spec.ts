import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { HttpError } from '@/services/http'
import IncomingMatchesView from '../IncomingMatchesView.vue'
import type { IncomingMatch } from '../types'

const listIncomingMatches = vi.fn<() => Promise<IncomingMatch[]>>()
const acceptMatch = vi.fn<(id: string) => Promise<{ authorEmail: string }>>()
const rejectMatch = vi.fn<(id: string) => Promise<{ id: string; status: 'REJECTED' }>>()

vi.mock('../api', () => ({
  listIncomingMatches: () => listIncomingMatches(),
  acceptMatch: (id: string) => acceptMatch(id),
  rejectMatch: (id: string) => rejectMatch(id),
}))

function incoming(id: string, overrides: Partial<IncomingMatch> = {}): IncomingMatch {
  return {
    id,
    score: 0.81,
    explanation: 'Tu perfil menciona joins y SQL.',
    status: 'PROPOSED',
    createdAt: '2026-11-18T00:00:00.000Z',
    request: {
      id: `request-${id}`,
      text: 'No entiendo los joins de SQL',
      area: 'bases-de-datos',
      topics: ['joins'],
      level: 'basico',
      status: 'MATCHED',
      createdAt: '2026-11-18T00:00:00.000Z',
      author: { name: 'Laura Ordóñez' },
    },
    ...overrides,
  }
}

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/ayudar', name: 'incoming-matches', component: IncomingMatchesView },
      { path: '/perfil', name: 'profile', component: { template: '<div />' } },
    ],
  })
  await router.push('/ayudar')
  await router.isReady()
  const wrapper = mount(IncomingMatchesView, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

function button(wrapper: Awaited<ReturnType<typeof mountView>>, text: string) {
  return wrapper.findAll('button').find((b) => b.text() === text)!
}

describe('IncomingMatchesView', () => {
  beforeEach(() => {
    listIncomingMatches.mockReset()
    acceptMatch.mockReset()
    rejectMatch.mockReset()
  })

  it('invites to complete the profile when there is nothing yet', async () => {
    listIncomingMatches.mockResolvedValue([])
    const wrapper = await mountView()
    expect(wrapper.text()).toContain('Completa tu perfil')
  })

  it('accepts after confirming and shows the author contact', async () => {
    listIncomingMatches.mockResolvedValue([incoming('m1')])
    acceptMatch.mockResolvedValue({ authorEmail: 'laura.demo@rednexus.dev' })
    const wrapper = await mountView()

    expect(wrapper.findAll('[data-testid="pending-match"]')).toHaveLength(1)
    await button(wrapper, 'Puedo ayudar').trigger('click')
    expect(acceptMatch).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('¿Confirmas que puedes ayudar?')

    await button(wrapper, 'Confirmar').trigger('click')
    await flushPromises()

    expect(acceptMatch).toHaveBeenCalledWith('m1')
    expect(wrapper.findAll('[data-testid="pending-match"]')).toHaveLength(0)
    expect(wrapper.text()).toContain('laura.demo@rednexus.dev')
  })

  it('rejects after confirming', async () => {
    listIncomingMatches.mockResolvedValue([incoming('m1')])
    rejectMatch.mockResolvedValue({ id: 'm1', status: 'REJECTED' })
    const wrapper = await mountView()

    await button(wrapper, 'No puedo').trigger('click')
    await button(wrapper, 'Confirmar').trigger('click')
    await flushPromises()

    expect(rejectMatch).toHaveBeenCalledWith('m1')
    expect(wrapper.text()).toContain('No pudiste ayudar')
  })

  it('explains when another helper accepted first', async () => {
    listIncomingMatches.mockResolvedValueOnce([incoming('m1')]).mockResolvedValueOnce([
      incoming('m1', {
        request: { ...incoming('m1').request, status: 'ACCEPTED' },
      }),
    ])
    acceptMatch.mockRejectedValue(new HttpError('La solicitud ya fue aceptada o cerrada', 409))
    const wrapper = await mountView()

    await button(wrapper, 'Puedo ayudar').trigger('click')
    await button(wrapper, 'Confirmar').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('La solicitud ya fue aceptada o cerrada')
    expect(wrapper.text()).toContain('Otro compañero aceptó primero')
  })
})
