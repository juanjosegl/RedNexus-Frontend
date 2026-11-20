import { HttpError } from '@/services/http'
import { sessionRequiredMessage } from '@/features/help-requests/errors'

export function matchErrorMessage(error: unknown): string {
  const status = error instanceof HttpError ? error.status : 0
  if (status === 401) return sessionRequiredMessage
  if (status === 403) return 'Esta solicitud no te la propusieron a ti.'
  if (status === 404) return 'La solicitud ya no existe.'
  // 409: otro compañero aceptó primero o ya respondiste
  if (status === 409 && error instanceof HttpError) return error.message
  return 'No se pudo completar la acción. Inténtalo de nuevo.'
}
