import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SuggestedQuestions from '../SuggestedQuestions.vue'
import { suggestedQuestions } from '../suggestions'

describe('SuggestedQuestions', () => {
  it('muestra las cinco preguntas sugeridas', () => {
    const wrapper = mount(SuggestedQuestions)

    expect(wrapper.findAll('button')).toHaveLength(5)

    for (const question of suggestedQuestions) {
      expect(wrapper.text()).toContain(question)
    }
  })

  it('emite select al pulsar una pregunta', async () => {
    const wrapper = mount(SuggestedQuestions)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('select')).toEqual([
      [suggestedQuestions[0]],
    ])
  })

  it('deshabilita los botones cuando disabled es true', () => {
    const wrapper = mount(SuggestedQuestions, {
      props: { disabled: true },
    })

    expect(wrapper.findAll('button').every(button => (button.element as HTMLButtonElement).disabled)).toBe(true)
  })
})
