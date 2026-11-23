import { describe, it, expect } from 'vitest'
import { RouterLinkStub, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import DefaultLayout from '../DefaultLayout.vue'
import { useSessionStore } from '@/stores/session'

function mountLayout() {
  const pinia = createPinia()

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/login', component: { template: '<div />' } },
      { path: '/register', component: { template: '<div />' } },
    ],
  })

  const wrapper = mount(DefaultLayout, {
    global: {
      plugins: [pinia, router],
      stubs: { RouterLink: RouterLinkStub },
    },
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
  it('muestra "Ayuda" cuando hay sesión iniciada', async () => {
    const { wrapper, session } = mountLayout()
    session.token = 'token-de-prueba'
    await wrapper.vm.$nextTick()

    const ayudaLink = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.text() === 'Ayuda')

    expect(ayudaLink).toBeDefined()
    expect(ayudaLink?.props('to')).toBe('/ayuda')
  })

  it('no muestra "Ayuda" cuando no hay sesión', () => {
    const { wrapper } = mountLayout()

    expect(wrapper.text()).not.toContain('Ayuda')
  })
})

describe('DefaultLayout en celular (FE-16)', () => {
  it('marca el menú con sesión para acomodarlo en dos filas', async () => {
    const { wrapper, session } = mountLayout()
    expect(wrapper.get('nav').classes()).not.toContain('has-session')

    session.token = 'token-de-prueba'
    await wrapper.vm.$nextTick()

    expect(wrapper.get('nav').classes()).toContain('has-session')
  })

  it('deja el nombre completo en el title del enlace al perfil', async () => {
    const { wrapper, session } = mountLayout()
    session.token = 'token-de-prueba'
    session.user = { id: 'u1', name: 'María Alejandra Guzmán Pérez' } as typeof session.user
    await wrapper.vm.$nextTick()

    const perfil = wrapper.get('.nav-user')
    expect(perfil.attributes('title')).toBe('María Alejandra Guzmán Pérez')
  })
})
