import { formatDate, formatTime } from '@shared/utils/formatters'

const InfoIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export default function LastUpdatedBar() {
  const now = new Date()
  return (
    <footer className="mt-4 px-1 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
      <div className="flex items-center gap-1.5">
        <InfoIcon />
        <span>
          Last updated: Today, {formatTime(now)}
        </span>
      </div>
      <span className="font-semibold text-brand-600 dark:text-brand-400 tracking-wide">
        Focused. Timely. Transparent.
      </span>
    </footer>
  )
}
