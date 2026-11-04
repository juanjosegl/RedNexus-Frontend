export type RequestStatus = 'PENDING' | 'MATCHED' | 'ACCEPTED' | 'CLOSED'

export type MatchStatus = 'PROPOSED' | 'ACCEPTED' | 'REJECTED'

export interface HelpRequestSummary {
  id: string
  text: string
  area: string | null
  topics: string[]
  level: string | null
  status: RequestStatus
  createdAt: string
}

export interface CreatedHelpRequest {
  id: string
  status: RequestStatus
}

export interface MatchHelper {
  id: string
  name: string
  bio: string | null
  tags: string[]
  email?: string
}

export interface HelpRequestMatch {
  id: string
  score: number
  explanation: string | null
  status: MatchStatus
  helper: MatchHelper
}

export interface HelpRequestDetail extends HelpRequestSummary {
  matches: HelpRequestMatch[]
}
