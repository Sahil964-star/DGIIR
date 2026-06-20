import { useState, useEffect } from 'react'
import { formatDate, formatTime, getGreeting } from '@shared/utils/formatters'

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)
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
  const [hasNotif] = useState(true)

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

        {/* Notification bell */}
        <button
          id="notification-bell"
          className="
            relative p-2 rounded-xl
            text-slate-500 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-700/50
            transition-colors duration-200
          "
          aria-label="Notifications"
        >
          <BellIcon />
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse-soft" />
          )}
        </button>
      </div>
    </header>
  )
}
