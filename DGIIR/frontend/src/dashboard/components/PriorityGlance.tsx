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
        <div className="skeleton h-24 w-full rounded mb-4" />
        <div className="skeleton h-16 w-full rounded" />
      </div>
    )
  }

  return (
    <div className="card animate-fade-in flex flex-col justify-between h-full">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Priority Overview
      </h2>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <UpArrowIcon className="text-red-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">High Priority</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatNumber(data.high)} <span className="text-sm font-normal text-slate-500">complaints</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Affected Citizens</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">1.2 lakh</span>
        </div>
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Top District</span>
          <span className="text-sm font-bold text-red-600 dark:text-red-400">North East Delhi</span>
        </div>
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Lead Department</span>
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Delhi Jal Board</span>
        </div>
        <div className="flex justify-between items-center pb-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">SLA Breach Count</span>
          <span className="text-sm font-bold text-red-600 dark:text-red-400">84 (Critical)</span>
        </div>
      </div>
    </div>
  )
}
