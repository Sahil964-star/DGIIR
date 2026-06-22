import ResolutionSparkline from '../charts/ResolutionSparkline'

interface ResolutionTimeCardProps {
  data: any
  loading?: boolean
}

const ClockIcon = () => (
  <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const DownArrow = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
)

// Mock sparkline data (in a real app, this would come from the API)
const SPARKLINE_DATA = [
  { date: '1', hours: 72 },
  { date: '2', hours: 68 },
  { date: '3', hours: 65 },
  { date: '4', hours: 62 },
  { date: '5', hours: 58 },
  { date: '6', hours: 55 },
  { date: '7', hours: 52 },
  { date: '8', hours: 48 },
]

export default function ResolutionTimeCard({ data, loading }: ResolutionTimeCardProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-40 rounded mb-4" />
        <div className="flex items-center gap-3 mb-3">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="skeleton h-10 w-20 rounded" />
        </div>
        <div className="skeleton h-12 w-full rounded" />
      </div>
    )
  }

  const avgDays = parseFloat(data?.avgDays || '0')
  const avgHours = Math.round(avgDays * 24) || 48

  return (
    <div className="card animate-fade-in flex flex-col justify-between h-full">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
        Average Resolution Time
      </h2>

      {/* Main stat */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 ring-2 ring-amber-200 dark:ring-amber-800/40 flex items-center justify-center flex-shrink-0">
          <ClockIcon />
        </div>
        <span className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {avgHours}h
        </span>
      </div>

      {/* Improvement badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <DownArrow /> 12h improvement
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">vs last 30 days</span>
      </div>

      {/* Sparkline */}
      <div className="mt-auto">
        <ResolutionSparkline data={SPARKLINE_DATA} />
      </div>
    </div>
  )
}
