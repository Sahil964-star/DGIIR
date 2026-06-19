import Header from '../components/Header'

const ListIcon = () => (
  <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

export default function ComplaintsPage() {
  return (
    <div className="page-enter px-7 pb-8">
      <Header />
      <div className="card mt-4 flex flex-col items-center justify-center py-20 text-center">
        <ListIcon />
        <h2 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
          Complaints List
        </h2>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-sm">
          Full complaints management view — filtering, search, status updates, and assignment — coming soon.
        </p>
        <div className="mt-6 flex gap-2">
          <span className="stat-pill bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">Backend Integration Pending</span>
        </div>
      </div>
    </div>
  )
}
