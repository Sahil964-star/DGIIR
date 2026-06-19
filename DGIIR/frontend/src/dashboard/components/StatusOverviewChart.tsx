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
    <div className="card animate-fade-in">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Status Overview
      </h2>
      <StatusBarChart data={chartData(stats)} />
    </div>
  )
}
