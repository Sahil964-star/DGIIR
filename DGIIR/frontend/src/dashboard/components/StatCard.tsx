import { formatNumber } from '@shared/utils/formatters'

interface StatCardProps {
  id: string
  title: string
  value: number
  subtitle?: string
  contextText?: string
  pct?: number
  accentColor: 'blue' | 'green' | 'amber' | 'red'
  icon: React.ReactNode
  loading?: boolean
}

const accentMap = {
  blue:  { value: 'text-brand-600 dark:text-brand-400',   bg: 'bg-blue-100 dark:bg-blue-900/30',   ring: 'ring-blue-200 dark:ring-blue-800/40'  },
  green: { value: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', ring: 'ring-emerald-200 dark:ring-emerald-800/40' },
  amber: { value: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-100 dark:bg-amber-900/30',   ring: 'ring-amber-200 dark:ring-amber-800/40'  },
  red:   { value: 'text-red-600 dark:text-red-400',       bg: 'bg-red-100 dark:bg-red-900/30',       ring: 'ring-red-200 dark:ring-red-800/40'    },
}

export default function StatCard({
  id, title, value, subtitle, contextText, pct, accentColor, icon, loading = false,
}: StatCardProps) {
  const accent = accentMap[accentColor]

  if (loading) {
    return (
      <div className="card flex flex-col items-center gap-3 py-5">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-7 w-16 rounded" />
        <div className="skeleton h-3 w-12 rounded" />
      </div>
    )
  }

  return (
    <div id={id} className="card flex flex-col items-center gap-1 py-5 hover:shadow-card-md transition-shadow duration-200 animate-slide-up">
      {/* Circular icon */}
      <div className={`w-12 h-12 rounded-full ${accent.bg} ring-2 ${accent.ring} flex items-center justify-center mb-1`}>
        <div className={`${accent.value} scale-90`}>{icon}</div>
      </div>

      {/* Title */}
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
        {title}
      </p>

      {/* Value */}
      <p className={`text-3xl font-bold ${accent.value} leading-tight`}>
        {formatNumber(value)}
      </p>

      {/* Subtitle / Context */}
      {(contextText || pct !== undefined) && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {pct !== undefined ? `${pct}%` : contextText}
        </p>
      )}
    </div>
  )
}
