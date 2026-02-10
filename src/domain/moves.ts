import type { MoveType, StoryMoment } from './types'

export const MOVE_TYPES: MoveType[] = ['WAKE_UP', 'CLEAN_UP', 'GROW_UP', 'SHOW_UP']

export const MOVE_TYPE_META: Record<MoveType, { label: string; flavor: string }> = {
  WAKE_UP: { label: 'Wake up', flavor: 'Ignition, attention, contact with reality.' },
  CLEAN_UP: { label: 'Clean up', flavor: 'Clear obstacles, restore flow, make it workable.' },
  GROW_UP: { label: 'Grow up', flavor: 'Skill, coherence, commitment, upgrading the pattern.' },
  SHOW_UP: { label: 'Show up', flavor: 'Performance, proof, embodiment, cultural imprint.' },
}

export const DEFAULT_MOVE_TYPE: MoveType = 'WAKE_UP'

// Optional: move-type modifiers can be applied to any Kotter stage + archetype combo.
export const MOVE_TYPE_MODIFIERS: Record<
  MoveType,
  {
    addRulePrefix: string
    addRuleSuffix?: string
    rewardBonus: number
    durationDeltaSeconds: number
  }
> = {
  WAKE_UP: {
    addRulePrefix: 'Wake up modifier:',
    addRuleSuffix: 'Make it loud, fast, and obvious.',
    rewardBonus: 0,
    durationDeltaSeconds: -10,
  },
  CLEAN_UP: {
    addRulePrefix: 'Clean up modifier:',
    addRuleSuffix: 'Remove one barrier. Simplify one rule.',
    rewardBonus: 1,
    durationDeltaSeconds: 0,
  },
  GROW_UP: {
    addRulePrefix: 'Grow up modifier:',
    addRuleSuffix: 'Add one skill constraint (precision, memory, coordination).',
    rewardBonus: 2,
    durationDeltaSeconds: 15,
  },
  SHOW_UP: {
    addRulePrefix: 'Show up modifier:',
    addRuleSuffix: 'Add a witness/judge and make the outcome public.',
    rewardBonus: 3,
    durationDeltaSeconds: 0,
  },
}

export function clampDurationSeconds(n: number): number {
  return Math.max(30, Math.min(600, Math.round(n)))
}

