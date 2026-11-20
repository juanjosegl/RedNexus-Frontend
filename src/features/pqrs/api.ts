import { http, HttpError } from '@/services/http'
import type { NewPqrs, Pqrs } from './types'

export function createPqrs(pqrs: NewPqrs) {
  return http<Pqrs>('/pqrs', { method: 'POST', body: JSON.stringify(pqrs) })
}

export function listMyPqrs() {
  return http<Pqrs[]>('/pqrs/mine')
}

export function pqrsErrorMessage(error: unknown): string {
  const status = error instanceof HttpError ? error.status : 0
  if (status === 401) return 'Inicia sesión para radicar una PQRS.'
  if (status === 400) return 'Revisa el asunto y la descripción.'
  return 'No se pudo completar la acción. Intenta de nuevo.'
}
