import type { PqrsStatus, PqrsType } from './types'

export const pqrsTypeOptions: { value: PqrsType; label: string }[] = [
  { value: 'PETICION', label: 'Petición' },
  { value: 'QUEJA', label: 'Queja' },
  { value: 'RECLAMO', label: 'Reclamo' },
  { value: 'SUGERENCIA', label: 'Sugerencia' },
]

const typeLabels = Object.fromEntries(pqrsTypeOptions.map((o) => [o.value, o.label])) as Record<
  PqrsType,
  string
>

const statusLabels: Record<PqrsStatus, string> = {
  RADICADA: 'Radicada',
  EN_REVISION: 'En revisión',
  RESPONDIDA: 'Respondida',
}

// Reutiliza los colores de los estados de las solicitudes (.badge[data-status])
const statusBadges: Record<PqrsStatus, string> = {
  RADICADA: 'pending',
  EN_REVISION: 'matched',
  RESPONDIDA: 'accepted',
}

export function pqrsTypeLabel(type: PqrsType) {
  return typeLabels[type]
}

export function pqrsStatusLabel(status: PqrsStatus) {
  return statusLabels[status]
}

export function pqrsStatusBadge(status: PqrsStatus) {
  return statusBadges[status]
}
