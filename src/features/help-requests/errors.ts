import { HttpError } from '@/services/http'

export const sessionRequiredMessage = 'Inicia sesión para continuar.'

export function helpRequestErrorMessage(error: unknown): string {
  const status = error instanceof HttpError ? error.status : 0
  if (status === 401) return sessionRequiredMessage
  if (status === 403) return 'No puedes ver esta solicitud.'
  if (status === 404) return 'La solicitud no existe.'
  return 'No se pudo completar la acción.'
}
