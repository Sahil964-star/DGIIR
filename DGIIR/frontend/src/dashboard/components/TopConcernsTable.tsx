import { useState } from 'react'
import type { TopConcern } from '@shared/types/complaints'

interface TopConcernsTableProps {
  concerns: TopConcern[]
  loading?: boolean
}

const RANK_COLORS = ['#dc2626','#f97316','#f59e0b','#84cc16','#22c55e',
                     '#14b8a6','#3b82f6','#8b5cf6','#ec4899','#64748b']

const UpArrow = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
)
const DownArrow = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

export default function TopConcernsTable({ concerns, loading }: TopConcernsTableProps) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? concerns : concerns.slice(0, 10)

  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-48 rounded mb-4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3 mb-3">
            <div className="skeleton w-5 h-5 rounded" />
            <div className="skeleton h-4 flex-1 rounded" />
            <div className="skeleton w-12 h-4 rounded" />
            <div className="skeleton w-10 h-4 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="card animate-fade-in h-full flex flex-col">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Top 10 Most Important Concerns
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="text-left pb-2 pr-3 w-12">Rank</th>
              <th className="text-left pb-2 pr-3">Concern</th>
              <th className="text-right pb-2 pr-4">Complaints</th>
              <th className="text-right pb-2 w-32">Trend (vs last 7 days)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {visible.map((c) => {
              const trendUp = c.trendUp ?? (c.trend >= 0)
              const trendVal = Math.abs(c.trend || 0)
              return (
                <tr
                  key={c.rank}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                >
                  {/* Rank badge */}
                  <td className="py-2.5 pr-3">
                    <span
                      className="inline-flex w-6 h-6 items-center justify-center rounded-md text-white text-[10px] font-bold"
                      style={{ backgroundColor: RANK_COLORS[c.rank - 1] ?? '#94a3b8' }}
                    >
                      {c.rank}
                    </span>
                  </td>

                  {/* Concern name */}
                  <td className="py-2.5 pr-3 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap">
                    {c.name}
                  </td>

                  {/* Count */}
                  <td className="py-2.5 pr-4 text-right font-semibold text-slate-700 dark:text-slate-200">
                    {c.count?.toLocaleString('en-IN') || 0}
                  </td>

                  {/* Trend */}
                  <td className="py-2.5 text-right">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      trendUp ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      {trendUp ? <UpArrow /> : <DownArrow />}
                      {trendVal}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-3 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
      >
        {expanded ? 'Show Less' : 'View All Concerns'}
        <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
