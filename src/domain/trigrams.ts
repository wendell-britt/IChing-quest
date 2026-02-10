import type { Trigram, TrigramId } from './types'

export const TRIGRAMS: Record<TrigramId, Trigram> = {
  QIAN: {
    id: 'QIAN',
    name: 'Heaven',
    glyph: '☰',
    element: 'Sky / Metal',
    keyword: 'Creative force',
    lines: ['yang', 'yang', 'yang'],
  },
  DUI: {
    id: 'DUI',
    name: 'Lake',
    glyph: '☱',
    element: 'Marsh / Metal',
    keyword: 'Joyous exchange',
    lines: ['yang', 'yang', 'yin'],
  },
  LI: {
    id: 'LI',
    name: 'Fire',
    glyph: '☲',
    element: 'Fire',
    keyword: 'Clinging clarity',
    lines: ['yang', 'yin', 'yang'],
  },
  ZHEN: {
    id: 'ZHEN',
    name: 'Thunder',
    glyph: '☳',
    element: 'Thunder / Wood',
    keyword: 'Arousing shock',
    lines: ['yang', 'yin', 'yin'],
  },
  XUN: {
    id: 'XUN',
    name: 'Wind',
    glyph: '☴',
    element: 'Wind / Wood',
    keyword: 'Gentle penetration',
    lines: ['yin', 'yang', 'yang'],
  },
  KAN: {
    id: 'KAN',
    name: 'Water',
    glyph: '☵',
    element: 'Water',
    keyword: 'Abyss / flow',
    lines: ['yin', 'yang', 'yin'],
  },
  GEN: {
    id: 'GEN',
    name: 'Mountain',
    glyph: '☶',
    element: 'Mountain / Earth',
    keyword: 'Stillness',
    lines: ['yin', 'yin', 'yang'],
  },
  KUN: {
    id: 'KUN',
    name: 'Earth',
    glyph: '☷',
    element: 'Earth',
    keyword: 'Receptive field',
    lines: ['yin', 'yin', 'yin'],
  },
}

export const TRIGRAM_IDS: TrigramId[] = ['QIAN', 'DUI', 'LI', 'ZHEN', 'XUN', 'KAN', 'GEN', 'KUN']

