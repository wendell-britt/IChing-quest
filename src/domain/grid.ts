import type { TrigramId } from './types'
import { TRIGRAMS } from './trigrams'

export type GridModifier = {
  label: string
  flavor: string
  setupAdd?: string[]
  ruleAdd?: string[]
  scoringAdd?: string[]
  rewardBonus: number
}

// Column modifiers: by archetype trigram (the player's “style”)
export const ARCHETYPE_COLUMN_MODIFIER: Record<TrigramId, GridModifier> = {
  ZHEN: {
    label: 'Thunder column: Decisive Storm',
    flavor: 'Speed, disruption, sudden turns.',
    ruleAdd: ['Thunder twist: whenever someone scores, the turn order rotates.'],
    scoringAdd: ['+1 bonus for first successful action after a rule change'],
    rewardBonus: 1,
  },
  QIAN: {
    label: 'Heaven column: Bold Heart',
    flavor: 'Leadership, declaration, high confidence.',
    ruleAdd: ['Heaven twist: the current leader must announce the next constraint out loud.'],
    scoringAdd: ['+1 bonus for completing a round without hesitation'],
    rewardBonus: 1,
  },
  KAN: {
    label: 'Water column: Danger Walker',
    flavor: 'Risk, stealth, flow through uncertainty.',
    ruleAdd: ['Water twist: you may attempt one “risky shortcut” once; if judged invalid, lose 1 point.'],
    scoringAdd: ['+2 bonus for a successful risky shortcut'],
    rewardBonus: 2,
  },
  KUN: {
    label: 'Earth column: Devoted Guardian',
    flavor: 'Care, containment, making it safe enough to play.',
    setupAdd: ['Earth support: pick a witness whose job is to keep the vibe safe and consent-clear.'],
    scoringAdd: ['+1 bonus if nobody is excluded and everyone scores at least once'],
    rewardBonus: 1,
  },
  DUI: {
    label: 'Lake column: Joyful Connector',
    flavor: 'Bonding, humor, social conductivity.',
    ruleAdd: ['Lake twist: you may “pair up” once to share a point if you both succeed together.'],
    scoringAdd: ['+1 bonus for making a new connection (someone you haven’t talked to yet)'],
    rewardBonus: 1,
  },
  GEN: {
    label: 'Mountain column: Still Point',
    flavor: 'Boundaries, precision, restraint.',
    ruleAdd: ['Mountain twist: one round must be completed in silence.'],
    scoringAdd: ['+1 bonus for a clean silent round (no breaks)'],
    rewardBonus: 1,
  },
  XUN: {
    label: 'Wind column: Subtle Influence',
    flavor: 'Signals, persuasion, quiet coordination.',
    ruleAdd: ['Wind twist: you may communicate one instruction using only a gesture.'],
    scoringAdd: ['+1 bonus if your gesture causes a successful action by someone else'],
    rewardBonus: 1,
  },
  LI: {
    label: 'Fire column: Truthsayer',
    flavor: 'Clarity, naming, spotlighting what’s real.',
    ruleAdd: ['Fire twist: once, you may call “TRUTH CHECK” to clarify a disputed rule.'],
    scoringAdd: ['+1 bonus for a successful truth check that the witness confirms'],
    rewardBonus: 1,
  },
}

export function gridLabel(stageTrigramId: TrigramId, archetypeTrigramId: TrigramId): string {
  const row = TRIGRAMS[stageTrigramId]
  const col = TRIGRAMS[archetypeTrigramId]
  return `${row.glyph} ${row.name} × ${col.glyph} ${col.name}`
}

