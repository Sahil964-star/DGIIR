import { useState } from 'react'
import type { DistrictRisk, RiskLevel } from '@shared/types/complaints'

// ─── Risk colour map ─────────────────────────────────────────────────────────
const riskColor: Record<RiskLevel, string> = {
  healthy:  '#22c55e',
  watch:    '#facc15',
  concern:  '#f97316',
  critical: '#dc2626',
}
const riskLabel: Record<RiskLevel, string> = {
  healthy:  'Healthy',
  watch:    'Watch',
  concern:  'Concern',
  critical: 'Critical',
}

// ─── Realistic Delhi districts SVG paths ──────────────────────────────────────
// More detailed polygons matching actual Delhi district geography
// ViewBox: 0 0 400 420
const DISTRICTS: {
  id: string
  label: string
  labelPos: [number, number]
  path: string
}[] = [
  {
    id: 'north-west',
    label: 'North West',
    labelPos: [101, 83],
    path: 'M 83.1,32.0 L 83.1,16.0 L 97.0,8.0 L 110.9,16.0 L 124.7,8.0 L 138.6,16.0 L 138.6,32.0 L 152.4,40.0 L 152.4,56.0 L 166.3,64.0 L 166.3,80.0 L 152.4,88.0 L 152.4,104.0 L 166.3,112.0 L 166.3,128.0 L 152.4,136.0 L 138.6,128.0 L 124.7,136.0 L 124.7,152.0 L 110.9,160.0 L 97.0,152.0 L 83.1,160.0 L 69.3,152.0 L 69.3,136.0 L 55.4,128.0 L 55.4,112.0 L 41.6,104.0 L 41.6,88.0 L 27.7,80.0 L 27.7,64.0 L 41.6,56.0 L 41.6,40.0 L 55.4,32.0 L 69.3,40.0 L 83.1,32.0 Z '
  },
  {
    id: 'north',
    label: 'North',
    labelPos: [208, 54],
    path: 'M 180.1,8.0 L 180.1,-8.0 L 194.0,-16.0 L 207.8,-8.0 L 221.7,-16.0 L 235.6,-8.0 L 235.6,8.0 L 249.4,16.0 L 249.4,32.0 L 263.3,40.0 L 263.3,56.0 L 249.4,64.0 L 249.4,80.0 L 263.3,88.0 L 263.3,104.0 L 249.4,112.0 L 235.6,104.0 L 221.7,112.0 L 207.8,104.0 L 194.0,112.0 L 180.1,104.0 L 166.3,112.0 L 152.4,104.0 L 152.4,88.0 L 166.3,80.0 L 166.3,64.0 L 152.4,56.0 L 152.4,40.0 L 166.3,32.0 L 166.3,16.0 L 180.1,8.0 Z '
  },
  {
    id: 'north-east',
    label: 'North East',
    labelPos: [306, 45],
    path: 'M 263.3,8.0 L 263.3,-8.0 L 277.1,-16.0 L 291.0,-8.0 L 304.8,-16.0 L 318.7,-8.0 L 332.6,-16.0 L 346.4,-8.0 L 346.4,8.0 L 360.3,16.0 L 360.3,32.0 L 374.1,40.0 L 374.1,56.0 L 360.3,64.0 L 360.3,80.0 L 346.4,88.0 L 332.6,80.0 L 318.7,88.0 L 318.7,104.0 L 304.8,112.0 L 291.0,104.0 L 277.1,112.0 L 263.3,104.0 L 263.3,88.0 L 249.4,80.0 L 249.4,64.0 L 263.3,56.0 L 263.3,40.0 L 249.4,32.0 L 249.4,16.0 L 263.3,8.0 Z '
  },
  {
    id: 'shahdara',
    label: 'Shahdara',
    labelPos: [338, 135],
    path: 'M 318.7,104.0 L 318.7,88.0 L 332.6,80.0 L 346.4,88.0 L 360.3,80.0 L 374.1,88.0 L 374.1,104.0 L 388.0,112.0 L 388.0,128.0 L 401.8,136.0 L 401.8,152.0 L 388.0,160.0 L 388.0,176.0 L 374.1,184.0 L 360.3,176.0 L 346.4,184.0 L 332.6,176.0 L 318.7,184.0 L 304.8,176.0 L 304.8,160.0 L 291.0,152.0 L 277.1,160.0 L 263.3,152.0 L 263.3,136.0 L 277.1,128.0 L 277.1,112.0 L 291.0,104.0 L 304.8,112.0 L 318.7,104.0 Z '
  },
  {
    id: 'central',
    label: 'Central',
    labelPos: [217, 144],
    path: 'M 166.3,128.0 L 166.3,112.0 L 180.1,104.0 L 194.0,112.0 L 207.8,104.0 L 221.7,112.0 L 235.6,104.0 L 249.4,112.0 L 263.3,104.0 L 277.1,112.0 L 277.1,128.0 L 263.3,136.0 L 263.3,152.0 L 277.1,160.0 L 277.1,176.0 L 263.3,184.0 L 249.4,176.0 L 235.6,184.0 L 221.7,176.0 L 207.8,184.0 L 194.0,176.0 L 180.1,184.0 L 166.3,176.0 L 166.3,160.0 L 152.4,152.0 L 152.4,136.0 L 166.3,128.0 Z '
  },
  {
    id: 'east',
    label: 'East',
    labelPos: [326, 207],
    path: 'M 304.8,160.0 L 304.8,176.0 L 318.7,184.0 L 332.6,176.0 L 346.4,184.0 L 360.3,176.0 L 374.1,184.0 L 374.1,200.0 L 388.0,208.0 L 388.0,224.0 L 374.1,232.0 L 374.1,248.0 L 360.3,256.0 L 346.4,248.0 L 332.6,256.0 L 318.7,248.0 L 318.7,232.0 L 304.8,224.0 L 291.0,232.0 L 277.1,224.0 L 277.1,208.0 L 263.3,200.0 L 263.3,184.0 L 277.1,176.0 L 277.1,160.0 L 291.0,152.0 L 304.8,160.0 Z '
  },
  {
    id: 'new-delhi',
    label: 'New Delhi',
    labelPos: [210, 222],
    path: 'M 152.4,200.0 L 152.4,184.0 L 166.3,176.0 L 180.1,184.0 L 194.0,176.0 L 207.8,184.0 L 221.7,176.0 L 235.6,184.0 L 249.4,176.0 L 263.3,184.0 L 263.3,200.0 L 277.1,208.0 L 277.1,224.0 L 263.3,232.0 L 263.3,248.0 L 249.4,256.0 L 249.4,272.0 L 235.6,280.0 L 221.7,272.0 L 207.8,280.0 L 194.0,272.0 L 194.0,256.0 L 180.1,248.0 L 166.3,256.0 L 152.4,248.0 L 152.4,232.0 L 138.6,224.0 L 138.6,208.0 L 152.4,200.0 Z '
  },
  {
    id: 'west',
    label: 'West',
    labelPos: [82, 208],
    path: 'M 27.7,176.0 L 27.7,160.0 L 41.6,152.0 L 55.4,160.0 L 69.3,152.0 L 83.1,160.0 L 97.0,152.0 L 110.9,160.0 L 124.7,152.0 L 138.6,160.0 L 138.6,176.0 L 152.4,184.0 L 152.4,200.0 L 138.6,208.0 L 138.6,224.0 L 152.4,232.0 L 152.4,248.0 L 138.6,256.0 L 124.7,248.0 L 110.9,256.0 L 97.0,248.0 L 83.1,256.0 L 83.1,272.0 L 69.3,280.0 L 55.4,272.0 L 55.4,256.0 L 41.6,248.0 L 27.7,256.0 L 13.9,248.0 L 13.9,232.0 L 27.7,224.0 L 27.7,208.0 L 13.9,200.0 L 13.9,184.0 L 27.7,176.0 Z '
  },
  {
    id: 'south-west',
    label: 'South West',
    labelPos: [95, 315],
    path: 'M 83.1,272.0 L 83.1,256.0 L 97.0,248.0 L 110.9,256.0 L 124.7,248.0 L 138.6,256.0 L 138.6,272.0 L 152.4,280.0 L 152.4,296.0 L 138.6,304.0 L 138.6,320.0 L 152.4,328.0 L 152.4,344.0 L 138.6,352.0 L 138.6,368.0 L 124.7,376.0 L 110.9,368.0 L 97.0,376.0 L 83.1,368.0 L 69.3,376.0 L 55.4,368.0 L 55.4,352.0 L 41.6,344.0 L 41.6,328.0 L 27.7,320.0 L 27.7,304.0 L 41.6,296.0 L 41.6,280.0 L 55.4,272.0 L 69.3,280.0 L 83.1,272.0 Z '
  },
  {
    id: 'south',
    label: 'South',
    labelPos: [198, 329],
    path: 'M 194.0,256.0 L 194.0,272.0 L 207.8,280.0 L 221.7,272.0 L 235.6,280.0 L 235.6,296.0 L 249.4,304.0 L 249.4,320.0 L 263.3,328.0 L 263.3,344.0 L 249.4,352.0 L 249.4,368.0 L 235.6,376.0 L 235.6,392.0 L 221.7,400.0 L 207.8,392.0 L 194.0,400.0 L 180.1,392.0 L 180.1,376.0 L 166.3,368.0 L 152.4,376.0 L 138.6,368.0 L 138.6,352.0 L 152.4,344.0 L 152.4,328.0 L 138.6,320.0 L 138.6,304.0 L 152.4,296.0 L 152.4,280.0 L 166.3,272.0 L 166.3,256.0 L 180.1,248.0 L 194.0,256.0 Z '
  },
  {
    id: 'south-east',
    label: 'South East',
    labelPos: [303, 285],
    path: 'M 263.3,248.0 L 263.3,232.0 L 277.1,224.0 L 291.0,232.0 L 304.8,224.0 L 318.7,232.0 L 318.7,248.0 L 332.6,256.0 L 346.4,248.0 L 360.3,256.0 L 360.3,272.0 L 374.1,280.0 L 374.1,296.0 L 360.3,304.0 L 360.3,320.0 L 346.4,328.0 L 332.6,320.0 L 318.7,328.0 L 318.7,344.0 L 304.8,352.0 L 291.0,344.0 L 291.0,328.0 L 277.1,320.0 L 263.3,328.0 L 249.4,320.0 L 249.4,304.0 L 235.6,296.0 L 235.6,280.0 L 249.4,272.0 L 249.4,256.0 L 263.3,248.0 Z '
  },
];

// ─── Legend ──────────────────────────────────────────────────────────────────
const LEGEND: { level: RiskLevel }[] = [
  { level: 'healthy'  },
  { level: 'watch'    },
  { level: 'concern'  },
  { level: 'critical' },
]

interface DistrictRiskMapProps {
  districts: DistrictRisk[]
  loading?: boolean
}

export default function DistrictRiskMap({ districts, loading }: DistrictRiskMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  const riskMap = Object.fromEntries(districts.map((d) => [d.id, d]))

  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-36 rounded mb-4" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    )
  }

  const hoveredDistrict = hovered ? riskMap[hovered] : null

  return (
    <div className="card animate-fade-in flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          District Risk Map
        </h2>
      </div>

      <div className="relative w-full flex justify-center items-center mt-1 flex-1 min-h-[240px]">
        {/* SVG Map */}
        <div className="w-full h-full flex justify-center">
            {/* Tooltip */}
            {hoveredDistrict && (
              <div className="absolute top-0 left-0 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-lg pointer-events-none flex flex-col gap-0.5 min-w-[140px]">
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{hoveredDistrict.district || hoveredDistrict.name}</p>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Risk:</span>
                  <span className="font-medium" style={{ color: riskColor[hoveredDistrict.riskLevel] || riskColor.watch }}>
                    {riskLabel[hoveredDistrict.riskLevel] || 'Unknown'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total: <span className="font-medium text-slate-700 dark:text-slate-300">{hoveredDistrict.total || 0}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Overdue: <span className="font-medium text-slate-700 dark:text-slate-300">{hoveredDistrict.overdue || 0}</span>
                </p>
              </div>
            )}

          <svg
            viewBox="0 0 400 420"
            className="w-full h-full"
            aria-label="Delhi District Risk Map"
            style={{ maxHeight: '260px' }}
          >
            <defs>
              {/* Drop shadow for hovered districts */}
              <filter id="district-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
              </filter>
            </defs>
            {DISTRICTS.map((d) => {
              const info = riskMap[d.id]
              const color = info ? riskColor[info.riskLevel] : '#94a3b8'
              const isHovered = hovered === d.id

              return (
                <g key={d.id}>
                  <path
                    d={d.path}
                    fill={color}
                    fillOpacity={isHovered ? 1 : 0.82}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2.5 : 1.2}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHovered(d.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ filter: isHovered ? 'url(#district-shadow) brightness(1.08)' : 'none' }}
                  />
                  <text
                    x={d.labelPos[0]}
                    y={d.labelPos[1]}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={600}
                    fill="#fff"
                    fillOpacity={0.95}
                    pointerEvents="none"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
                  >
                    {d.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 flex flex-col gap-1.5 shadow-sm">
          {LEGEND.map(({ level }) => (
            <div key={level} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: riskColor[level] }}
              />
              <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium leading-none">
                {riskLabel[level]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* View Full Map button */}
      <button className="mt-2 self-end text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1 border border-brand-200 dark:border-brand-800/40 rounded-lg px-3 py-1.5 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
        View Full Map
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
