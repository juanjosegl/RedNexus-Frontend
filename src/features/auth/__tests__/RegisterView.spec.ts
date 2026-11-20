import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import RegisterView from '../RegisterView.vue'

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/register', component: RegisterView },
      { path: '/', component: { template: '<div />' } },
      { path: '/login', component: { template: '<div />' } },
    ],
  })
  await router.push('/register')
  await router.isReady()
  const wrapper = mount(RegisterView, { global: { plugins: [router] } })
  return { wrapper, router }
}

async function fill(wrapper: Awaited<ReturnType<typeof mountView>>['wrapper']) {
  await wrapper.get('#register-name').setValue('Nueva Estudiante')
  await wrapper.get('#register-email').setValue('nueva.demo@rednexus.dev')
  await wrapper.get('#register-password').setValue('demo12345')
}

describe('RegisterView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('does not register without the data processing authorization', async () => {
    const session = useSessionStore()
    const register = vi.spyOn(session, 'register').mockResolvedValue()
    const { wrapper } = await mountView()
    await fill(wrapper)
    await wrapper.get('form').trigger('submit')

    expect(register).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Debes autorizar el tratamiento')
  })

  it('sends the authorization with the new account', async () => {
    const session = useSessionStore()
    const register = vi.spyOn(session, 'register').mockResolvedValue()
    const { wrapper, router } = await mountView()
    await fill(wrapper)
    await wrapper.get('#register-consent').setValue(true)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'nueva.demo@rednexus.dev', acceptsDataPolicy: true }),
    )
    expect(router.currentRoute.value.path).toBe('/')
  })
})
