import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSpinner from '../BaseSpinner.vue'

describe('BaseSpinner', () => {
  it('anuncia "Cargando" por defecto', () => {
    const wrapper = mount(BaseSpinner)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toBe('Cargando')
  })

  it('permite cambiar el texto accesible', () => {
    const wrapper = mount(BaseSpinner, { props: { label: 'Guardando' } })
    expect(wrapper.text()).toBe('Guardando')
  })
})
