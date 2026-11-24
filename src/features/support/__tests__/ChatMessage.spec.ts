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

  it('muestra el Markdown del asistente como lista y negrita, sin interpretar HTML', () => {
    const wrapper = mount(ChatMessage, {
      props: {
        role: 'assistant',
        content: 'Pasos:\n1. Entra a **Solicitudes**.\n2. Pulsa <b>Calificar</b>.',
      },
    })

    expect(wrapper.findAll('ol li')).toHaveLength(2)
    expect(wrapper.find('strong').text()).toBe('Solicitudes')
    expect(wrapper.text()).not.toContain('**')
    expect(wrapper.find('b').exists()).toBe(false)
    expect(wrapper.text()).toContain('<b>Calificar</b>')
  })

  it('no aplica formato a los mensajes del usuario', () => {
    const wrapper = mount(ChatMessage, {
      props: { role: 'user', content: 'Uso **dos asteriscos**' },
    })

    expect(wrapper.find('strong').exists()).toBe(false)
    expect(wrapper.text()).toContain('**dos asteriscos**')
  })
})
