import type { LinePolarity } from '../domain/types'

export function HexagramGlyph(props: {
  lines: readonly [
    LinePolarity,
    LinePolarity,
    LinePolarity,
    LinePolarity,
    LinePolarity,
    LinePolarity,
  ]
  movingLines?: number[]
  className?: string
}) {
  const moving = new Set(props.movingLines ?? [])

  return (
    <div className={props.className ?? ''} aria-label="Hexagram">
      {/* Render top -> bottom visually */}
      <div className="flex flex-col gap-2">
        {[5, 4, 3, 2, 1, 0].map((i) => {
          const line = props.lines[i]!
          const isMoving = moving.has(i)
          const base =
            'h-2 rounded-sm transition-shadow ' +
            (isMoving
              ? 'bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.55)]'
              : 'bg-white/85')

          if (line === 'yang') {
            return <div key={i} className={base} />
          }

          return (
            <div key={i} className="flex gap-2">
              <div className={'flex-1 ' + base} />
              <div className={'flex-1 ' + base} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

