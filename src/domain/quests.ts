import type { BAR, QUEST, StoryMoment } from './types'
import { ARCHETYPES } from './archetypes'
import { TRIGRAMS } from './trigrams'
import { newId } from './util'

export const STORY_MOMENT_META: Record<
  StoryMoment,
  { label: string; hint: string; verbs: string[] }
> = {
  ARRIVAL: {
    label: 'Arrival',
    hint: 'You just got here. The artifact wakes up.',
    verbs: ['Boot', 'Initialize', 'Enter', 'Check-in', 'Wake'],
  },
  CROSSROADS: {
    label: 'Crossroads',
    hint: 'Two doors, one mood. Choose deliberately.',
    verbs: ['Choose', 'Commit', 'Branch', 'Decide', 'Pivot'],
  },
  ENCOUNTER: {
    label: 'Encounter',
    hint: 'A person or object becomes a portal.',
    verbs: ['Meet', 'Trade', 'Approach', 'Signal', 'Recruit'],
  },
  REVELATION: {
    label: 'Revelation',
    hint: 'The label is wrong. That’s the point.',
    verbs: ['Reveal', 'Decode', 'Unmask', 'Audit', 'Interpret'],
  },
  RITUAL: {
    label: 'Ritual',
    hint: 'Repeat something until it turns into meaning.',
    verbs: ['Perform', 'Loop', 'Consecrate', 'Synchronize', 'Chant'],
  },
  EXIT: {
    label: 'Exit',
    hint: 'Close the loop without closing your heart.',
    verbs: ['Seal', 'Archive', 'Leave', 'Transmit', 'Complete'],
  },
}

export const STORY_MOMENTS: StoryMoment[] = [
  'ARRIVAL',
  'CROSSROADS',
  'ENCOUNTER',
  'REVELATION',
  'RITUAL',
  'EXIT',
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
  const prompt = `Your BAR reads **${bar.hexagram.label}** (${upper.glyph}${lower.glyph}). As the **${archetype.name}**, channel: ${upper.keyword} // ${lower.keyword}.`

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

