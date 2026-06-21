import { useState, useEffect } from 'react'
import { formatDate, formatTime, getGreeting } from '@shared/utils/formatters'
// @ts-ignore
import NotificationDropdown from '../../shared/components/NotificationDropdown'


const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)
const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export default function Header() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="
      flex items-start justify-between
      px-7 pt-6 pb-4
    ">
      {/* ── Left: Greeting ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">
          {getGreeting()}, Chief Minister
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Live overview of citizen grievances, service delivery performance, and district-level priorities across Delhi.
        </p>
      </div>

      {/* ── Right: Date / Time / Bell ── */}
      <div className="flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          <CalendarIcon />
          <span>{formatDate(time)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          <ClockIcon />
          <span>{formatTime(time)}</span>
        </div>

        <div className="z-50">
          <NotificationDropdown />
        </div>
      </div>
    </header>
  )
}
