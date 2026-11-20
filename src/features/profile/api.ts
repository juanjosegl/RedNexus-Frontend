import { http } from '@/services/http'

export interface Profile {
  id: string
  email: string
  name: string
  bio: string | null
  tags: string[]
  /** promedio de calificaciones;null si aun no tiene ninguna */
  rating: number | null
}

/** obtiene el perfil del usuario con sesión iniciada con token*/
export function getMyProfile() {
  return http<Profile>('/users/me')
}

/** Campos editables del perfil; todos son opcionales en el backend. */
export interface UpdateProfilePayload {
  name?: string
  bio?: string
  tags?: string[]
}

/** Actualiza el perfil propio y devuelve la version guardada. */
export function updateMyProfile(payload: UpdateProfilePayload) {
  return http<Profile>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

/** Todos mis datos en JSON (derecho de acceso, Ley 1581). */
export function exportMyData() {
  return http<Record<string, unknown>>('/users/me/export')
}

/** Elimina mi cuenta y todo lo asociado (derecho de supresión, Ley 1581). */
export function deleteMyAccount() {
  return http<void>('/users/me', { method: 'DELETE' })
}
