export type LinePolarity = 'yin' | 'yang'

// Trigram IDs (Bagua)
export type TrigramId = 'QIAN' | 'DUI' | 'LI' | 'ZHEN' | 'XUN' | 'KAN' | 'GEN' | 'KUN'

export type DrawMethod = 'quick' | 'coins'

// 8 party periods mapped to Kotter's 8-stage model
export type StoryMoment =
  | 'URGENCY'
  | 'COALITION'
  | 'VISION'
  | 'ENLIST'
  | 'UNBLOCK'
  | 'WINS'
  | 'ACCELERATE'
  | 'ANCHOR'

// 4 move types in the larger meta-game
export type MoveType = 'WAKE_UP' | 'CLEAN_UP' | 'GROW_UP' | 'SHOW_UP'

export type MiniGameMode =
  | 'SOLO'
  | 'DUO'
  | 'FREE_FOR_ALL'
  | 'TEAMS'
  | 'ONE_VS_MANY'
  | 'WHOLE_ROOM'
  | 'COOP'

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
  moveType?: MoveType
  // Grid coordinate: Kotter-stage trigram (row) × archetype trigram (column)
  stageTrigramId?: TrigramId
  archetypeTrigramId?: TrigramId
  title: string
  prompt: string
  // Back-compat: old quests are just "steps". New quests can also include a structured minigame spec.
  steps: string[]
  mode?: MiniGameMode
  durationSeconds?: number
  setup?: string[]
  winCondition?: string
  scoring?: string[]
  rewardVibeulons: number
  redeemedAt?: number
}

export interface ArtifactStateV1 {
  version: 1
  bars: BAR[]
  quests: QUEST[]
  vibeulons: number
}

