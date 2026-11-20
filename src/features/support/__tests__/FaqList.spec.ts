import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FaqList from '../FaqList.vue'

const questions = [
  '¿Cómo publico una duda?',
  '¿Dónde veo mis solicitudes?',
  '¿Qué pasa después de publicar?',
  '¿Qué significa «sin conexion» en el inicio?',
  '¿Cómo llego a esta página de ayuda?',
]

describe('FaqList', () => {
  it('muestra las 5 preguntas', () => {
    const wrapper = mount(FaqList)
    const summaries = wrapper.findAll('summary')

    expect(summaries).toHaveLength(5)
    for (const question of questions) {
      expect(wrapper.text()).toContain(question)
    }
  })
})
