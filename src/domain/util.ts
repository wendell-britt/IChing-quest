export function newId(prefix: string): string {
  try {
    return `${prefix}_${crypto.randomUUID()}`
  } catch {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
  }
}

export function formatShortTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

