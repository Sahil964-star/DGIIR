import { useQuery } from '@tanstack/react-query'
// @ts-ignore
import { analyticsApi } from '../../api/analyticsApi'
import Header              from '../components/Header'
import StatCard            from '../components/StatCard'
import StatusOverviewChart from '../components/StatusOverviewChart'
import ResolutionTimeCard  from '../components/ResolutionTimeCard'
import DistrictRiskMap     from '../components/DistrictRiskMap'
import TopConcernsTable    from '../components/TopConcernsTable'
import PriorityGlance      from '../components/PriorityGlance'
import LastUpdatedBar      from '../components/LastUpdatedBar'

// ─── Stat card icons (inline SVG) ────────────────────────────────────────────
const TotalIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
const ResolvedIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const InProgressIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const OverdueIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

// ─── Auto-refresh interval (60 seconds) ──────────────────────────────────────
const REFETCH_MS = 60_000

export default function OverviewPage() {
  const { data: overviewResp, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['complaint-stats'],
    queryFn: () => analyticsApi.getCmOverview(),
    refetchInterval: REFETCH_MS,
  })

  const { data: concernsResp, isLoading: concernsLoading } = useQuery({
    queryKey: ['top-concerns'],
    queryFn: () => analyticsApi.getCmTopConcerns(),
    refetchInterval: REFETCH_MS,
  })

  const { data: priorityResp, isLoading: priorityLoading } = useQuery({
    queryKey: ['priority-stats'],
    queryFn: () => analyticsApi.getCmPriority(),
    refetchInterval: REFETCH_MS,
  })

  const { data: districtsResp, isLoading: districtsLoading } = useQuery({
    queryKey: ['district-risk'],
    queryFn: () => analyticsApi.getCmDistrictRisk(),
    refetchInterval: REFETCH_MS,
  })

  const { data: resolutionResp, isLoading: resolutionLoading } = useQuery({
    queryKey: ['resolution-stats'],
    queryFn: () => analyticsApi.getCmResolutionTime(),
    refetchInterval: REFETCH_MS,
  })

  const stats = overviewResp?.data || {};
  const concerns = concernsResp?.data || [];
  const priority = priorityResp?.data || [];
  const districts = districtsResp?.data || [];
  const resolutionData = resolutionResp?.data || { averageDays: "0" };

  const resolution = {
    avgDays: resolutionData.averageDays || "0"
  };

  // Compute percentages for display
  const total = stats?.total || 0
  const resolved = stats?.resolved || 0
  const inProgress = stats?.inProgress || 0
  const overdue = stats?.overdue || 0
  const resolvedPct = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0'
  const inProgressPct = total > 0 ? ((inProgress / total) * 100).toFixed(1) : '0'
  const overduePct = total > 0 ? ((overdue / total) * 100).toFixed(1) : '0'

  if (statsError) {
    return (
      <div className="page-enter px-7 pb-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Failed to load overview data</h2>
          <p className="text-slate-500 dark:text-slate-400">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter px-7 pb-8">
      {/* ── Header ── */}
      <Header />

      {/* ── Stat Cards Row ── */}
      <section aria-label="Overview statistics" className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <StatCard
          id="stat-total"
          title="Total Complaints"
          value={total}
          contextText="All time"
          accentColor="blue"
          icon={<TotalIcon />}
          loading={statsLoading}
        />
        <StatCard
          id="stat-resolved"
          title="Resolved"
          value={resolved}
          contextText={`${resolvedPct}%`}
          accentColor="green"
          icon={<ResolvedIcon />}
          loading={statsLoading}
        />
        <StatCard
          id="stat-inprogress"
          title="In Progress"
          value={inProgress}
          contextText={`${inProgressPct}%`}
          accentColor="amber"
          icon={<InProgressIcon />}
          loading={statsLoading}
        />
        <StatCard
          id="stat-overdue"
          title="Overdue"
          value={overdue}
          contextText={`${overduePct}%`}
          accentColor="red"
          icon={<OverdueIcon />}
          loading={statsLoading}
        />
      </section>

      {/* ── Middle Row: Status Chart | Resolution | District Map ── */}
      <section aria-label="Charts and map" className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Status Overview bar chart */}
        <StatusOverviewChart
          stats={{ 
            total: total, 
            resolved: resolved, 
            inProgress: inProgress, 
            overdue: overdue, 
            resolvedPct: parseFloat(resolvedPct), 
            inProgressPct: parseFloat(inProgressPct), 
            overduePct: parseFloat(overduePct) 
          }}
          loading={statsLoading}
        />

        {/* Average resolution time */}
        <ResolutionTimeCard
          data={resolution ?? { avgDays: "0" }}
          loading={resolutionLoading}
        />

        {/* Delhi District risk map */}
        <DistrictRiskMap
          districts={districts ?? []}
          loading={districtsLoading}
        />
      </section>

      {/* ── Bottom Row: Top Concerns | Priority ── */}
      <section aria-label="Concerns and priority" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top 10 concerns table — takes 2/3 width */}
        <div className="lg:col-span-2">
          <TopConcernsTable
            concerns={concerns ?? []}
            loading={concernsLoading}
          />
        </div>

        {/* Priority at a glance — takes 1/3 width */}
        <PriorityGlance
          data={priority.reduce((acc: any, curr: any) => {
             acc[(curr.priority || '').toLowerCase()] = curr._count?.id || 0;
             return acc;
          }, { high: 0, medium: 0, low: 0, critical: 0 })}
          loading={priorityLoading}
        />
      </section>

      {/* ── Footer ── */}
      <LastUpdatedBar />
    </div>
  )
}
