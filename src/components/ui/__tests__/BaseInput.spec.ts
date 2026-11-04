import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../BaseInput.vue'

const props = { id: 'email', label: 'Correo', modelValue: '' }

describe('BaseInput', () => {
  it('enlaza la etiqueta con el campo', () => {
    const wrapper = mount(BaseInput, { props })
    expect(wrapper.get('label').attributes('for')).toBe('email')
    expect(wrapper.get('input').attributes('id')).toBe('email')
  })

  it('emite el valor al escribir', async () => {
    const wrapper = mount(BaseInput, { props })
    await wrapper.get('input').setValue('ana@rednexus.dev')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ana@rednexus.dev'])
  })

  it('muestra el error y marca el campo como invalido', () => {
    const wrapper = mount(BaseInput, { props: { ...props, error: 'Campo invalido' } })
    expect(wrapper.get('[role="alert"]').text()).toBe('Campo invalido')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('pasa los atributos nativos al input y no al contenedor', () => {
    const wrapper = mount(BaseInput, { props, attrs: { autocomplete: 'email' } })
    expect(wrapper.get('input').attributes('autocomplete')).toBe('email')
    expect(wrapper.attributes('autocomplete')).toBeUndefined()
  })
})
