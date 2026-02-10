import type { StoryMoment, TrigramId } from './types'

// Kotter stages → Trigram anchors (unified 8-stage / 8-trigram scheme)
//
// Rationale (party-friendly):
// - URGENCY: Thunder = arousing/wake-up jolt
// - COALITION: Lake = gathering/connection/joy
// - VISION: Fire = clarity/illumination
// - ENLIST: Wind = spread/penetration/influence
// - UNBLOCK: Mountain = boundaries/obstacles/holding patterns
// - WINS: Heaven = creative power / “we can do this”
// - ACCELERATE: Water = flow through danger / sustained motion
// - ANCHOR: Earth = grounding / making it stick
export const KOTTER_TRIGRAM_ANCHOR: Record<StoryMoment, TrigramId> = {
  URGENCY: 'ZHEN',
  COALITION: 'DUI',
  VISION: 'LI',
  ENLIST: 'XUN',
  UNBLOCK: 'GEN',
  WINS: 'QIAN',
  ACCELERATE: 'KAN',
  ANCHOR: 'KUN',
}

export function trigramForKotterStage(storyMoment: StoryMoment): TrigramId {
  return KOTTER_TRIGRAM_ANCHOR[storyMoment]
}

