// FE-17: Markdown mínimo para las respuestas del asistente (párrafos, listas y **negrita**).
// No usa v-html: el texto se convierte en bloques y Vue lo pinta escapado, así una respuesta
// del modelo nunca puede inyectar HTML en la página.

export interface Fragmento {
  texto: string
  negrita: boolean
}

export type Bloque =
  | { tipo: 'parrafo'; fragmentos: Fragmento[] }
  | { tipo: 'lista'; ordenada: boolean; items: Fragmento[][] }

const VINETA = /^\s*[-*•]\s+(.*)$/
const NUMERO = /^\s*\d+[.)]\s+(.*)$/

/** Separa **negrita** del resto; un ** sin cerrar se deja como texto */
export function fragmentar(linea: string): Fragmento[] {
  const fragmentos: Fragmento[] = []
  const partes = linea.split('**')
  const cerrado = partes.length % 2 === 1
  partes.forEach((parte, i) => {
    if (!parte) return
    const negrita = cerrado && i % 2 === 1
    const texto = !cerrado && i > 0 ? `**${parte}` : parte
    const anterior = fragmentos[fragmentos.length - 1]
    if (anterior && anterior.negrita === negrita) anterior.texto += texto
    else fragmentos.push({ texto, negrita })
  })
  return fragmentos
}

export function analizarMarkdown(texto: string): Bloque[] {
  const bloques: Bloque[] = []
  let parrafo: string[] = []

  const cerrarParrafo = () => {
    if (parrafo.length) {
      bloques.push({ tipo: 'parrafo', fragmentos: fragmentar(parrafo.join(' ')) })
      parrafo = []
    }
  }

  for (const linea of texto.replace(/\r\n/g, '\n').split('\n')) {
    const vineta = VINETA.exec(linea)
    const numero = NUMERO.exec(linea)
    if (vineta || numero) {
      cerrarParrafo()
      const ordenada = Boolean(numero)
      const contenido = (numero ?? vineta)![1] ?? ''
      const ultimo = bloques[bloques.length - 1]
      if (ultimo?.tipo === 'lista' && ultimo.ordenada === ordenada) {
        ultimo.items.push(fragmentar(contenido))
      } else {
        bloques.push({ tipo: 'lista', ordenada, items: [fragmentar(contenido)] })
      }
    } else if (linea.trim() === '') {
      cerrarParrafo()
    } else {
      parrafo.push(linea.trim())
    }
  }
  cerrarParrafo()
  return bloques
}
