import { http, HttpError } from '@/services/http'
import type { ChatTurn, SupportReply } from './types'

// El backend acepta como máximo 10 turnos de historial
export const MAX_HISTORY = 10

export function askSupport(message: string, history: ChatTurn[] = []) {
  return http<SupportReply>('/support/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history: history.slice(-MAX_HISTORY) }),
  })
}

export function supportErrorMessage(error: unknown): string {
  const status = error instanceof HttpError ? error.status : 0
  if (status === 401) return 'Inicia sesión para hablar con el asistente.'
  if (status === 400) return 'Escribe una pregunta de entre 2 y 1000 caracteres.'
  if (status === 503) return 'El asistente no está disponible en este momento. Intenta más tarde.'
  return 'No se pudo enviar tu pregunta.'
}
