import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StarRating from '../StarRating.vue'

describe('StarRating', () => {
  it('emits the chosen number of stars', async () => {
    const wrapper = mount(StarRating, { props: { modelValue: 0 } })
    await wrapper.get('[aria-label="3 estrellas"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })

  it('moves with the arrow keys', async () => {
    const wrapper = mount(StarRating, { props: { modelValue: 2 } })
    await wrapper.get('[role="radiogroup"]').trigger('keydown', { key: 'ArrowRight' })
    await wrapper.get('[role="radiogroup"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[3], [1]])
  })

  it('only shows the value when it is read only', async () => {
    const wrapper = mount(StarRating, { props: { modelValue: 4, readonly: true } })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('Calificación: 4 de 5')
    expect(wrapper.findAll('[data-on="true"]')).toHaveLength(4)
  })
})
