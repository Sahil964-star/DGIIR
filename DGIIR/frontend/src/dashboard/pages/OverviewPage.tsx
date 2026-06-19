import { useQuery } from '@tanstack/react-query'
import {
  fetchComplaintStats,
  fetchTopConcerns,
  fetchPriorityStats,
  fetchDistrictRisk,
  fetchResolutionStats,
} from '@shared/api/dashboardApi'

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
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['complaint-stats'],
    queryFn: fetchComplaintStats,
    refetchInterval: REFETCH_MS,
  })

  const { data: concerns, isLoading: concernsLoading } = useQuery({
    queryKey: ['top-concerns'],
    queryFn: fetchTopConcerns,
    refetchInterval: REFETCH_MS,
  })

  const { data: priority, isLoading: priorityLoading } = useQuery({
    queryKey: ['priority-stats'],
    queryFn: fetchPriorityStats,
    refetchInterval: REFETCH_MS,
  })

  const { data: districts, isLoading: districtsLoading } = useQuery({
    queryKey: ['district-risk'],
    queryFn: fetchDistrictRisk,
    refetchInterval: REFETCH_MS,
  })

  const { data: resolution, isLoading: resolutionLoading } = useQuery({
    queryKey: ['resolution-stats'],
    queryFn: fetchResolutionStats,
    refetchInterval: REFETCH_MS,
  })

  return (
    <div className="page-enter px-7 pb-8">
      {/* ── Header ── */}
      <Header />

      {/* ── Stat Cards Row ── */}
      <section aria-label="Overview statistics" className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <StatCard
          id="stat-total"
          title="Total Complaints"
          value={stats?.total ?? 0}
          subtitle="All time"
          accentColor="blue"
          icon={<TotalIcon />}
          loading={statsLoading}
        />
        <StatCard
          id="stat-resolved"
          title="Resolved"
          value={stats?.resolved ?? 0}
          pct={stats?.resolvedPct}
          accentColor="green"
          icon={<ResolvedIcon />}
          loading={statsLoading}
        />
        <StatCard
          id="stat-inprogress"
          title="In Progress"
          value={stats?.inProgress ?? 0}
          pct={stats?.inProgressPct}
          accentColor="amber"
          icon={<InProgressIcon />}
          loading={statsLoading}
        />
        <StatCard
          id="stat-overdue"
          title="Overdue"
          value={stats?.overdue ?? 0}
          pct={stats?.overduePct}
          accentColor="red"
          icon={<OverdueIcon />}
          loading={statsLoading}
        />
      </section>

      {/* ── Middle Row: Status Chart | Resolution | District Map ── */}
      <section aria-label="Charts and map" className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Status Overview bar chart */}
        <StatusOverviewChart
          stats={stats ?? { total: 0, resolved: 0, inProgress: 0, overdue: 0, resolvedPct: 0, inProgressPct: 0, overduePct: 0 }}
          loading={statsLoading}
        />

        {/* Average resolution time with sparkline */}
        <ResolutionTimeCard
          data={resolution ?? { avgHours: 0, improvement: 0, trend: [] }}
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
          data={priority ?? { high: 0, medium: 0, low: 0 }}
          loading={priorityLoading}
        />
      </section>

      {/* ── Footer ── */}
      <LastUpdatedBar />
    </div>
  )
}
