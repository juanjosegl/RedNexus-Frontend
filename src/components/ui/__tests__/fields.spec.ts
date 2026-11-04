import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiButton from '../UiButton.vue'
import UiInput from '../UiInput.vue'
import UiSelect from '../UiSelect.vue'
import UiTextarea from '../UiTextarea.vue'

describe('UiInput', () => {
  it('emits the typed value and shows the error', async () => {
    const wrapper = mount(UiInput, {
      props: {
        id: 'query',
        label: 'Buscar',
        modelValue: '',
        error: 'Escribe algo para buscar',
      },
    })

    await wrapper.get('input').setValue('joins')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['joins'])
    expect(wrapper.get('#query').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#query-error').text()).toBe('Escribe algo para buscar')
  })
})

describe('UiTextarea', () => {
  it('emits the typed value', async () => {
    const wrapper = mount(UiTextarea, {
      props: {
        id: 'request',
        label: 'Tu duda',
        modelValue: '',
      },
    })

    await wrapper.get('textarea').setValue('No entiendo los joins de SQL')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['No entiendo los joins de SQL'])
  })
})

describe('UiSelect', () => {
  it('renders options and emits the selected value', async () => {
    const wrapper = mount(UiSelect, {
      props: {
        id: 'status',
        label: 'Estado',
        modelValue: '',
        options: [
          { value: '', label: 'Todas' },
          { value: 'PENDING', label: 'Pendiente' },
        ],
      },
    })

    const labels = wrapper.findAll('option').map((option) => option.text())
    expect(labels).toEqual(['Todas', 'Pendiente'])

    await wrapper.get('select').setValue('PENDING')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['PENDING'])
  })
})

describe('UiButton', () => {
  it('uses the given type and can be disabled', () => {
    const wrapper = mount(UiButton, {
      props: { type: 'submit', disabled: true },
      slots: { default: 'Publicar' },
    })

    const button = wrapper.get('button')
    expect(button.text()).toBe('Publicar')
    expect(button.attributes('type')).toBe('submit')
    expect(button.attributes('disabled')).toBeDefined()
  })
})
