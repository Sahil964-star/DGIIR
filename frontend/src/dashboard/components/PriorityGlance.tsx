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
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    valueColor: 'text-red-600 dark:text-red-400',
  },
  {
    label: 'Medium Priority',
    value: data.medium,
    subtitle: 'Being addressed',
    icon: <RightArrowIcon className="text-amber-500" />,
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    valueColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    label: 'Low Priority',
    value: data.low,
    subtitle: 'Under control',
    icon: <DownArrowIcon className="text-emerald-500" />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    valueColor: 'text-emerald-600 dark:text-emerald-400',
  },
]

export default function PriorityGlance({ data, loading }: PriorityGlanceProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-32 rounded mb-4" />
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="skeleton h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card animate-fade-in flex flex-col h-full">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Priority at a Glance
      </h2>

      <div className="space-y-3 flex-1">
        {priorities(data).map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/40 hover:shadow-sm transition-shadow duration-200"
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center flex-shrink-0`}>
              {p.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                {p.label}
              </p>
              <p className={`text-2xl font-bold ${p.valueColor} leading-tight`}>
                {formatNumber(p.value)}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 italic">
                {p.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
