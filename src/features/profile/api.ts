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
