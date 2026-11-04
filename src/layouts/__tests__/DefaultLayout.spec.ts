import { describe, it, expect } from 'vitest'
import { RouterLinkStub, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import DefaultLayout from '../DefaultLayout.vue'
import { useSessionStore } from '@/stores/session'

// Monta el layout con un store limpio por prueba y sin router real
function mountLayout() {
  const pinia = createPinia()
  const wrapper = mount(DefaultLayout, {
    global: { plugins: [pinia], stubs: { RouterLink: RouterLinkStub } },
    slots: { default: 'Contenido' },
  })
  return { wrapper, session: useSessionStore(pinia) }
}

describe('DefaultLayout', () => {
  it('muestra "Iniciar sesión" cuando no hay sesión', () => {
    const { wrapper } = mountLayout()
    expect(wrapper.text()).toContain('Iniciar sesión')
    expect(wrapper.text()).not.toContain('Cerrar sesión')
  })

  it('muestra "Cerrar sesión" cuando hay sesión y la cierra al hacer clic', async () => {
    const { wrapper, session } = mountLayout()
    session.token = 'token-de-prueba'
    await wrapper.vm.$nextTick()

    await wrapper.get('button').trigger('click')

    expect(session.isLoggedIn).toBe(false)
    expect(wrapper.text()).toContain('Iniciar sesión')
  })

  it('renderiza el contenido de la página', () => {
    const { wrapper } = mountLayout()
    expect(wrapper.text()).toContain('Contenido')
  })
})
