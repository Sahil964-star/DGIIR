import type { ResolutionStats } from '@shared/types/complaints'
import ResolutionSparkline from '../charts/ResolutionSparkline'

interface ResolutionTimeCardProps {
  data: ResolutionStats
  loading?: boolean
}

const ClockIcon = () => (
  <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ArrowDownIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

export default function ResolutionTimeCard({ data, loading }: ResolutionTimeCardProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-40 rounded mb-4" />
        <div className="flex items-center gap-3 mb-3">
          <div className="skeleton w-8 h-8 rounded-full" />
          <div className="skeleton h-10 w-20 rounded" />
        </div>
        <div className="skeleton h-3 w-32 rounded mb-4" />
        <div className="skeleton h-12 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="card animate-fade-in">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Average Resolution Time
      </h2>

      {/* Main stat */}
      <div className="flex items-center gap-3 mb-1">
        <ClockIcon />
        <span className="text-4xl font-bold text-slate-800 dark:text-white">
          {data.avgHours}h
        </span>
      </div>

      {/* Improvement badge */}
      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
        <ArrowDownIcon />
        <span>{data.improvement}h improvement</span>
        <span className="font-normal text-slate-400 ml-1">vs last 30 days</span>
      </div>

      {/* Sparkline */}
      <ResolutionSparkline data={data.trend} />
    </div>
  )
}
