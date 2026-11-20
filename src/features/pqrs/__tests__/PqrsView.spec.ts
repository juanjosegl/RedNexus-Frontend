import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { HttpError } from '@/services/http'
import PqrsView from '../PqrsView.vue'
import type { NewPqrs, Pqrs } from '../types'

const createPqrs = vi.fn<(pqrs: NewPqrs) => Promise<Pqrs>>()
const listMyPqrs = vi.fn<() => Promise<Pqrs[]>>()

vi.mock('../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api')>()),
  createPqrs: (pqrs: NewPqrs) => createPqrs(pqrs),
  listMyPqrs: () => listMyPqrs(),
}))

function pqrs(overrides: Partial<Pqrs> = {}): Pqrs {
  return {
    id: 'p1',
    radicado: 'PQRS-000001',
    type: 'QUEJA',
    subject: 'No llegan candidatos',
    description: 'Mi solicitud sigue en pendiente desde ayer.',
    status: 'RADICADA',
    response: null,
    respondedAt: null,
    createdAt: '2026-11-19T12:00:00Z',
    ...overrides,
  }
}

async function mountView() {
  const wrapper = mount(PqrsView, { global: { stubs: { RouterLink: RouterLinkStub } } })
  await flushPromises()
  return wrapper
}

describe('PqrsView', () => {
  beforeEach(() => {
    createPqrs.mockReset()
    listMyPqrs.mockReset().mockResolvedValue([])
  })

  it('muestra mis PQRS con su estado y la respuesta del equipo', async () => {
    listMyPqrs.mockResolvedValue([
      pqrs({ status: 'RESPONDIDA', response: 'Ya revisamos tu caso.' }),
    ])
    const wrapper = await mountView()

    expect(wrapper.text()).toContain('PQRS-000001')
    expect(wrapper.text()).toContain('Queja')
    expect(wrapper.text()).toContain('Respondida')
    expect(wrapper.text()).toContain('Ya revisamos tu caso.')
  })

  it('valida el asunto y la descripción antes de enviar', async () => {
    const wrapper = await mountView()

    await wrapper.get('#pqrs-subject').setValue('Hola')
    await wrapper.get('#pqrs-description').setValue('Muy corta')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('El asunto debe tener entre 5 y 120 caracteres.')
    expect(wrapper.text()).toContain('La descripción debe tener entre 20 y 2000 caracteres.')
    expect(createPqrs).not.toHaveBeenCalled()
  })

  it('radica la PQRS y muestra el número de radicado', async () => {
    createPqrs.mockResolvedValue(pqrs({ radicado: 'PQRS-000042', type: 'SUGERENCIA' }))
    const wrapper = await mountView()

    await wrapper.get('#pqrs-type').setValue('SUGERENCIA')
    await wrapper.get('#pqrs-subject').setValue('Modo oscuro')
    await wrapper.get('#pqrs-description').setValue('Sería útil poder cambiar el tema de la app.')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(createPqrs).toHaveBeenCalledWith({
      type: 'SUGERENCIA',
      subject: 'Modo oscuro',
      description: 'Sería útil poder cambiar el tema de la app.',
    })
    expect(wrapper.get('[role="status"]').text()).toContain('PQRS-000042')
    expect(wrapper.findAll('.pqrs-item')).toHaveLength(1)
  })

  it('muestra un aviso si falla el envío', async () => {
    createPqrs.mockRejectedValue(new HttpError('error', 500))
    const wrapper = await mountView()

    await wrapper.get('#pqrs-subject').setValue('Modo oscuro')
    await wrapper.get('#pqrs-description').setValue('Sería útil poder cambiar el tema de la app.')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('No se pudo completar')
  })
})
