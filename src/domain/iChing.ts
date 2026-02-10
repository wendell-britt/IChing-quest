import type { Hexagram, LinePolarity, TrigramId } from './types'
import { TRIGRAMS } from './trigrams'

function lineToBit(line: LinePolarity): '0' | '1' {
  return line === 'yang' ? '1' : '0'
}

function bitsToId(bits: string): number {
  // bits are bottom -> top
  return Number.parseInt(bits, 2) + 1
}

function getRandomUint32(): number {
  // Browser-safe + SSR-safe fallback
  try {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    return arr[0]!
  } catch {
    return Math.floor(Math.random() * 2 ** 32)
  }
}

function randomInt(maxExclusive: number): number {
  // naive but good enough for party artifact; avoids modulo bias by resampling
  if (maxExclusive <= 0) return 0
  const limit = Math.floor((2 ** 32 / maxExclusive) * maxExclusive)
  while (true) {
    const v = getRandomUint32()
    if (v < limit) return v % maxExclusive
  }
}

function trigramIdFromLines(lines: readonly [LinePolarity, LinePolarity, LinePolarity]): TrigramId {
  const found = (Object.keys(TRIGRAMS) as TrigramId[]).find((id) => {
    const tri = TRIGRAMS[id]
    return tri.lines[0] === lines[0] && tri.lines[1] === lines[1] && tri.lines[2] === lines[2]
  })
  return found ?? 'KUN'
}

export function hexagramFromLines(
  lines: readonly [
    LinePolarity,
    LinePolarity,
    LinePolarity,
    LinePolarity,
    LinePolarity,
    LinePolarity,
  ],
): Hexagram {
  const lowerLines = [lines[0], lines[1], lines[2]] as const
  const upperLines = [lines[3], lines[4], lines[5]] as const
  const lower = trigramIdFromLines(lowerLines)
  const upper = trigramIdFromLines(upperLines)
  const bits = lines.map(lineToBit).join('')
  const id = bitsToId(bits)
  const label = `${TRIGRAMS[upper].name} over ${TRIGRAMS[lower].name}`
  return { id, label, lines, upper, lower, bits }
}

export interface DrawLineResult {
  line: LinePolarity
  moving: boolean
  value: 6 | 7 | 8 | 9
}

export function drawCoinLine(): DrawLineResult {
  // Three coins: heads=3, tails=2. Sum -> 6..9.
  const coins = [0, 0, 0].map(() => (randomInt(2) === 0 ? 2 : 3))
  const sum = (coins[0]! + coins[1]! + coins[2]!) as 6 | 7 | 8 | 9
  if (sum === 6) return { value: 6, line: 'yin', moving: true }
  if (sum === 7) return { value: 7, line: 'yang', moving: false }
  if (sum === 8) return { value: 8, line: 'yin', moving: false }
  return { value: 9, line: 'yang', moving: true }
}

export interface DrawHexagramResult {
  hexagram: Hexagram
  movingLines: number[]
  lineValues: (6 | 7 | 8 | 9)[]
}

export function drawHexagramByCoins(): DrawHexagramResult {
  const movingLines: number[] = []
  const l0 = drawCoinLine()
  const l1 = drawCoinLine()
  const l2 = drawCoinLine()
  const l3 = drawCoinLine()
  const l4 = drawCoinLine()
  const l5 = drawCoinLine()

  if (l0.moving) movingLines.push(0)
  if (l1.moving) movingLines.push(1)
  if (l2.moving) movingLines.push(2)
  if (l3.moving) movingLines.push(3)
  if (l4.moving) movingLines.push(4)
  if (l5.moving) movingLines.push(5)

  const lines = [l0.line, l1.line, l2.line, l3.line, l4.line, l5.line] as const
  const lineValues = [l0.value, l1.value, l2.value, l3.value, l4.value, l5.value]

  const hexagram = hexagramFromLines(lines)
  return { hexagram, movingLines, lineValues }
}

