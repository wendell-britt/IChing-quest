import type { Archetype, TrigramId } from './types'

export const ARCHETYPES: Record<string, Archetype> = {
  SKY_EXEC: {
    id: 'SKY_EXEC',
    trigram: 'QIAN',
    name: 'The bold heart',
    tagline: 'Leads with signal. Acts before doubt can vote.',
    vibe: 'Courage, initiative, clean intent, radiant will.',
  },
  LAKE_HOST: {
    id: 'LAKE_HOST',
    trigram: 'DUI',
    name: 'Joyful connector',
    tagline: 'Links strangers into constellations. Turns small talk into gates.',
    vibe: 'Play, charm, exchange, social conductivity.',
  },
  NEON_AUDITOR: {
    id: 'NEON_AUDITOR',
    trigram: 'LI',
    name: 'The truthsayer',
    tagline: 'Speaks the bright fact. Burns away the convenient story.',
    vibe: 'Clarity, honesty, illumination, precise language.',
  },
  THUNDER_RUNNER: {
    id: 'THUNDER_RUNNER',
    trigram: 'ZHEN',
    name: 'The decisive storm',
    tagline: 'Arrives suddenly. Chooses the direction lightning prefers.',
    vibe: 'Momentum, action, rupture-to-renewal, fearless motion.',
  },
  VENT_WHISPERER: {
    id: 'VENT_WHISPERER',
    trigram: 'XUN',
    name: 'The subtle influence',
    tagline: 'Moves through systems. Changes outcomes without announcing itself.',
    vibe: 'Gentle persuasion, attunement, soft power, incremental magic.',
  },
  AISLE_DIVER: {
    id: 'AISLE_DIVER',
    trigram: 'KAN',
    name: 'The danger walker',
    tagline: 'Steps into the unknown on purpose. Returns with usable insight.',
    vibe: 'Depth, courage, risk literacy, emotional navigation.',
  },
  COLD_SENTINEL: {
    id: 'COLD_SENTINEL',
    trigram: 'GEN',
    name: 'The still point',
    tagline: 'Holds the line. Lets the room settle into truth.',
    vibe: 'Stillness, boundaries, composure, grounded presence.',
  },
  WAREHOUSE_MOTHER: {
    id: 'WAREHOUSE_MOTHER',
    trigram: 'KUN',
    name: 'Devoted guardian',
    tagline: 'Receives everything. Protects the fragile. Makes the space safe to bloom.',
    vibe: 'Care, capacity, protection, embodiment, patient strength.',
  },
}

export const ARCHETYPE_LIST: Archetype[] = Object.values(ARCHETYPES)

export function archetypeForTrigram(trigram: TrigramId): Archetype {
  return (
    ARCHETYPE_LIST.find((a) => a.trigram === trigram) ??
    ARCHETYPES.WAREHOUSE_MOTHER
  )
}

