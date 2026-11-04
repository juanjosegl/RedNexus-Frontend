import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('muestra el texto del slot', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Entrar' } })
    expect(wrapper.text()).toBe('Entrar')
  })

  it('es de tipo submit por defecto', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('se deshabilita mientras carga', () => {
    const wrapper = mount(BaseButton, { props: { loading: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
