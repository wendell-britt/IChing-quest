import type { ArtifactStateV1 } from './types'

const STORAGE_KEY = 'iching_artifact_state_v1'

export function defaultState(): ArtifactStateV1 {
  return { version: 1, bars: [], quests: [], vibeulons: 0 }
}

export function loadState(): ArtifactStateV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<ArtifactStateV1>
    if (parsed?.version !== 1) return defaultState()
    return {
      version: 1,
      bars: Array.isArray(parsed.bars) ? (parsed.bars as any) : [],
      quests: Array.isArray(parsed.quests) ? (parsed.quests as any) : [],
      vibeulons: typeof parsed.vibeulons === 'number' ? parsed.vibeulons : 0,
    }
  } catch {
    return defaultState()
  }
}

export function saveState(state: ArtifactStateV1) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

