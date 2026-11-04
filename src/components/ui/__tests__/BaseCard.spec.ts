import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCard from '../BaseCard.vue'

describe('BaseCard', () => {
  it('muestra el contenido del slot', () => {
    const wrapper = mount(BaseCard, { slots: { default: 'Contenido' } })
    expect(wrapper.text()).toBe('Contenido')
  })

  it('usa un div por defecto y permite cambiar la etiqueta', () => {
    expect(mount(BaseCard).element.tagName).toBe('DIV')
    expect(mount(BaseCard, { props: { as: 'section' } }).element.tagName).toBe('SECTION')
  })
})
