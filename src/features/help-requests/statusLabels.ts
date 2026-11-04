import type { MatchStatus, RequestStatus } from './types'

interface StatusOption {
  value: string
  label: string
}

export type BadgeStatus = 'pending' | 'matched' | 'accepted' | 'closed'

export function badgeStatus(status: RequestStatus): BadgeStatus {
  return status.toLowerCase() as BadgeStatus
}

const requestStatusLabels: Record<RequestStatus, string> = {
  PENDING: 'Pendiente',
  MATCHED: 'Con candidatos',
  ACCEPTED: 'Aceptada',
  CLOSED: 'Cerrada',
}

const matchStatusLabels: Record<MatchStatus, string> = {
  PROPOSED: 'Propuesto',
  ACCEPTED: 'Aceptó',
  REJECTED: 'Rechazó',
}

export const requestStatusOptions: StatusOption[] = [
  { value: '', label: 'Todas' },
  { value: 'PENDING', label: requestStatusLabels.PENDING },
  { value: 'MATCHED', label: requestStatusLabels.MATCHED },
  { value: 'ACCEPTED', label: requestStatusLabels.ACCEPTED },
  { value: 'CLOSED', label: requestStatusLabels.CLOSED },
]

export function requestStatusLabel(status: RequestStatus): string {
  return requestStatusLabels[status]
}

export function matchStatusLabel(status: MatchStatus): string {
  return matchStatusLabels[status]
}
