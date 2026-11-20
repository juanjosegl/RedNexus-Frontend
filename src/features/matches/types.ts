import type { MatchStatus, RequestStatus } from '@/features/help-requests/types'

export interface IncomingRequest {
  id: string
  text: string
  area: string | null
  topics: string[]
  level: string | null
  status: RequestStatus
  createdAt: string
  // el email solo llega cuando yo acepté
  author: { name: string; email?: string }
}

export interface IncomingMatch {
  id: string
  score: number
  explanation: string | null
  status: MatchStatus
  createdAt: string
  request: IncomingRequest
}

export interface AcceptedMatch {
  authorEmail: string
}
