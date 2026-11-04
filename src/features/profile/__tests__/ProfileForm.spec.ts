import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ProfileForm from '../ProfileForm.vue'
import * as api from '../api'

// Se simula el modulo api para que las pruebas no dependan del backend
vi.mock('../api')

const profile: api.Profile = {
  id: '1',
  email: 'ana.demo@rednexus.dev',
  name: 'Ana Demo',
  bio: 'Me gustan las bases de datos.',
  tags: ['sql', 'python'],
  rating: 4.5,
}

describe('ProfileForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('muestra los datos actuales del perfil', () => {
    const wrapper = mount(ProfileForm, { props: { profile } })
    expect(wrapper.get<HTMLInputElement>('#profile-name').element.value).toBe('Ana Demo')
    expect(wrapper.get<HTMLTextAreaElement>('#profile-bio').element.value).toBe(
      'Me gustan las bases de datos.',
    )
    expect(wrapper.get<HTMLInputElement>('#profile-tags').element.value).toBe('sql, python')
  })

  it('envia los cambios limpios y emite el perfil guardado', async () => {
    const updated = { ...profile, name: 'Ana', bio: 'Nueva bio', tags: ['sql', 'vue'] }
    vi.mocked(api.updateMyProfile).mockResolvedValue(updated)
    const wrapper = mount(ProfileForm, { props: { profile } })

    await wrapper.get('#profile-name').setValue('  Ana  ')
    await wrapper.get('#profile-bio').setValue('  Nueva bio  ')
    // Espacios, vacias y repetidas deben limpiarse
    await wrapper.get('#profile-tags').setValue(' sql, vue, sql ,, ')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(api.updateMyProfile).toHaveBeenCalledWith({
      name: 'Ana',
      bio: 'Nueva bio',
      tags: ['sql', 'vue'],
    })
    expect(wrapper.emitted('saved')?.[0]).toEqual([updated])
  })

  it('muestra el error y no emite "saved" si falla el guardado', async () => {
    vi.mocked(api.updateMyProfile).mockRejectedValue(new Error('fallo'))
    const wrapper = mount(ProfileForm, { props: { profile } })

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('No se pudieron guardar los cambios')
    expect(wrapper.emitted('saved')).toBeUndefined()
    // El boton debe reactivarse para poder reintentar
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('emite "cancel" al pulsar Cancelar', async () => {
    const wrapper = mount(ProfileForm, { props: { profile } })
    const cancelar = wrapper.findAll('button').find((b) => b.text() === 'Cancelar')
    await cancelar?.trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
