import { useSessionStore } from '@/stores/session'

const demoEmail = 'ana.demo@rednexus.dev'
const demoPassword = 'demo12345'

export const devLoginAvailable = import.meta.env.DEV

export async function loginWithDevAccount() {
  await useSessionStore().login({ email: demoEmail, password: demoPassword })
}
