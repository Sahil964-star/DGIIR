import { useQuery } from '@tanstack/react-query'
// @ts-ignore
import { analyticsApi } from '../../api/analyticsApi'
import Header from '../components/Header'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area, LineChart, Line,
} from 'recharts'

const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#ef4444', '#eab308', '#a855f7', '#ec4899', '#14b8a6']

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

export default function ReportsPage() {
  const { data: overviewResp, isLoading: statsLoading } = useQuery({
    queryKey: ['report-overview'],
    queryFn: () => analyticsApi.getCmOverview(),
  })

  const { data: concernsResp, isLoading: concernsLoading } = useQuery({
    queryKey: ['report-concerns'],
    queryFn: () => analyticsApi.getCmTopConcerns(),
  })

  const { data: priorityResp, isLoading: priorityLoading } = useQuery({
    queryKey: ['report-priority'],
    queryFn: () => analyticsApi.getCmPriority(),
  })

  const { data: districtsResp, isLoading: districtsLoading } = useQuery({
    queryKey: ['report-districts'],
    queryFn: () => analyticsApi.getCmDistrictRisk(),
  })

  const stats = overviewResp?.data || {}
  const concerns = concernsResp?.data || []
  const priority = (priorityResp?.data || []).map((p: any) => ({
    name: p.priority,
    value: p._count?.id || 0,
  }))
  const districts = (districtsResp?.data || []).map((d: any) => ({
    name: d.district || d.name || d.id,
    total: d.total || 0,
    overdue: d.overdue || 0,
  }))

  const isLoading = statsLoading || concernsLoading || priorityLoading || districtsLoading

  // Status distribution data
  const statusData = [
    { name: 'Resolved', value: stats.resolved || 0, fill: '#22c55e' },
    { name: 'In Progress', value: stats.inProgress || 0, fill: '#f97316' },
    { name: 'Overdue', value: stats.overdue || 0, fill: '#ef4444' },
    { name: 'Pending', value: Math.max(0, (stats.total || 0) - (stats.resolved || 0) - (stats.inProgress || 0) - (stats.overdue || 0)), fill: '#94a3b8' },
  ]

  return (
    <div className="page-enter px-7 pb-8">
      <Header />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Reports & Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Comprehensive data analysis and exportable reports.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
          <DownloadIcon />
          Export Report
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="card">
              <div className="skeleton h-4 w-32 rounded mb-4" />
              <div className="skeleton h-48 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Status Distribution Donut */}
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }}
                  formatter={(v: number) => [v.toLocaleString('en-IN'), 'Complaints']}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Breakdown */}
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Priority Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={priority} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {priority.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* District-wise Complaints */}
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">District-wise Complaints</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={districts} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" height={50} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }} />
                <Bar dataKey="total" fill="#3b82f6" name="Total" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="overdue" fill="#ef4444" name="Overdue" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: '8px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Concerns Bar */}
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Top Category Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={concerns.slice(0, 8)} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
