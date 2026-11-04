import { http } from '@/services/http'
import { useSessionStore } from '@/stores/session'
import type { CreatedHelpRequest, HelpRequestDetail, HelpRequestSummary } from './types'

function authHeaders(): HeadersInit {
  const token = useSessionStore().token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function listMyHelpRequests() {
  return http<HelpRequestSummary[]>('/help-requests/mine', {
    headers: authHeaders(),
  })
}

export function createHelpRequest(text: string) {
  return http<CreatedHelpRequest>('/help-requests', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  })
}

export function getHelpRequest(id: string) {
  return http<HelpRequestDetail>(`/help-requests/${id}`, {
    headers: authHeaders(),
  })
}
