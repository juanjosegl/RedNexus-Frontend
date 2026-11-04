import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VoiceNoteRecorder from '../VoiceNoteRecorder.vue'

describe('VoiceNoteRecorder', () => {
  it('explains that this browser cannot record', async () => {
    vi.stubGlobal('MediaRecorder', undefined)
    const wrapper = mount(VoiceNoteRecorder)
    await wrapper.get('button').trigger('click')
    expect(wrapper.text()).toContain('Este navegador no puede grabar audio.')
  })
})
