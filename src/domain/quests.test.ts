import { describe, expect, it } from 'vitest'
import { mintQuestFromBar } from './quests'
import type { BAR } from './types'

describe('quests minigames', () => {
  it('mints a minigame-style quest with structured fields', () => {
    const bar: BAR = {
      id: 'bar_test',
      createdAt: Date.now(),
      method: 'quick',
      hexagram: {
        id: 1,
        label: 'Heaven over Earth',
        // bottom -> top
        lines: ['yang', 'yang', 'yang', 'yin', 'yin', 'yin'],
        upper: 'KUN',
        lower: 'QIAN',
        bits: '111000',
      },
      movingLines: [0, 3],
      playerLabel: 'MOTH-17',
    }

    const q = mintQuestFromBar({
      bar,
      archetypeId: 'THUNDER_RUNNER',
      storyMoment: 'URGENCY',
      moveType: 'CLEAN_UP',
    })
    expect(q.moveType).toBe('CLEAN_UP')
    expect(q.mode).toBeTruthy()
    expect(typeof q.durationSeconds).toBe('number')
    expect(Array.isArray(q.setup)).toBe(true)
    expect(Array.isArray(q.scoring)).toBe(true)
    expect(typeof q.winCondition).toBe('string')
    expect(q.steps.length).toBeGreaterThan(0)
  })
})

