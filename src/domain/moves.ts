import type { MoveType, StoryMoment } from './types'

export const MOVE_TYPES: MoveType[] = ['WAKE_UP', 'CLEAN_UP', 'GROW_UP', 'SHOW_UP']

export const MOVE_TYPE_META: Record<MoveType, { label: string; flavor: string }> = {
  WAKE_UP: { label: 'Wake up', flavor: 'Ignition, attention, contact with reality.' },
  CLEAN_UP: { label: 'Clean up', flavor: 'Clear obstacles, restore flow, make it workable.' },
  GROW_UP: { label: 'Grow up', flavor: 'Skill, coherence, commitment, upgrading the pattern.' },
  SHOW_UP: { label: 'Show up', flavor: 'Performance, proof, embodiment, cultural imprint.' },
}

// Default alignment: 8 Kotter stages → 4 move types (pairs)
export const STORY_MOMENT_TO_MOVE_TYPE: Record<StoryMoment, MoveType> = {
  URGENCY: 'WAKE_UP',
  COALITION: 'WAKE_UP',
  VISION: 'GROW_UP',
  ENLIST: 'GROW_UP',
  UNBLOCK: 'CLEAN_UP',
  WINS: 'CLEAN_UP',
  ACCELERATE: 'SHOW_UP',
  ANCHOR: 'SHOW_UP',
}

export function moveTypeForStoryMoment(storyMoment: StoryMoment): MoveType {
  return STORY_MOMENT_TO_MOVE_TYPE[storyMoment]
}

