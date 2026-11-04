
// Cliente HTTP centralizado para comunicarse con la API.
const baseUrl = import.meta.env.VITE_API_URL ?? '/api'

// Conserva el código HTTP para que cada feature decida qué mostrar (401, 403, 404...).
export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // Adjuntar automáticamente el token de la sesión.
  const token = localStorage.getItem('rednexus_token')

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  })

  if (!res.ok) {
    let message = `Error ${res.status} en ${path}`

    try {
      const data = await res.json()

      if (Array.isArray(data.message)) {
        message = data.message.join(', ')
      } else if (typeof data.message === 'string') {
        message = data.message
      }
    } catch {
      // Se conserva el mensaje HTTP si la respuesta no contiene JSON.
    }

    throw new HttpError(message, res.status)
  }

  return res.json() as Promise<T>
}
