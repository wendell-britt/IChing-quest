import type { BAR, DrawMethod } from './types'
import { drawHexagramByCoins } from './iChing'
import { newId } from './util'

export function createBar(method: DrawMethod = 'quick'): BAR {
  const draw = drawHexagramByCoins()
  return {
    id: newId('bar'),
    createdAt: Date.now(),
    method,
    hexagram: draw.hexagram,
    movingLines: draw.movingLines,
  }
}

