export const sessionRequiredMessage = 'Inicia sesión para continuar.'

export function helpRequestErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : ''
  if (message.startsWith('Error 401')) return sessionRequiredMessage
  if (message.startsWith('Error 403')) return 'No puedes ver esta solicitud.'
  if (message.startsWith('Error 404')) return 'La solicitud no existe.'
  return 'No se pudo completar la acción.'
}
