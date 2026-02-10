import type { BAR, MiniGameMode, MoveType, QUEST, StoryMoment } from './types'
import { ARCHETYPES } from './archetypes'
import { TRIGRAMS } from './trigrams'
import { clampDurationSeconds, DEFAULT_MOVE_TYPE, MOVE_TYPE_MODIFIERS } from './moves'
import { trigramForKotterStage } from './kotter'
import { ARCHETYPE_COLUMN_MODIFIER } from './grid'
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

type MinigameTemplate = {
  id: string
  storyMoment: StoryMoment
  mode: MiniGameMode
  durationSeconds: number
  title: (verb: string) => string
  setup: string[]
  rules: (ctx: {
    archetypeName: string
    upperKeyword: string
    lowerKeyword: string
    movingLines: number
  }) => string[]
  winCondition: string
  scoring: string[]
  rewardBase: number
}

// Mario-Party-ish minigame templates keyed by Kotter stage.
const TEMPLATES: MinigameTemplate[] = [
  {
    id: 'urgency_signal_sprint',
    storyMoment: 'URGENCY',
    mode: 'FREE_FOR_ALL',
    durationSeconds: 60,
    title: (verb) => `1 · Create Urgency: ${verb} Signal Sprint`,
    setup: ['Everyone stands in a circle.', 'Pick ONE “signal” word for the room (ex: “AISLE”).'],
    rules: ({ movingLines }) => [
      'For 60 seconds, anyone can point to an object and shout the signal word.',
      'The next player must name a DIFFERENT object that matches the vibe of the first object (no repeats).',
      `If someone hesitates >3 seconds, they lose 1 point.${movingLines >= 3 ? ' Moving lines: the signal word changes once at 30 seconds.' : ''}`,
    ],
    winCondition: 'Highest points at the buzzer.',
    scoring: ['+1 point for a valid match', '-1 point for hesitation', '-1 point for repeating an object'],
    rewardBase: 8,
  },
  {
    id: 'coalition_handshake_protocol',
    storyMoment: 'COALITION',
    mode: 'WHOLE_ROOM',
    durationSeconds: 180,
    title: (verb) => `2 · Build Coalition: ${verb} Handshake Protocol`,
    setup: ['Each player chooses a 2-word codename.', 'Set a 3-minute timer.'],
    rules: ({ archetypeName }) => [
      `You are the ${archetypeName}: walk the room and “recruit” by learning codenames.`,
      'When you learn someone’s codename, you must teach them a gesture (a tiny “handshake”).',
      'A coalition is formed when 3 people can correctly perform each other’s gestures.',
    ],
    winCondition: 'Form the most coalitions before time ends.',
    scoring: ['+3 points per coalition of 3', '+1 bonus if a coalition includes someone you met for the first time tonight'],
    rewardBase: 9,
  },
  {
    id: 'vision_map_the_night',
    storyMoment: 'VISION',
    mode: 'TEAMS',
    durationSeconds: 240,
    title: (verb) => `3 · Form Vision: ${verb} Map the Night`,
    setup: ['Split into 2 teams.', 'Each team gets one phone note or scrap paper.'],
    rules: ({ upperKeyword, lowerKeyword }) => [
      `Team A must describe the party’s “upper world” using: ${upperKeyword}.`,
      `Team B must describe the party’s “lower world” using: ${lowerKeyword}.`,
      'In 4 minutes, each team writes a 6-word “vision slogan”.',
      'Then swap slogans and improve the other team’s slogan by changing exactly 2 words.',
    ],
    winCondition: 'Loudest crowd vote wins (clap/cheer).',
    scoring: ['Winning team: +5 points each', 'Other team: +2 points each (for participating)'],
    rewardBase: 10,
  },
  {
    id: 'enlist_contagious_dare',
    storyMoment: 'ENLIST',
    mode: 'ONE_VS_MANY',
    durationSeconds: 120,
    title: (verb) => `4 · Enlist the Many: ${verb} Contagious Dare`,
    setup: ['Choose 1 Enlister.', 'Set a 2-minute timer.'],
    rules: ({ movingLines }) => [
      'Enlister invents a tiny, safe, non-embarrassing dare (5 seconds).',
      'Goal: get as many different people as possible to do it once.',
      `If moving lines ≥ 2: after 60 seconds, the dare must “evolve” (add one extra rule).`,
    ],
    winCondition: 'Most participants recruited before time ends.',
    scoring: ['+1 point per unique participant', '+2 bonus if a participant recruits someone else (chain)'],
    rewardBase: 11,
  },
  {
    id: 'unblock_bouncer_rule',
    storyMoment: 'UNBLOCK',
    mode: 'WHOLE_ROOM',
    durationSeconds: 180,
    title: (verb) => `5 · Remove Barriers: ${verb} The Bouncer Rule`,
    setup: ['Pick 1 “Bouncer”.', 'Pick 1 “Door” (a spot in the room).', 'Set a 3-minute timer.'],
    rules: () => [
      'The Bouncer invents a silly barrier rule (ex: “You may only approach the Door while humming”).',
      'Everyone must reach the Door and touch it while obeying the barrier rule.',
      'After 60 seconds, anyone who has reached the Door may propose a “workaround” rule.',
    ],
    winCondition: 'Everyone succeeds at least once before time ends.',
    scoring: ['Group win: +3 points each', 'If group fails: Bouncer gets +3 (for being the obstacle)'],
    rewardBase: 10,
  },
  {
    id: 'wins_receipt_hunt',
    storyMoment: 'WINS',
    mode: 'FREE_FOR_ALL',
    durationSeconds: 90,
    title: (verb) => `6 · Short-Term Wins: ${verb} Receipt Hunt`,
    setup: ['Choose a judge/witness.', 'Set a 90-second timer.'],
    rules: ({ upperKeyword, lowerKeyword }) => [
      `Find “proof” of the party’s direction: one object/person/moment that matches ${upperKeyword} AND ${lowerKeyword}.`,
      'Bring it to the witness and state your claim in one sentence.',
      'Witness must respond “VALID” or “DENIED” immediately.',
    ],
    winCondition: 'Most VALID receipts.',
    scoring: ['+2 points per VALID receipt', '-1 for DENIED claims', '+1 bonus for making the witness laugh'],
    rewardBase: 12,
  },
  {
    id: 'accelerate_rule_stack',
    storyMoment: 'ACCELERATE',
    mode: 'WHOLE_ROOM',
    durationSeconds: 180,
    title: (verb) => `7 · Sustain Acceleration: ${verb} Rule Stack`,
    setup: ['Everyone in a circle.', 'Set a 3-minute timer.'],
    rules: ({ movingLines }) => [
      'Start a simple loop (ex: say your name + a gesture).',
      'Every 20 seconds, add a new rule (speed up, reverse order, whisper, etc.).',
      `Moving lines: add ${Math.min(3, Math.max(1, movingLines))} extra rules total.`,
    ],
    winCondition: 'Last person to break the loop wins.',
    scoring: ['Winner: +8 points', 'Everyone else: +2 points (for surviving as long as possible)'],
    rewardBase: 13,
  },
  {
    id: 'anchor_culture_stamp',
    storyMoment: 'ANCHOR',
    mode: 'COOP',
    durationSeconds: 240,
    title: (verb) => `8 · Anchor the Change: ${verb} Culture Stamp`,
    setup: ['Choose a place for a “micro-shrine” (table corner / wall).', 'Set a 4-minute timer.'],
    rules: () => [
      'As a group, invent a 1-sentence myth about tonight.',
      'Create a “stamp”: a gesture + a sound (2 seconds total).',
      'Teach the stamp to at least 3 other people who were not in the group.',
    ],
    winCondition: '3 outsiders can perform the stamp correctly.',
    scoring: ['Group success: +5 points each', 'If an outsider teaches a fourth: +2 bonus each'],
    rewardBase: 14,
  },
]

export function mintQuestFromBar(args: {
  bar: BAR
  archetypeId: string
  storyMoment: StoryMoment
  moveType?: MoveType
}): QUEST {
  const { bar, archetypeId, storyMoment } = args
  const archetype = ARCHETYPES[archetypeId] ?? Object.values(ARCHETYPES)[0]!
  const upper = TRIGRAMS[bar.hexagram.upper]
  const lower = TRIGRAMS[bar.hexagram.lower]
  const stageTrigramId = trigramForKotterStage(storyMoment)
  const stageTrigram = TRIGRAMS[stageTrigramId]
  const archetypeTrigramId = archetype.trigram
  const archetypeColumn = ARCHETYPE_COLUMN_MODIFIER[archetypeTrigramId]

  const moveType: MoveType = args.moveType ?? DEFAULT_MOVE_TYPE
  const seed = hashToInt(
    `${bar.id}:${archetypeId}:${archetypeTrigramId}:${storyMoment}:${stageTrigramId}:${moveType}:${bar.hexagram.bits}`,
  )
  const verb = pick(STORY_MOMENT_META[storyMoment].verbs, seed)
  const candidates = TEMPLATES.filter((t) => t.storyMoment === storyMoment)
  const template = pick(candidates.length ? candidates : TEMPLATES, seed)
  const mod = MOVE_TYPE_MODIFIERS[moveType]

  const steps = template.rules({
    archetypeName: archetype.name,
    upperKeyword: upper.keyword,
    lowerKeyword: lower.keyword,
    movingLines: bar.movingLines.length,
  })
  const modifiedSteps = [
    ...steps,
    ...(archetypeColumn.ruleAdd ?? []),
    `${mod.addRulePrefix} ${mod.addRuleSuffix ?? ''}`.trim(),
  ]

  const rewardVibeulons =
    template.rewardBase +
    archetypeColumn.rewardBonus +
    mod.rewardBonus +
    Math.min(6, bar.movingLines.length) +
    (seed % 3)

  const title = template.title(verb)
  const caller = bar.playerLabel ? `, ${bar.playerLabel}` : ''
  const prompt = `Operator${caller}: your BAR reads **${bar.hexagram.label}** (${upper.glyph}${lower.glyph}). Kotter anchor: ${stageTrigram.glyph} ${stageTrigram.name}. Grid column: ${TRIGRAMS[archetypeTrigramId].glyph} ${TRIGRAMS[archetypeTrigramId].name}. As the **${archetype.name}**, channel: ${upper.keyword} // ${lower.keyword}.`

  return {
    id: newId('quest'),
    createdAt: Date.now(),
    barId: bar.id,
    archetypeId: archetype.id,
    storyMoment,
    moveType,
    stageTrigramId,
    archetypeTrigramId,
    title,
    prompt,
    steps: modifiedSteps,
    mode: template.mode,
    durationSeconds: clampDurationSeconds(template.durationSeconds + mod.durationDeltaSeconds),
    setup: [...template.setup, ...(archetypeColumn.setupAdd ?? [])],
    winCondition: template.winCondition,
    scoring: [...template.scoring, ...(archetypeColumn.scoringAdd ?? [])],
    rewardVibeulons,
  }
}

