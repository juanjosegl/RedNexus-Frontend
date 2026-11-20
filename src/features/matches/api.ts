import { http } from '@/services/http'
import type { AcceptedMatch, IncomingMatch } from './types'

export function listIncomingMatches() {
  return http<IncomingMatch[]>('/matches/incoming')
}

export function acceptMatch(id: string) {
  return http<AcceptedMatch>(`/matches/${id}/accept`, { method: 'POST' })
}

export function rejectMatch(id: string) {
  return http<{ id: string; status: 'REJECTED' }>(`/matches/${id}/reject`, { method: 'POST' })
}
