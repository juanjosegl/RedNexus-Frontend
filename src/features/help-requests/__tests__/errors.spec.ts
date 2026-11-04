import { describe, it, expect } from 'vitest'
import { HttpError } from '@/services/http'
import { helpRequestErrorMessage, sessionRequiredMessage } from '../errors'

describe('helpRequestErrorMessage', () => {
  it('traduce el código HTTP aunque el backend mande su propio mensaje', () => {
    expect(helpRequestErrorMessage(new HttpError('Unauthorized', 401))).toBe(sessionRequiredMessage)
    expect(helpRequestErrorMessage(new HttpError('Forbidden', 403))).toBe(
      'No puedes ver esta solicitud.',
    )
    expect(helpRequestErrorMessage(new HttpError('Not Found', 404))).toBe('La solicitud no existe.')
  })

  it('usa un mensaje genérico para otros errores', () => {
    expect(helpRequestErrorMessage(new Error('sin red'))).toBe('No se pudo completar la acción.')
  })
})
