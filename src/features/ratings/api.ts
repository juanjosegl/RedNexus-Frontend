import { http } from '@/services/http'

export interface Rating {
  id: string
  requestId: string
  helperId: string
  stars: number
  createdAt: string
}

export function rateHelpRequest(requestId: string, stars: number) {
  return http<Rating>('/ratings', {
    method: 'POST',
    body: JSON.stringify({ requestId, stars }),
  })
}
