import type { ResolutionStats } from '@shared/types/complaints'

interface ResolutionTimeCardProps {
  data: any
  loading?: boolean
}

const ClockIcon = () => (
  <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      </div>
    )
  }

  return (
    <div className="card animate-fade-in flex flex-col justify-center h-full">
      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Average Resolution Time
        </h2>

      {/* Main stat */}
      <div className="flex items-center gap-3 mb-1">
        <ClockIcon />
        <span className="text-4xl font-bold text-slate-800 dark:text-white">
          {data?.avgDays || '0'} Days
        </span>
      </div>
      </div>
    </div>
  )
}
