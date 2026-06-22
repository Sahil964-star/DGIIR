import type { ComplaintStats } from '@shared/types/complaints'
import StatusBarChart from '../charts/StatusBarChart'

interface StatusOverviewChartProps {
  stats: ComplaintStats
  loading?: boolean
}

const chartData = (stats: ComplaintStats) => [
  { name: 'Resolved',    value: stats.resolved,   fill: '#0e9f6e' },
  { name: 'In Progress', value: stats.inProgress,  fill: '#ff8a00' },
  { name: 'Overdue',     value: stats.overdue,     fill: '#e02424' },
]

export default function StatusOverviewChart({ stats, loading }: StatusOverviewChartProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-32 rounded mb-4" />
        <div className="skeleton h-40 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="card animate-fade-in flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Status Overview
        </h2>
        <div className="mb-4">
          <StatusBarChart data={chartData(stats)} />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">Resolution Rate</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.resolvedPct}%</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">Weekly Change</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">+4.2%</span>
        </div>
      </div>
    </div>
  )
}
