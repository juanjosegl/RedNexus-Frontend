export type PqrsType = 'PETICION' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA'
export type PqrsStatus = 'RADICADA' | 'EN_REVISION' | 'RESPONDIDA'

export interface NewPqrs {
  type: PqrsType
  subject: string
  description: string
}

export interface Pqrs extends NewPqrs {
  id: string
  radicado: string
  status: PqrsStatus
  response: string | null
  respondedAt: string | null
  createdAt: string
}
