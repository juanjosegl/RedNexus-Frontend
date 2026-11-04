import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ProfileView from '../ProfileView.vue'
import * as api from '../api'

vi.mock('../api')

const profile: api.Profile = {
  id: '1',
  email: 'ana.demo@rednexus.dev',
  name: 'Ana Demo',
  bio: null,
  tags: ['sql'],
  rating: null,
}

describe('ProfileView', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('muestra el perfil y "Sin calificaciones" cuando no hay promedio', async () => {
    vi.mocked(api.getMyProfile).mockResolvedValue(profile)
    const wrapper = mount(ProfileView)
    await flushPromises()

    expect(wrapper.text()).toContain('Ana Demo')
    expect(wrapper.text()).toContain('Sin calificaciones')
    expect(wrapper.text()).toContain('sql')
  })

  it('muestra el error si no se puede cargar el perfil', async () => {
    vi.mocked(api.getMyProfile).mockRejectedValue(new Error('401'))
    const wrapper = mount(ProfileView)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('No se pudo cargar el perfil')
  })

  it('abre el formulario al pulsar "Editar perfil"', async () => {
    vi.mocked(api.getMyProfile).mockResolvedValue(profile)
    const wrapper = mount(ProfileView)
    await flushPromises()

    const editar = wrapper.findAll('button').find((b) => b.text() === 'Editar perfil')
    await editar?.trigger('click')

    expect(wrapper.find('form').exists()).toBe(true)
  })
})
