import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatMessage from '../ChatMessage.vue'

describe('ChatMessage', () => {
  it('muestra "Tú" para el usuario y no muestra fuentes', () => {
    const wrapper = mount(ChatMessage, { props: { role: 'user', content: 'Hola' } })

    expect(wrapper.text()).toContain('Tú')
    expect(wrapper.text()).toContain('Hola')
    expect(wrapper.text()).not.toContain('Fuentes')
  })

  it('muestra "Asistente" y las fuentes para el asistente', () => {
    const wrapper = mount(ChatMessage, {
      props: {
        role: 'assistant',
        content: 'Califica de 1 a 5.',
        sources: ['calificaciones.md', 'normas.md'],
      },
    })

    expect(wrapper.text()).toContain('Asistente')
    expect(wrapper.text()).toContain('Fuentes: calificaciones.md, normas.md')
  })
})
