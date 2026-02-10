import { describe, expect, it } from 'vitest'
import { hexagramFromLines, drawHexagramByCoins } from './iChing'
import { TRIGRAMS } from './trigrams'
import { archetypeForTrigram } from './archetypes'

describe('iChing', () => {
  it('derives upper/lower trigram from lines', () => {
    // bottom -> top
    const hex = hexagramFromLines(['yang', 'yang', 'yang', 'yin', 'yin', 'yin'])
    expect(hex.lower).toBe('QIAN')
    expect(hex.upper).toBe('KUN')
    expect(hex.bits).toBe('111000')
    expect(hex.label).toBe(`${TRIGRAMS.KUN.name} over ${TRIGRAMS.QIAN.name}`)
  })

  it('coin draw returns valid shapes', () => {
    const res = drawHexagramByCoins()
    expect(res.hexagram.lines).toHaveLength(6)
    expect(res.hexagram.bits).toMatch(/^[01]{6}$/)
    for (const idx of res.movingLines) {
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(6)
    }
  })
})

describe('archetypes', () => {
  it('maps trigram to matching archetype', () => {
    const a = archetypeForTrigram('KAN')
    expect(a.trigram).toBe('KAN')
  })
})

