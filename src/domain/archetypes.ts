import type { Archetype, TrigramId } from './types'

export const ARCHETYPES: Record<string, Archetype> = {
  SKY_EXEC: {
    id: 'SKY_EXEC',
    trigram: 'QIAN',
    name: 'Sky Executive',
    tagline: 'Authorizes reality. Stamps the void.',
    vibe: 'Directive, pristine, impossible confidence.',
  },
  LAKE_HOST: {
    id: 'LAKE_HOST',
    trigram: 'DUI',
    name: 'Lake Host',
    tagline: 'Keeps the party circulating. Trades secrets for laughs.',
    vibe: 'Social alchemy, playful negotiation, glitter in the cracks.',
  },
  NEON_AUDITOR: {
    id: 'NEON_AUDITOR',
    trigram: 'LI',
    name: 'Neon Auditor',
    tagline: 'Finds the hidden label. Reads the fine print in the fire.',
    vibe: 'Clarity, obsession, pattern recognition.',
  },
  THUNDER_RUNNER: {
    id: 'THUNDER_RUNNER',
    trigram: 'ZHEN',
    name: 'Thunder Runner',
    tagline: 'Arrives suddenly. Breaks stasis on contact.',
    vibe: 'Momentum, surprise, catalytic disruption.',
  },
  VENT_WHISPERER: {
    id: 'VENT_WHISPERER',
    trigram: 'XUN',
    name: 'Vent Whisperer',
    tagline: 'Moves through systems. Persuades doors to become hallways.',
    vibe: 'Subtle influence, infiltration, soft power.',
  },
  AISLE_DIVER: {
    id: 'AISLE_DIVER',
    trigram: 'KAN',
    name: 'Aisle Diver',
    tagline: 'Finds what’s under. Brings back proof dripping with meaning.',
    vibe: 'Depth, courage, emotional navigation.',
  },
  COLD_SENTINEL: {
    id: 'COLD_SENTINEL',
    trigram: 'GEN',
    name: 'Cold Sentinel',
    tagline: 'Holds the edge. Says no until the yes is real.',
    vibe: 'Boundaries, stillness, refusal as magic.',
  },
  WAREHOUSE_MOTHER: {
    id: 'WAREHOUSE_MOTHER',
    trigram: 'KUN',
    name: 'Warehouse Mother',
    tagline: 'Receives everything. Sorts it. Makes it usable.',
    vibe: 'Care, capacity, grounding, embodied logistics.',
  },
}

export const ARCHETYPE_LIST: Archetype[] = Object.values(ARCHETYPES)

export function archetypeForTrigram(trigram: TrigramId): Archetype {
  return (
    ARCHETYPE_LIST.find((a) => a.trigram === trigram) ??
    ARCHETYPES.WAREHOUSE_MOTHER
  )
}

