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

// ─── Delhi districts SVG paths (approximate schematic polygons) ───────────────
// Coordinate space: 0-400 x 0-380 (viewBox)
const DISTRICTS: {
  id: string
  label: string
  labelPos: [number, number]
  path: string
}[] = [
  {
    id: 'north-west',
    label: 'North West',
    labelPos: [90, 75],
    path: 'M 20 30 L 130 20 L 160 60 L 140 110 L 80 120 L 20 90 Z',
  },
  {
    id: 'north',
    label: 'North',
    labelPos: [200, 55],
    path: 'M 130 20 L 240 15 L 260 65 L 200 90 L 160 60 Z',
  },
  {
    id: 'north-east',
    label: 'North East',
    labelPos: [300, 70],
    path: 'M 240 15 L 360 25 L 370 90 L 290 110 L 260 65 Z',
  },
  {
    id: 'east',
    label: 'East',
    labelPos: [308, 145],
    path: 'M 290 110 L 370 90 L 380 180 L 310 190 L 280 155 Z',
  },
  {
    id: 'shahdara',
    label: 'Shahdara',
    labelPos: [315, 220],
    path: 'M 310 190 L 380 180 L 375 265 L 305 260 Z',
  },
  {
    id: 'central',
    label: 'Central',
    labelPos: [195, 125],
    path: 'M 160 100 L 200 90 L 260 65 L 290 110 L 280 155 L 220 165 L 175 155 L 155 130 Z',
  },
  {
    id: 'new-delhi',
    label: 'New Delhi',
    labelPos: [155, 185],
    path: 'M 120 150 L 175 155 L 175 210 L 120 215 Z',
  },
  {
    id: 'west',
    label: 'West',
    labelPos: [90, 160],
    path: 'M 20 90 L 80 120 L 120 150 L 120 215 L 70 230 L 20 200 Z',
  },
  {
    id: 'south-west',
    label: 'South West',
    labelPos: [85, 280],
    path: 'M 20 200 L 70 230 L 115 245 L 120 310 L 60 330 L 20 300 Z',
  },
  {
    id: 'south',
    label: 'South',
    labelPos: [205, 290],
    path: 'M 115 245 L 220 240 L 250 270 L 230 340 L 130 355 L 120 310 Z',
  },
  {
    id: 'south-east',
    label: 'South East',
    labelPos: [308, 295],
    path: 'M 250 270 L 305 260 L 375 265 L 365 345 L 270 360 L 230 340 Z',
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
    <div className="card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          District Risk Map — Delhi
        </h2>
        <button className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1">
          View Full Map
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex gap-4">
        {/* SVG Map */}
        <div className="flex-1 relative">
          {/* Tooltip */}
          {hoveredDistrict && (
            <div className="absolute top-2 left-2 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-lg pointer-events-none">
              <p className="text-xs font-bold text-slate-800 dark:text-white">{hoveredDistrict.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{hoveredDistrict.complaintCount} complaints</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: riskColor[hoveredDistrict.riskLevel] }}
                />
                <span className="text-xs font-medium" style={{ color: riskColor[hoveredDistrict.riskLevel] }}>
                  {riskLabel[hoveredDistrict.riskLevel]}
                </span>
              </div>
            </div>
          )}

          <svg
            viewBox="0 0 400 380"
            className="w-full h-auto max-h-60"
            aria-label="Delhi District Risk Map"
          >
            {DISTRICTS.map((d) => {
              const info = riskMap[d.id]
              const color = info ? riskColor[info.riskLevel] : '#94a3b8'
              const isHovered = hovered === d.id

              return (
                <g key={d.id}>
                  <path
                    d={d.path}
                    fill={color}
                    fillOpacity={isHovered ? 1 : 0.75}
                    stroke="#fff"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHovered(d.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ filter: isHovered ? 'brightness(1.15) drop-shadow(0 2px 4px rgba(0,0,0,0.25))' : 'none' }}
                  />
                  <text
                    x={d.labelPos[0]}
                    y={d.labelPos[1]}
                    textAnchor="middle"
                    fontSize={7.5}
                    fontWeight={600}
                    fill="#fff"
                    fillOpacity={0.95}
                    pointerEvents="none"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
                  >
                    {d.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center gap-2.5 pr-1">
          {LEGEND.map(({ level }) => (
            <div key={level} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: riskColor[level] }}
              />
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {riskLabel[level]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
