import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
// @ts-ignore
import { useAuth } from '../../hooks/useAuth'

// ─── Icons (inline SVG to keep zero extra deps) ──────────────────────────────
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)
const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)
const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)
const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
)
const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Overview',    to: '/overview',    Icon: HomeIcon  },
  { label: 'Complaints',  to: '/complaints',  Icon: ListIcon  },
  { label: 'Reports',     to: '/reports',     Icon: ChartIcon },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains('dark')
  )
  
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { logout } = useAuth()

  const handleLogout = () => {
    // 1. GLOBAL STATE CLEANDOWN
    logout()
    
    // 2. AUTHENTICATION MEMORY PURGE
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_role')
    sessionStorage.clear()
    
    // 3. CACHE INVALIDATION
    queryClient.clear()
    
    // 4. COMPONENT ROUTING DISPATCH
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <aside className="
      fixed inset-y-0 left-0 z-30 w-56 flex flex-col
      bg-white dark:bg-sidebar-dark
      border-r border-slate-100 dark:border-slate-700/50
      shadow-sm
    ">
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-700/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-white font-bold text-sm">CM</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">CM Dashboard</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-none">Complaint Overview</p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-700/50 space-y-1">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="
            w-full flex items-center justify-between px-4 py-2.5 rounded-xl
            text-sm font-medium text-slate-600 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-700/50
            transition-all duration-200
          "
          aria-label="Toggle dark mode"
        >
          <span className="flex items-center gap-3">
            {dark ? <SunIcon /> : <MoonIcon />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </span>
          <div className={`
            relative w-9 h-5 rounded-full transition-colors duration-300
            ${dark ? 'bg-brand-600' : 'bg-slate-300'}
          `}>
            <div className={`
              absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow
              transition-transform duration-300
              ${dark ? 'translate-x-4' : 'translate-x-0'}
            `} />
          </div>
        </button>

        <button className="nav-item w-full">
          <SettingsIcon />
          <span>Settings</span>
        </button>

        <button 
          onClick={handleLogout}
          className="nav-item w-full text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:text-red-400"
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
