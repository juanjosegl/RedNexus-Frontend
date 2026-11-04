import { http } from '@/services/http'

export interface User {
  id: string
  email: string
  name: string
  bio: string | null
  tags: string[]
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface LoginData {
  email: string
  password: string
}

export function register(data: RegisterData) {
  return http<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function login(data: LoginData) {
  return http<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getMe(token: string) {
  return http<User>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
