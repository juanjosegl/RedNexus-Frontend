export type ChatRole = 'user' | 'assistant'

export interface ChatTurn {
  role: ChatRole
  content: string
}

// Mensaje que se muestra en pantalla (las fuentes solo vienen en las respuestas del asistente)
export interface ChatEntry extends ChatTurn {
  sources?: string[]
}

export interface SupportReply {
  answer: string
  sources: string[]
  provider: string
  latencyMs: number
}
