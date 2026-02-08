export type LinePolarity = 'yin' | 'yang'

// Trigram IDs (Bagua)
export type TrigramId = 'QIAN' | 'DUI' | 'LI' | 'ZHEN' | 'XUN' | 'KAN' | 'GEN' | 'KUN'

export type DrawMethod = 'quick' | 'coins'

export type StoryMoment = 'ARRIVAL' | 'CROSSROADS' | 'ENCOUNTER' | 'REVELATION' | 'RITUAL' | 'EXIT'

export interface Trigram {
  id: TrigramId
  name: string
  glyph: string
  element: string
  keyword: string
  // bottom -> top
  lines: readonly [LinePolarity, LinePolarity, LinePolarity]
}

export interface Hexagram {
  // Not King Wen; deterministic from lines for now
  id: number
  label: string
  // bottom -> top
  lines: readonly [
    LinePolarity,
    LinePolarity,
    LinePolarity,
    LinePolarity,
    LinePolarity,
    LinePolarity,
  ]
  upper: TrigramId
  lower: TrigramId
  bits: string
}

export interface BAR {
  id: string
  createdAt: number
  method: DrawMethod
  hexagram: Hexagram
  movingLines: number[] // 0-5 indices (bottom=0)
  note?: string
  playerLabel?: string
}

export interface Archetype {
  id: string
  name: string
  trigram: TrigramId
  tagline: string
  vibe: string
}

export interface QUEST {
  id: string
  createdAt: number
  barId: string
  archetypeId: string
  storyMoment: StoryMoment
  title: string
  prompt: string
  steps: string[]
  rewardVibeulons: number
  redeemedAt?: number
}

export interface ArtifactStateV1 {
  version: 1
  bars: BAR[]
  quests: QUEST[]
  vibeulons: number
}

