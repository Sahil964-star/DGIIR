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
    labelPos: [105, 85],
    path: 'M 85,25 C 90,22 98,20 110,22 L 128,18 C 135,17 142,18 150,20 L 158,22 C 162,25 165,30 165,38 L 168,55 C 170,65 170,75 168,85 L 165,100 C 163,110 160,118 155,125 L 148,138 C 143,148 140,155 138,165 L 132,178 C 128,185 122,190 115,193 L 100,198 C 92,198 85,196 78,190 L 65,182 C 55,178 45,175 36,172 L 22,165 C 18,158 16,150 18,140 L 22,125 C 25,115 25,105 23,95 L 22,82 C 23,70 28,60 38,52 L 55,40 C 65,33 75,28 85,25 Z'
  },
  {
    id: 'north',
    label: 'North',
    labelPos: [210, 55],
    path: 'M 158,22 L 175,18 C 185,18 195,20 205,22 L 218,20 C 228,18 238,18 248,20 L 260,25 C 265,30 268,38 265,48 L 262,62 C 260,72 260,80 262,90 L 265,102 C 262,108 256,112 248,115 L 232,120 C 222,122 212,126 205,132 L 190,138 C 180,138 172,135 165,130 L 155,125 C 158,118 162,110 165,100 L 168,85 C 170,75 170,65 168,55 L 165,38 C 165,30 162,25 158,22 Z'
  },
  {
    id: 'north-east',
    label: 'North East',
    labelPos: [305, 58],
    path: 'M 260,25 L 278,22 C 288,22 298,25 308,30 L 318,38 C 322,45 325,55 325,65 L 328,80 C 330,88 332,95 338,100 L 345,108 C 342,115 335,118 325,118 L 310,115 C 300,112 290,108 282,102 L 270,96 C 265,92 262,88 262,82 L 262,72 C 260,72 260,80 262,90 L 265,102 C 262,108 256,112 248,115 L 242,108 C 248,98 252,88 255,78 L 258,65 C 260,55 260,45 258,38 L 260,25 Z'
  },
  {
    id: 'shahdara',
    label: 'Shahdara',
    labelPos: [325, 135],
    path: 'M 265,102 L 270,96 C 282,102 290,108 300,112 L 310,115 C 320,118 330,118 338,118 L 345,108 C 348,118 352,128 355,140 L 358,155 C 360,168 360,178 358,188 L 355,195 C 348,198 340,198 330,195 L 315,190 C 305,185 298,178 290,172 L 278,162 C 272,155 268,148 268,140 L 268,128 C 268,118 266,110 265,102 Z'
  },
  {
    id: 'central',
    label: 'Central',
    labelPos: [215, 150],
    path: 'M 165,130 L 190,138 C 200,132 210,126 222,122 L 248,115 C 256,112 262,108 265,102 L 268,118 C 270,128 272,138 275,148 L 278,162 C 275,168 270,172 265,175 L 252,180 C 242,182 232,184 222,184 L 210,185 C 200,188 192,195 185,200 L 175,198 C 165,195 155,190 148,185 L 140,205 C 142,195 146,185 148,178 L 148,165 C 143,155 140,148 138,140 L 138,130 C 145,128 155,128 165,130 Z'
  },
  {
    id: 'east',
    label: 'East',
    labelPos: [318, 205],
    path: 'M 268,140 C 268,148 272,155 278,162 L 290,172 C 298,178 305,185 315,190 L 330,195 C 340,198 348,198 355,195 L 358,188 C 358,198 355,210 350,222 L 345,235 C 340,245 335,252 328,258 L 315,265 C 305,268 295,268 288,265 L 280,258 C 278,248 276,238 275,228 L 275,218 C 275,208 272,198 268,190 L 268,175 C 272,168 275,162 278,155 L 268,140 Z'
  },
  {
    id: 'new-delhi',
    label: 'New Delhi',
    labelPos: [215, 210],
    path: 'M 140,205 L 148,185 C 155,190 165,195 175,198 L 185,200 C 192,195 200,188 210,185 L 222,184 C 232,184 242,182 252,180 L 265,175 C 270,172 275,168 278,162 L 278,175 C 275,182 272,190 270,198 L 268,210 C 268,220 268,228 270,238 L 275,248 C 270,255 262,258 252,258 L 238,255 C 228,252 218,248 210,245 L 198,252 C 188,255 178,255 168,252 L 155,248 C 150,242 145,235 142,225 L 140,215 Z'
  },
  {
    id: 'west',
    label: 'West',
    labelPos: [82, 210],
    path: 'M 22,165 L 36,172 C 45,175 55,178 65,182 L 78,190 C 85,196 92,198 100,198 L 115,193 C 122,190 128,185 132,178 L 138,165 C 138,175 140,185 142,195 L 140,205 C 140,215 142,225 145,235 L 155,248 C 148,252 140,255 130,258 L 118,260 C 108,258 100,252 92,245 L 80,235 C 72,228 65,225 55,228 L 42,232 C 32,232 24,228 18,222 L 15,210 C 14,200 15,190 18,180 L 22,165 Z'
  },
  {
    id: 'south-west',
    label: 'South West',
    labelPos: [105, 310],
    path: 'M 18,222 L 42,232 C 55,228 65,225 72,228 L 80,235 C 92,245 100,252 108,258 L 118,260 C 130,258 140,255 148,252 L 155,248 C 162,252 170,255 178,255 L 198,252 C 210,248 218,245 210,250 L 205,260 C 200,270 198,280 200,290 L 195,300 C 188,308 180,315 172,320 L 160,328 C 152,335 148,342 145,352 L 142,365 C 135,368 125,368 115,365 L 100,360 C 90,355 82,348 75,340 L 65,328 C 58,318 52,310 45,302 L 38,290 C 32,278 30,265 32,252 L 28,240 C 22,232 18,225 18,222 Z'
  },
  {
    id: 'south',
    label: 'South',
    labelPos: [195, 325],
    path: 'M 142,365 L 145,352 C 148,342 152,335 160,328 L 172,320 C 180,315 188,308 195,300 L 200,290 C 198,280 200,270 205,260 L 210,250 C 218,245 228,240 238,238 L 252,238 C 262,238 270,240 278,245 L 288,255 C 292,262 295,272 295,282 L 298,295 C 298,308 295,318 290,328 L 282,340 C 275,348 268,355 260,360 L 248,368 C 238,372 228,375 218,378 L 205,380 C 192,380 180,378 168,372 L 155,365 C 148,368 145,368 142,365 Z'
  },
  {
    id: 'south-east',
    label: 'South East',
    labelPos: [305, 275],
    path: 'M 275,248 C 278,248 280,250 282,252 L 288,255 C 292,262 295,272 295,282 L 298,295 C 298,308 295,318 290,328 L 282,340 C 280,335 278,328 278,320 L 280,308 C 282,298 282,288 280,278 L 278,268 C 276,258 275,252 275,248 Z'
  },
]

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
