import { useId } from 'react'
import { CircleCheck, Layers, TriangleAlert } from 'lucide-react'

// Decorative illustrations for featured project cards (hidden from screen readers;
// the card text carries the meaning).

function Pipeline({ project }) {
  const modules = project.modules ?? []
  return (
    <div className="w-full font-mono text-xs">
      <div className="mx-auto w-fit rounded-lg border border-line bg-surface px-3 py-1.5 text-muted">
        Apps
      </div>
      <Connector />
      <div className="rounded-xl border border-accent/40 bg-accent/5 p-3">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-accent">
          <Layers size={12} /> Platform
        </p>
        <ol className="grid grid-cols-2 gap-2">
          {modules.map((name, i) => (
            <li
              key={name}
              className={`flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-2 ${
                i === modules.length - 1 && modules.length % 2 ? 'col-span-2' : ''
              }`}
            >
              <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 leading-tight text-fg">{name}</span>
            </li>
          ))}
        </ol>
      </div>
      <Connector />
      <div className="mx-auto w-fit rounded-lg border border-line bg-surface px-3 py-1.5 text-muted">
        LLM{project.provider ? ` · ${project.provider}` : ''}
      </div>
    </div>
  )
}

function Connector() {
  return (
    <svg className="mx-auto block h-6 w-2 overflow-visible" viewBox="0 0 2 24">
      <line
        x1="1"
        y1="0"
        x2="1"
        y2="24"
        className="stroke-accent motion-safe:animate-flow"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
    </svg>
  )
}

const RULES = [
  { pri: 100, name: 'allow-https-in', port: '443', action: 'Allow', ok: true },
  { pri: 110, name: 'allow-ssh-bastion', port: '22', action: 'Allow', ok: true },
  { pri: 120, name: 'allow-rdp-any', port: '3389', action: 'Allow', ok: false, note: 'source: Any' },
  { pri: 4096, name: 'deny-all-in', port: '*', action: 'Deny', ok: true },
]

function Rules() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line bg-surface font-mono text-[11px] sm:text-xs">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-2 text-muted">nsg-rule-audit</span>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-[3rem_1fr_3rem_4.5rem] gap-x-2 border-b border-line pb-2 text-muted">
          <span>PRI</span>
          <span>NAME</span>
          <span>PORT</span>
          <span>CHECK</span>
        </div>
        {RULES.map((r) => (
          <div
            key={r.name}
            className={`grid grid-cols-[3rem_1fr_3rem_4.5rem] items-center gap-x-2 py-2 ${
              r.ok ? '' : '-mx-3 bg-warn/10 px-3'
            }`}
          >
            <span className="text-muted">{r.pri}</span>
            <span className="truncate text-fg">{r.name}</span>
            <span className="text-muted">{r.port}</span>
            {r.ok ? (
              <span className="flex items-center gap-1 text-ok">
                <CircleCheck size={12} /> pass
              </span>
            ) : (
              <span className="flex items-center gap-1 text-warn">
                <TriangleAlert size={12} /> flag
              </span>
            )}
          </div>
        ))}
        <p className="mt-2 border-t border-line pt-2 text-muted">
          <span className="text-ok">3 passed</span> · <span className="text-warn">1 flagged</span>{' '}
          (allow-rdp-any: source Any)
        </p>
      </div>
    </div>
  )
}

const ACTUAL = [42, 48, 45, 53, 50, 58, 55, 62]
const FORECAST = [62, 66, 63, 70, 68]

function Forecast() {
  const id = useId().replace(/:/g, '')
  const W = 320
  const H = 170
  const pad = { l: 8, r: 8, t: 16, b: 22 }
  const steps = ACTUAL.length + FORECAST.length - 2
  const x = (i) => pad.l + (i / steps) * (W - pad.l - pad.r)
  const y = (v) => pad.t + (1 - (v - 30) / 50) * (H - pad.t - pad.b)
  const path = (pts, offset = 0) =>
    pts.map((v, i) => `${i ? 'L' : 'M'}${x(i + offset).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')

  const start = ACTUAL.length - 1
  const upper = FORECAST.map((v, i) => v + 2 + i * 1.6)
  const lower = FORECAST.map((v, i) => v - 2 - i * 1.6)
  const band =
    upper.map((v, i) => `${i ? 'L' : 'M'}${x(i + start).toFixed(1)} ${y(v).toFixed(1)}`).join(' ') +
    ' ' +
    lower
      .map((v, i) => [i, v])
      .reverse()
      .map(([i, v]) => `L${x(i + start).toFixed(1)} ${y(v).toFixed(1)}`)
      .join(' ') +
    ' Z'

  return (
    <div className="w-full rounded-xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between font-mono text-[11px] text-muted">
        <span>Store demand · weekly</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-3 bg-fg/70" /> actual
          </span>
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-3 border-t-2 border-dashed border-accent" /> forecast
          </span>
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full">
        <defs>
          <linearGradient id={`${id}-area`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" className="[stop-color:rgb(var(--c-fg))]" stopOpacity="0.12" />
            <stop offset="1" className="[stop-color:rgb(var(--c-fg))]" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((g) => (
          <line
            key={g}
            x1={pad.l}
            x2={W - pad.r}
            y1={pad.t + (g * (H - pad.t - pad.b)) / 3}
            y2={pad.t + (g * (H - pad.t - pad.b)) / 3}
            className="stroke-line"
            strokeDasharray="2 4"
          />
        ))}
        <line
          x1={x(start)}
          x2={x(start)}
          y1={pad.t - 6}
          y2={H - pad.b}
          className="stroke-muted"
          strokeOpacity="0.5"
          strokeDasharray="3 3"
        />
        <text x={x(start) + 4} y={pad.t - 2} className="fill-muted font-mono text-[9px]">
          today
        </text>
        <path
          d={`${path(ACTUAL)} L${x(start)} ${H - pad.b} L${x(0)} ${H - pad.b} Z`}
          fill={`url(#${id}-area)`}
        />
        <path d={band} className="fill-accent" fillOpacity="0.14" />
        <path d={path(ACTUAL)} className="stroke-fg" strokeOpacity="0.7" strokeWidth="2" fill="none" />
        <path
          d={path(FORECAST, start)}
          className="stroke-accent"
          strokeWidth="2"
          strokeDasharray="5 4"
          fill="none"
        />
        <circle cx={x(start)} cy={y(ACTUAL[start])} r="3.5" className="fill-accent" />
      </svg>
    </div>
  )
}

const VISUALS = { pipeline: Pipeline, rules: Rules, forecast: Forecast }

export default function ProjectVisual({ project }) {
  const Visual = VISUALS[project.visual]
  if (!Visual) return null
  return (
    <div aria-hidden className="w-full">
      <Visual project={project} />
    </div>
  )
}
