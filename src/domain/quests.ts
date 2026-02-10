import type { BAR, QUEST, StoryMoment } from './types'
import { ARCHETYPES } from './archetypes'
import { TRIGRAMS } from './trigrams'
import { newId } from './util'

export const STORY_MOMENT_META: Record<
  StoryMoment,
  { label: string; hint: string; verbs: string[] }
> = {
  URGENCY: {
    label: '1 · Create Urgency',
    hint: 'The party needs a direction. Name the now.',
    verbs: ['Ignite', 'Notice', 'Wake', 'Declare', 'Escalate'],
  },
  COALITION: {
    label: '2 · Build Coalition',
    hint: 'Find allies. Form the temporary committee of destiny.',
    verbs: ['Gather', 'Link', 'Recruit', 'Convene', 'Assemble'],
  },
  VISION: {
    label: '3 · Form Vision',
    hint: 'Give the night a shape. Sketch the impossible diagram.',
    verbs: ['Envision', 'Draft', 'Map', 'Design', 'Name'],
  },
  ENLIST: {
    label: '4 · Enlist the Many',
    hint: 'Make it contagious. Translate the vision into a dare.',
    verbs: ['Broadcast', 'Invite', 'Signal', 'Rally', 'Enlist'],
  },
  UNBLOCK: {
    label: '5 · Remove Barriers',
    hint: 'Clear a path. Turn “can’t” into a door handle.',
    verbs: ['Unblock', 'Unlock', 'Clear', 'Bypass', 'Enable'],
  },
  WINS: {
    label: '6 · Short-Term Wins',
    hint: 'Collect proof. Small victories feed the system.',
    verbs: ['Score', 'Claim', 'Verify', 'Celebrate', 'Bank'],
  },
  ACCELERATE: {
    label: '7 · Sustain Acceleration',
    hint: 'Don’t stop at one glitch. Keep the momentum honest.',
    verbs: ['Accelerate', 'Stack', 'Iterate', 'Surge', 'Amplify'],
  },
  ANCHOR: {
    label: '8 · Anchor the Change',
    hint: 'Make it real enough to last. Leave a trace in the culture.',
    verbs: ['Anchor', 'Seal', 'Institutionalize', 'Archive', 'Encode'],
  },
}

export const STORY_MOMENTS: StoryMoment[] = [
  'URGENCY',
  'COALITION',
  'VISION',
  'ENLIST',
  'UNBLOCK',
  'WINS',
  'ACCELERATE',
  'ANCHOR',
]

function hashToInt(s: string): number {
  // small deterministic hash for template selection
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h >>> 0)
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length]!
}

const STEP_BANK = {
  observe: [
    'Locate a sign, label, or product that feels “out of place.”',
    'Find a color that repeats 3 times in your environment.',
    'Listen for a phrase you weren’t meant to hear.',
    'Identify the loudest object in the room (not person).',
  ],
  interact: [
    'Ask a stranger: “What aisle are we in emotionally?”',
    'Trade a small object for a story fragment (one sentence).',
    'Offer a compliment that sounds like a prophecy.',
    'Invite someone to witness the artifact for 10 seconds.',
  ],
  enact: [
    'Perform a 5-second ritual gesture and name it.',
    'Walk a tiny loop and return with new posture.',
    'Touch a wall/floor and declare it “calibrated.”',
    'Choose a direction and take exactly 8 steps.',
  ],
  document: [
    'Record the result as a single weird headline.',
    'Write down 3 words you want the party to remember.',
    'Take a photo of a texture that matches your mood.',
    'Sketch a symbol that explains what just happened.',
  ],
} as const

export function mintQuestFromBar(args: {
  bar: BAR
  archetypeId: string
  storyMoment: StoryMoment
}): QUEST {
  const { bar, archetypeId, storyMoment } = args
  const archetype = ARCHETYPES[archetypeId] ?? Object.values(ARCHETYPES)[0]!
  const upper = TRIGRAMS[bar.hexagram.upper]
  const lower = TRIGRAMS[bar.hexagram.lower]

  const seed = hashToInt(`${bar.id}:${archetypeId}:${storyMoment}:${bar.hexagram.bits}`)
  const verb = pick(STORY_MOMENT_META[storyMoment].verbs, seed)
  const steps = [
    pick(STEP_BANK.observe, seed + 1),
    pick(STEP_BANK.interact, seed + 2),
    pick(STEP_BANK.enact, seed + 3),
    pick(STEP_BANK.document, seed + 4),
  ]

  const rewardVibeulons = 7 + Math.min(5, bar.movingLines.length) + (seed % 4)

  const title = `${STORY_MOMENT_META[storyMoment].label}: ${verb}`
  const caller = bar.playerLabel ? `, ${bar.playerLabel}` : ''
  const prompt = `Operator${caller}: your BAR reads **${bar.hexagram.label}** (${upper.glyph}${lower.glyph}). As the **${archetype.name}**, channel: ${upper.keyword} // ${lower.keyword}.`

  return {
    id: newId('quest'),
    createdAt: Date.now(),
    barId: bar.id,
    archetypeId: archetype.id,
    storyMoment,
    title,
    prompt,
    steps,
    rewardVibeulons,
  }
}

