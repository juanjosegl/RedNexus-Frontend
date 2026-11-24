import { describe, expect, it } from 'vitest'
import { analizarMarkdown, fragmentar } from '../markdown'

describe('fragmentar', () => {
  it('separa la negrita del texto normal', () => {
    expect(fragmentar('Entra a **Solicitudes** y abre la tuya')).toEqual([
      { texto: 'Entra a ', negrita: false },
      { texto: 'Solicitudes', negrita: true },
      { texto: ' y abre la tuya', negrita: false },
    ])
  })

  it('deja como texto un ** sin cerrar', () => {
    expect(fragmentar('2 ** 3 es potencia')).toEqual([
      { texto: '2 ** 3 es potencia', negrita: false },
    ])
  })
})

describe('analizarMarkdown', () => {
  it('convierte pasos numerados en una lista ordenada', () => {
    const bloques = analizarMarkdown(
      'Sigue estos pasos:\n\n1. Entra a **Solicitudes**.\n2. Pulsa **Calificar**.',
    )

    expect(bloques).toHaveLength(2)
    expect(bloques[0]).toEqual({
      tipo: 'parrafo',
      fragmentos: [{ texto: 'Sigue estos pasos:', negrita: false }],
    })
    expect(bloques[1]).toMatchObject({ tipo: 'lista', ordenada: true })
    expect(bloques[1]?.tipo === 'lista' && bloques[1].items).toHaveLength(2)
  })

  it('distingue viñetas de números y une las líneas de un párrafo', () => {
    const bloques = analizarMarkdown('- uno\n- dos\n\nlínea a\nlínea b')

    expect(bloques[0]).toMatchObject({ tipo: 'lista', ordenada: false })
    expect(bloques[1]).toEqual({
      tipo: 'parrafo',
      fragmentos: [{ texto: 'línea a línea b', negrita: false }],
    })
  })
})
