// Cliente minimo para la API. Cada feature lo usa en lugar de llamar a fetch directamente.
const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    throw new Error(`Error ${res.status} en ${path}`)
  }
  return res.json() as Promise<T>
}
