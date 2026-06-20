import Card from '@shared/components/Card'

export default function CitizenImpactIndicators() {
  return (
    <Card className="mb-5 py-3 px-6" noPadding>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Citizens Impacted</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">4.8 Lakh</span>
        </div>
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Households Affected</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">1.2 Lakh</span>
        </div>
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Most Affected District</span>
          <span className="text-sm font-bold text-red-600 dark:text-red-400">North East Delhi</span>
        </div>
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden lg:block"></div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Fastest Improving</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">South West Delhi</span>
        </div>
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden xl:block"></div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Dept. Requiring Attention</span>
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Delhi Jal Board</span>
        </div>
      </div>
    </Card>
  )
}
