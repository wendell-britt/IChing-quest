import { useEffect, useMemo, useState } from 'react'
import { ARCHETYPE_LIST, archetypeForTrigram } from './domain/archetypes'
import { createBar } from './domain/bars'
import type { ArtifactStateV1, StoryMoment } from './domain/types'
import { clearState, defaultState, loadState, saveState } from './domain/storage'
import { STORY_MOMENT_META, STORY_MOMENTS, mintQuestFromBar } from './domain/quests'
import { HexagramGlyph } from './components/HexagramGlyph'
import { formatShortTime } from './domain/util'
import { TRIGRAMS } from './domain/trigrams'
import { DEFAULT_MOVE_TYPE, MOVE_TYPE_META, MOVE_TYPES } from './domain/moves'
import { trigramForKotterStage } from './domain/kotter'

export default function App() {
  const [state, setState] = useState<ArtifactStateV1>(() => loadState())
  const [selectedBarId, setSelectedBarId] = useState<string | null>(() => state.bars[0]?.id ?? null)
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(() => state.quests[0]?.id ?? null)

  const selectedBar = useMemo(
    () => state.bars.find((b) => b.id === selectedBarId) ?? null,
    [state.bars, selectedBarId],
  )
  const selectedQuest = useMemo(
    () => state.quests.find((q) => q.id === selectedQuestId) ?? null,
    [state.quests, selectedQuestId],
  )

  const [archetypeId, setArchetypeId] = useState<string>(() => {
    const b = state.bars[0]
    return b ? archetypeForTrigram(b.hexagram.lower).id : ARCHETYPE_LIST[0]!.id
  })
  const [storyMoment, setStoryMoment] = useState<StoryMoment>('URGENCY')
  const [moveType, setMoveType] = useState(() => DEFAULT_MOVE_TYPE)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    if (!selectedBar) return
    setArchetypeId(archetypeForTrigram(selectedBar.hexagram.lower).id)
  }, [selectedBar?.id]) // intentional: react when bar changes

  function drawBar() {
    const bar = createBar('quick')
    setState((s) => ({ ...s, bars: [bar, ...s.bars] }))
    setSelectedBarId(bar.id)
    setSelectedQuestId(null)
    setArchetypeId(archetypeForTrigram(bar.hexagram.lower).id)
  }

  function mintQuest() {
    if (!selectedBar) return
    const quest = mintQuestFromBar({ bar: selectedBar, archetypeId, storyMoment, moveType })
    setState((s) => ({ ...s, quests: [quest, ...s.quests] }))
    setSelectedQuestId(quest.id)
  }

  function redeemQuest(questId: string) {
    setState((s) => {
      const q = s.quests.find((x) => x.id === questId)
      if (!q || q.redeemedAt) return s
      return {
        ...s,
        vibeulons: s.vibeulons + q.rewardVibeulons,
        quests: s.quests.map((x) => (x.id === questId ? { ...x, redeemedAt: Date.now() } : x)),
      }
    })
  }

  function updateBar(barId: string, patch: Partial<ArtifactStateV1['bars'][number]>) {
    setState((s) => ({
      ...s,
      bars: s.bars.map((b) => (b.id === barId ? { ...b, ...patch } : b)),
    }))
  }

  function resetAll() {
    clearState()
    setState(defaultState())
    setSelectedBarId(null)
    setSelectedQuestId(null)
    setArchetypeId(ARCHETYPE_LIST[0]!.id)
    setStoryMoment('URGENCY')
  }

  return (
    <div className="grain scanlines min-h-screen">
      <div className="flicker mx-auto max-w-6xl px-5 py-10">
        <header className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.75)]" />
            <p className="text-xs uppercase tracking-[0.32em] text-white/70">
              Party Artifact // Orientation Terminal
            </p>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            I Ching → BAR → QUEST
          </h1>
          <p className="max-w-2xl text-sm text-white/70">
            Draw a hexagram. Bottle it as a BAR. Mint it into a QUEST you can redeem for vibeulons.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80">
              Vibeulons: <span className="font-semibold text-emerald-200">{state.vibeulons}</span>
            </div>
            <button
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
              onClick={resetAll}
              type="button"
            >
              Factory Reset
            </button>
          </div>
        </header>

        <main className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur">
            <h2 className="text-sm font-medium tracking-wide text-white/90">Hexagram Drawer</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="rounded-xl bg-emerald-400/90 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_22px_rgba(52,211,153,0.35)] hover:bg-emerald-300"
                onClick={drawBar}
                type="button"
              >
                Draw Hexagram
              </button>
              <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70">
                3-coin method simulated · moving lines glow
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[auto,1fr]">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                {selectedBar ? (
                  <HexagramGlyph
                    lines={selectedBar.hexagram.lines}
                    movingLines={selectedBar.movingLines}
                    className="w-44"
                  />
                ) : (
                  <div className="text-xs text-white/60">No BAR selected.</div>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                {selectedBar ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-semibold text-white/90">{selectedBar.hexagram.label}</div>
                    <div className="text-xs text-white/60">
                      Pattern #{selectedBar.hexagram.id} · bits {selectedBar.hexagram.bits} · BAR{' '}
                      {formatShortTime(selectedBar.createdAt)}
                    </div>
                    <div className="text-xs text-white/70">
                      Upper: {TRIGRAMS[selectedBar.hexagram.upper].glyph} {TRIGRAMS[selectedBar.hexagram.upper].name} ·
                      Lower: {TRIGRAMS[selectedBar.hexagram.lower].glyph} {TRIGRAMS[selectedBar.hexagram.lower].name}
                    </div>
                    <div className="text-xs text-white/70">
                      Moving lines: {selectedBar.movingLines.length ? selectedBar.movingLines.map((i) => i + 1).join(', ') : 'none'}
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] uppercase tracking-[0.22em] text-white/50">Operator label</span>
                        <input
                          value={selectedBar.playerLabel ?? ''}
                          onChange={(e) => updateBar(selectedBar.id, { playerLabel: e.target.value })}
                          placeholder="ex: MOTH-17"
                          className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/85 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] uppercase tracking-[0.22em] text-white/50">BAR note</span>
                        <input
                          value={selectedBar.note ?? ''}
                          onChange={(e) => updateBar(selectedBar.id, { note: e.target.value })}
                          placeholder="what did the room feel like?"
                          className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/85 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </label>
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      This BAR is a bottle of the moment. Mint it into a quest when you’re ready.
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-white/70">
                    Draw a hexagram to create your first BAR.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 text-xs uppercase tracking-[0.26em] text-white/50">BAR Vault</div>
              <div className="max-h-56 overflow-auto rounded-xl border border-white/10 bg-black/20">
                {state.bars.length === 0 ? (
                  <div className="p-3 text-sm text-white/60">No BARs yet.</div>
                ) : (
                  <ul className="divide-y divide-white/10">
                    {state.bars.map((b) => {
                      const active = b.id === selectedBarId
                      return (
                        <li key={b.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedBarId(b.id)}
                            className={
                              'flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-white/5 ' +
                              (active ? 'bg-white/5' : '')
                            }
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm text-white/85">{b.hexagram.label}</div>
                              <div className="text-xs text-white/50">
                                #{b.hexagram.id} · {formatShortTime(b.createdAt)} · moves{' '}
                                {b.movingLines.length}
                              </div>
                            </div>
                            <div className="text-xs text-white/50">BAR</div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur">
            <h2 className="text-sm font-medium tracking-wide text-white/90">Quest Mint</h2>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs uppercase tracking-[0.26em] text-white/50">Archetype</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {ARCHETYPE_LIST.map((a) => {
                  const active = a.id === archetypeId
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setArchetypeId(a.id)}
                      className={
                        'rounded-full border px-3 py-1 text-xs transition-colors ' +
                        (active
                          ? 'border-emerald-300/60 bg-emerald-400/15 text-emerald-100'
                          : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10')
                      }
                      title={a.vibe}
                    >
                      {a.name}
                    </button>
                  )
                })}
              </div>
              <div className="mt-3 text-xs text-white/60">
                Calibration wizard (future): players will be able to tune these over time.
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs uppercase tracking-[0.26em] text-white/50">Story Moment</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {STORY_MOMENTS.map((m) => {
                  const active = m === storyMoment
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setStoryMoment(m)}
                      className={
                        'rounded-full border px-3 py-1 text-xs transition-colors ' +
                        (active
                          ? 'border-fuchsia-300/60 bg-fuchsia-400/15 text-fuchsia-100'
                          : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10')
                      }
                      title={STORY_MOMENT_META[m].hint}
                    >
                      {STORY_MOMENT_META[m].label}
                    </button>
                  )
                })}
              </div>
              <div className="mt-3 text-xs text-white/60">{STORY_MOMENT_META[storyMoment].hint}</div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                  Kotter trigram anchor:{' '}
                  <span className="font-semibold text-white/90">
                    {TRIGRAMS[trigramForKotterStage(storyMoment)].glyph}{' '}
                    {TRIGRAMS[trigramForKotterStage(storyMoment)].name}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs uppercase tracking-[0.26em] text-white/50">Move Type</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {MOVE_TYPES.map((m) => {
                  const active = m === moveType
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMoveType(m)}
                      className={
                        'rounded-full border px-3 py-1 text-xs transition-colors ' +
                        (active
                          ? 'border-emerald-300/60 bg-emerald-400/15 text-emerald-100'
                          : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10')
                      }
                      title={MOVE_TYPE_META[m].flavor}
                    >
                      {MOVE_TYPE_META[m].label}
                    </button>
                  )
                })}
              </div>
              <div className="mt-3 text-xs text-white/60">{MOVE_TYPE_META[moveType].flavor}</div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                className={
                  'rounded-xl px-4 py-2 text-sm font-semibold shadow ' +
                  (selectedBar
                    ? 'bg-fuchsia-400/90 text-black hover:bg-fuchsia-300'
                    : 'cursor-not-allowed bg-white/10 text-white/40')
                }
                onClick={mintQuest}
                type="button"
                disabled={!selectedBar}
              >
                Mint QUEST
              </button>
              <div className="text-xs text-white/60">
                Uses hexagram + archetype + party period to output a Mario-Party-ish minigame.
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 text-xs uppercase tracking-[0.26em] text-white/50">Quest Ledger</div>
              <div className="max-h-56 overflow-auto rounded-xl border border-white/10 bg-black/20">
                {state.quests.length === 0 ? (
                  <div className="p-3 text-sm text-white/60">No quests minted yet.</div>
                ) : (
                  <ul className="divide-y divide-white/10">
                    {state.quests.map((q) => {
                      const active = q.id === selectedQuestId
                      return (
                        <li key={q.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedQuestId(q.id)}
                            className={
                              'flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-white/5 ' +
                              (active ? 'bg-white/5' : '')
                            }
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm text-white/85">
                                {q.title}{' '}
                                {q.redeemedAt ? (
                                  <span className="text-emerald-200/80">(redeemed)</span>
                                ) : null}
                              </div>
                              <div className="text-xs text-white/50">
                                +{q.rewardVibeulons} vibeulons · {formatShortTime(q.createdAt)}
                              </div>
                            </div>
                            <div className="text-xs text-white/50">QUEST</div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>

            {selectedQuest ? (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white/90">{selectedQuest.title}</div>
                    <div className="mt-1 text-xs text-white/60">Redeem for vibeulons when complete.</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedQuest.moveType ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/75">
                          {MOVE_TYPE_META[selectedQuest.moveType].label}
                        </span>
                      ) : null}
                      {selectedQuest.mode ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/75">
                          Mode: {selectedQuest.mode.replaceAll('_', ' ')}
                        </span>
                      ) : null}
                      {typeof selectedQuest.durationSeconds === 'number' ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/75">
                          Timer: {Math.round(selectedQuest.durationSeconds / 60)}m
                          {selectedQuest.durationSeconds % 60 ? ` ${selectedQuest.durationSeconds % 60}s` : ''}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => redeemQuest(selectedQuest.id)}
                    disabled={Boolean(selectedQuest.redeemedAt)}
                    className={
                      'rounded-lg px-3 py-2 text-xs font-semibold ' +
                      (selectedQuest.redeemedAt
                        ? 'cursor-not-allowed bg-white/10 text-white/40'
                        : 'bg-emerald-400/90 text-black hover:bg-emerald-300')
                    }
                  >
                    Redeem +{selectedQuest.rewardVibeulons}
                  </button>
                </div>

                <div className="mt-3 text-sm text-white/80">
                  {selectedQuest.prompt.split('**').map((chunk, idx) =>
                    idx % 2 === 1 ? (
                      <span key={idx} className="font-semibold text-white/95">
                        {chunk}
                      </span>
                    ) : (
                      <span key={idx}>{chunk}</span>
                    ),
                  )}
                </div>

                {selectedQuest.setup?.length ? (
                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-[0.26em] text-white/50">Setup</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
                      {selectedQuest.setup.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.26em] text-white/50">Rules</div>
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-white/80">
                    {selectedQuest.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>

                {selectedQuest.winCondition ? (
                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-[0.26em] text-white/50">Win condition</div>
                    <div className="mt-2 text-sm text-white/80">{selectedQuest.winCondition}</div>
                  </div>
                ) : null}

                {selectedQuest.scoring?.length ? (
                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-[0.26em] text-white/50">Scoring</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
                      {selectedQuest.scoring.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">
                Select a quest to view details.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

