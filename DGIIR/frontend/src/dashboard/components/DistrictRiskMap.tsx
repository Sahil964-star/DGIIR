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
// Coordinate space: 0-380 x 0-390 (viewBox)
const DISTRICTS: {
  id: string
  label: string
  labelPos: [number, number]
  path: string
}[] = [
  {
    id: 'north-west',
    label: 'North West',
    labelPos: [100, 80],
    path: 'M 80.0,40.0 L 97.2,35.2 L 114.7,33.2 L 133.0,36.0 L 150.0,30.0 L 153.0,46.7 L 158.5,63.0 L 160.6,79.9 L 159.9,97.4 L 173.4,112.0 L 170.0,130.0 L 164.7,144.3 L 154.8,156.6 L 154.9,173.3 L 144.2,185.2 L 140.0,200.0 L 122.5,202.5 L 108.6,194.2 L 92.2,193.4 L 78.3,185.1 L 62.7,181.8 L 47.9,176.2 L 32.5,172.4 L 20.0,160.0 L 23.0,142.6 L 29.7,125.7 L 27.6,107.5 L 30.0,90.0 L 42.2,77.2 L 52.4,62.4 L 67.4,52.4 Z'
  },
  {
    id: 'north',
    label: 'North',
    labelPos: [200, 60],
    path: 'M 150.0,30.0 L 164.6,24.6 L 180.5,31.6 L 195.7,30.9 L 210.7,29.9 L 224.9,21.1 L 240.0,20.0 L 246.4,34.4 L 246.7,49.7 L 250.1,64.6 L 250.0,80.0 L 253.0,89.8 L 253.6,100.0 L 255.0,110.0 L 238.0,114.2 L 221.1,118.4 L 204.3,123.3 L 188.5,132.3 L 170.0,130.0 L 173.4,112.0 L 159.9,97.4 L 160.6,79.9 L 158.5,63.0 L 153.0,46.7 Z'
  },
  {
    id: 'central',
    label: 'Central',
    labelPos: [210, 145],
    path: 'M 170.0,130.0 L 188.5,132.3 L 204.3,123.3 L 221.1,118.4 L 238.0,114.2 L 255.0,110.0 L 260.2,122.9 L 263.7,136.2 L 265.0,150.0 L 268.3,159.7 L 267.8,170.1 L 270.0,180.0 L 253.6,181.6 L 237.3,183.7 L 220.6,183.4 L 204.2,184.6 L 189.5,197.3 L 172.6,195.7 L 154.8,188.2 L 140.0,200.0 L 144.2,185.2 L 154.9,173.3 L 154.8,156.6 L 164.7,144.3 Z'
  },
  {
    id: 'new-delhi',
    label: 'New Delhi',
    labelPos: [210, 200],
    path: 'M 140.0,200.0 L 154.8,188.2 L 172.6,195.7 L 189.5,197.3 L 204.2,184.6 L 220.6,183.4 L 237.3,183.7 L 253.6,181.6 L 270.0,180.0 L 276.0,192.7 L 276.3,206.8 L 280.0,220.0 L 263.4,228.0 L 244.0,226.5 L 226.7,232.3 L 210.0,240.0 L 194.0,246.9 L 176.3,244.8 L 160.0,250.0 L 152.8,233.6 L 143.2,218.1 Z'
  },
  {
    id: 'west',
    label: 'West',
    labelPos: [80, 190],
    path: 'M 20.0,160.0 L 32.5,172.4 L 47.9,176.2 L 62.7,181.8 L 78.3,185.1 L 92.2,193.4 L 108.6,194.2 L 122.5,202.5 L 140.0,200.0 L 143.2,218.1 L 152.8,233.6 L 160.0,250.0 L 144.5,251.2 L 128.9,252.8 L 114.5,246.6 L 99.0,247.9 L 86.3,230.1 L 68.7,245.3 L 56.2,226.5 L 40.4,229.7 L 25.0,230.0 L 19.5,212.8 L 21.1,195.1 L 16.6,177.8 Z'
  },
  {
    id: 'south-west',
    label: 'South West',
    labelPos: [80, 300],
    path: 'M 25.0,230.0 L 40.4,229.7 L 56.2,226.5 L 68.7,245.3 L 86.3,230.1 L 99.0,247.9 L 114.5,246.6 L 128.9,252.8 L 144.5,251.2 L 160.0,250.0 L 176.3,244.8 L 194.0,246.9 L 210.0,240.0 L 199.6,251.8 L 189.1,263.6 L 193.6,284.1 L 171.5,289.0 L 167.2,304.4 L 158.5,317.2 L 148.8,329.4 L 145.2,345.2 L 140.0,360.0 L 123.1,357.7 L 105.9,357.0 L 90.0,350.0 L 79.6,337.8 L 70.7,324.4 L 59.4,313.0 L 50.0,300.0 L 41.1,283.5 L 41.9,263.4 L 28.6,248.5 Z'
  },
  {
    id: 'south',
    label: 'South',
    labelPos: [180, 310],
    path: 'M 140.0,360.0 L 145.2,345.2 L 148.8,329.4 L 158.5,317.2 L 167.2,304.4 L 171.5,289.0 L 193.6,284.1 L 189.1,263.6 L 199.6,251.8 L 210.0,240.0 L 226.7,232.3 L 244.0,226.5 L 263.4,228.0 L 280.0,220.0 L 286.8,234.3 L 287.8,249.5 L 283.4,265.7 L 290.0,280.0 L 282.5,293.9 L 278.6,310.0 L 260.8,317.4 L 252.8,330.9 L 245.2,344.7 L 240.0,360.0 L 223.3,363.4 L 207.2,369.4 L 190.0,370.0 L 172.8,369.4 L 157.2,360.5 Z'
  },
  {
    id: 'south-east',
    label: 'South East',
    labelPos: [260, 270],
    path: 'M 240.0,360.0 L 245.2,344.7 L 252.8,330.9 L 260.8,317.4 L 278.6,310.0 L 282.5,293.9 L 290.0,280.0 L 284.3,292.7 L 281.5,306.2 L 280.0,320.0 L 268.2,334.9 L 255.0,348.3 Z'
  },
  {
    id: 'north-east',
    label: 'North East',
    labelPos: [290, 60],
    path: 'M 240.0,20.0 L 255.7,18.6 L 269.5,27.9 L 285.3,25.7 L 300.0,30.0 L 311.5,43.0 L 314.2,60.4 L 324.0,74.2 L 330.0,90.0 L 313.4,92.8 L 297.6,89.3 L 282.3,81.8 L 266.3,79.3 L 250.0,80.0 L 251.4,64.3 L 240.7,50.7 L 239.2,35.6 Z'
  },
  {
    id: 'shahdara',
    label: 'Shahdara',
    labelPos: [310, 120],
    path: 'M 250.0,80.0 L 266.3,79.3 L 282.3,81.8 L 297.6,89.3 L 313.4,92.8 L 330.0,90.0 L 336.5,107.1 L 343.9,123.9 L 347.1,141.9 L 350.0,160.0 L 332.6,161.3 L 315.6,159.3 L 299.6,148.8 L 282.2,150.2 L 265.0,150.0 L 260.5,132.7 L 261.6,114.1 L 253.0,97.7 Z'
  },
  {
    id: 'east',
    label: 'East',
    labelPos: [305, 190],
    path: 'M 265.0,150.0 L 282.2,150.2 L 299.6,148.8 L 315.6,159.3 L 332.6,161.3 L 350.0,160.0 L 347.7,175.2 L 340.9,189.5 L 336.8,204.3 L 339.4,220.6 L 335.4,235.5 L 330.0,250.0 L 316.7,249.6 L 303.3,247.7 L 290.0,250.0 L 286.4,240.1 L 283.1,230.1 L 280.0,220.0 L 277.7,202.2 L 270.5,185.4 L 268.8,167.5 Z'
  }
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
        <div>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            District Risk Map — Delhi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Areas needing administrative attention
          </p>
        </div>
        <button className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1">
          View Full Map
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="relative w-full flex justify-center items-center mt-2 h-[260px]">
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
                  Total Complaints: <span className="font-medium text-slate-700 dark:text-slate-300">{hoveredDistrict.total || 0}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Overdue: <span className="font-medium text-slate-700 dark:text-slate-300">{hoveredDistrict.overdue || 0}</span>
                </p>
              </div>
            )}

          <svg
            viewBox="0 0 380 390"
            className="w-full h-full"
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
                    fillOpacity={isHovered ? 1 : 0.8}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2 : 1}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHovered(d.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ filter: isHovered ? 'brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.25))' : 'none' }}
                  />
                  <text
                    x={d.labelPos[0]}
                    y={d.labelPos[1]}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={600}
                    fill="#fff"
                    fillOpacity={0.95}
                    pointerEvents="none"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
                  >
                    {d.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="absolute bottom-0 right-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 flex flex-col gap-1.5 shadow-sm">
          {LEGEND.map(({ level }) => (
            <div key={level} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: riskColor[level] }}
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-none">
                {riskLabel[level]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
