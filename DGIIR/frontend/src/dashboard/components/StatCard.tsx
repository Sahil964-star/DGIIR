import { formatNumber, formatPercent } from '@shared/utils/formatters'

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
  blue:  { value: 'text-brand-600  dark:text-brand-400',  bg: 'bg-brand-50  dark:bg-brand-900/20',  border: 'border-brand-100  dark:border-brand-800/30'  },
  green: { value: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800/30' },
  amber: { value: 'text-amber-600  dark:text-amber-400',  bg: 'bg-amber-50   dark:bg-amber-900/20',  border: 'border-amber-100   dark:border-amber-800/30'  },
  red:   { value: 'text-red-600    dark:text-red-400',    bg: 'bg-red-50     dark:bg-red-900/20',    border: 'border-red-100     dark:border-red-800/30'    },
}

export default function StatCard({
  id, title, value, subtitle, contextText, pct, accentColor, icon, loading = false,
}: StatCardProps) {
  const accent = accentMap[accentColor]

  if (loading) {
    return (
      <div className="card flex items-center gap-4">
        <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-7 w-16 rounded" />
          <div className="skeleton h-3 w-12 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div id={id} className="card flex items-center gap-4 hover:shadow-card-md transition-shadow duration-200 animate-slide-up">
      {/* Icon circle */}
      <div className={`w-10 h-10 rounded-lg ${accent.bg} border ${accent.border} flex items-center justify-center flex-shrink-0`}>
        <div className={`${accent.value} scale-[0.85]`}>{icon}</div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
          {title}
        </p>
        <p className={`text-2xl font-bold mt-0.5 ${accent.value}`}>
          {formatNumber(value)}
        </p>
        {(subtitle || pct !== undefined) && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {pct !== undefined ? formatPercent(pct) : subtitle}
          </p>
        )}
        {contextText && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
            {contextText}
          </p>
        )}
      </div>
    </div>
  )
}
