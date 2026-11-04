import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseAlert from '../BaseAlert.vue'

describe('BaseAlert', () => {
  it('muestra el mensaje con rol de alerta', () => {
    const wrapper = mount(BaseAlert, { props: { message: 'Algo salio mal' } })
    const alerta = wrapper.get('[role="alert"]')
    expect(alerta.text()).toBe('Algo salio mal')
  })
})
