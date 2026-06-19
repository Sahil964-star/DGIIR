import type { PriorityStats } from '@shared/types/complaints'
import { formatNumber } from '@shared/utils/formatters'

interface PriorityGlanceProps {
  data: PriorityStats
  loading?: boolean
}

const UpArrowIcon = ({ className }: { className?: string }) => (
  <svg className={`w-7 h-7 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
)
const RightArrowIcon = ({ className }: { className?: string }) => (
  <svg className={`w-7 h-7 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
)
const DownArrowIcon = ({ className }: { className?: string }) => (
  <svg className={`w-7 h-7 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
)

const priorities = (data: PriorityStats) => [
  {
    label: 'High Priority',
    value: data.high,
    subtitle: 'Needs immediate attention',
    icon: <UpArrowIcon className="text-red-500" />,
    iconBg: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30',
    valueColor: 'text-red-600 dark:text-red-400',
  },
  {
    label: 'Medium Priority',
    value: data.medium,
    subtitle: 'Being addressed',
    icon: <RightArrowIcon className="text-amber-500" />,
    iconBg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30',
    valueColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    label: 'Low Priority',
    value: data.low,
    subtitle: 'Under control',
    icon: <DownArrowIcon className="text-emerald-500" />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30',
    valueColor: 'text-emerald-600 dark:text-emerald-400',
  },
]

export default function PriorityGlance({ data, loading }: PriorityGlanceProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-32 rounded mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 mb-4">
            <div className="skeleton w-14 h-14 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-6 w-16 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="card animate-fade-in">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Priority at a Glance
      </h2>

      <div className="space-y-4">
        {priorities(data).map(({ label, value, subtitle, icon, iconBg, valueColor }) => (
          <div key={label} className="flex items-center gap-4">
            {/* Icon circle */}
            <div className={`w-14 h-14 rounded-full border-2 ${iconBg} flex items-center justify-center flex-shrink-0`}>
              {icon}
            </div>

            {/* Text */}
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
              <p className={`text-2xl font-bold ${valueColor}`}>{formatNumber(value)}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
