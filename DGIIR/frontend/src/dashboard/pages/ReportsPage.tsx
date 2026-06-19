import Header from '../components/Header'

const ChartIcon = () => (
  <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

export default function ReportsPage() {
  return (
    <div className="page-enter px-7 pb-8">
      <Header />
      <div className="card mt-4 flex flex-col items-center justify-center py-20 text-center">
        <ChartIcon />
        <h2 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
          Reports & Analytics
        </h2>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-sm">
          Exportable reports, trend analysis, and district-level breakdowns — coming in the next sprint.
        </p>
        <div className="mt-6 flex gap-2">
          <span className="stat-pill bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">In Roadmap</span>
        </div>
      </div>
    </div>
  )
}
