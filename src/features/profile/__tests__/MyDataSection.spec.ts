import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import MyDataSection from '../MyDataSection.vue'

const deleteMyAccount = vi.fn<() => Promise<void>>()
const exportMyData = vi.fn<() => Promise<Record<string, unknown>>>()

vi.mock('../api', () => ({
  deleteMyAccount: () => deleteMyAccount(),
  exportMyData: () => exportMyData(),
}))

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/perfil', component: MyDataSection },
      { path: '/login', component: { template: '<div />' } },
    ],
  })
  await router.push('/perfil')
  await router.isReady()
  const wrapper = mount(MyDataSection, { global: { plugins: [router] } })
  return { wrapper, router }
}

function button(wrapper: Awaited<ReturnType<typeof mountView>>['wrapper'], text: string) {
  return wrapper.findAll('button').find((b) => b.text() === text)!
}

describe('MyDataSection', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    deleteMyAccount.mockReset()
    exportMyData.mockReset()
  })

  it('downloads my data as a json file', async () => {
    exportMyData.mockResolvedValue({ profile: { email: 'ana.demo@rednexus.dev' } })
    URL.createObjectURL = vi.fn<(obj: Blob) => string>(() => 'blob:datos')
    URL.revokeObjectURL = vi.fn<(url: string) => void>()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const { wrapper } = await mountView()

    await button(wrapper, 'Descargar mis datos').trigger('click')
    await flushPromises()

    expect(exportMyData).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
  })

  it('only deletes the account after typing ELIMINAR and then logs out', async () => {
    deleteMyAccount.mockResolvedValue()
    const session = useSessionStore()
    const logout = vi.spyOn(session, 'logout')
    const { wrapper, router } = await mountView()

    await button(wrapper, 'Eliminar mi cuenta').trigger('click')
    const confirm = button(wrapper, 'Eliminar definitivamente')
    expect(confirm.attributes('disabled')).toBeDefined()

    await wrapper.get('#delete-confirm').setValue('eliminar')
    await button(wrapper, 'Eliminar definitivamente').trigger('click')
    await flushPromises()

    expect(deleteMyAccount).toHaveBeenCalled()
    expect(logout).toHaveBeenCalled()
    expect(router.currentRoute.value.path).toBe('/login')
  })
})
