import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
// @ts-ignore
import { complaintApi } from '../../api/complaintApi'
import Header from '../components/Header'

const statusColors: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  ASSIGNED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  RESOLVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  VERIFICATION_PENDING: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  CLOSED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  REOPENED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

const priorityColors: Record<string, string> = {
  CRITICAL: 'text-red-600 dark:text-red-400',
  HIGH: 'text-orange-600 dark:text-orange-400',
  MEDIUM: 'text-amber-600 dark:text-amber-400',
  LOW: 'text-emerald-600 dark:text-emerald-400',
}

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)

export default function ComplaintsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const { data: complaintsResp, isLoading, isError } = useQuery({
    queryKey: ['cm-complaints', statusFilter, priorityFilter],
    queryFn: () => complaintApi.getComplaints({
      ...(statusFilter && { status: statusFilter }),
      ...(priorityFilter && { priority: priorityFilter }),
    }),
  })

  const complaints = complaintsResp?.data?.complaints || []
  const filtered = complaints.filter((c: any) =>
    !search || 
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.complaintNo?.toLowerCase().includes(search.toLowerCase()) ||
    c.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-enter px-7 pb-8">
      <Header />

      {/* Toolbar */}
      <div className="card mb-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search complaints by ID, title, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FilterIcon />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Priority</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-4">
                <div className="skeleton h-5 w-24 rounded" />
                <div className="skeleton h-5 flex-1 rounded" />
                <div className="skeleton h-5 w-20 rounded" />
                <div className="skeleton h-5 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">Failed to load complaints. Please try again.</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No complaints found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/50">
                  <th className="text-left pb-3 pr-4">Complaint No</th>
                  <th className="text-left pb-3 pr-4">Title</th>
                  <th className="text-left pb-3 pr-4">Category</th>
                  <th className="text-left pb-3 pr-4">District</th>
                  <th className="text-left pb-3 pr-4">Priority</th>
                  <th className="text-left pb-3 pr-4">Status</th>
                  <th className="text-left pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {filtered.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs text-slate-500 dark:text-slate-400">{c.complaintNo}</td>
                    <td className="py-3 pr-4 font-medium text-slate-700 dark:text-slate-200 max-w-[200px] truncate">{c.title}</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{c.category?.name || '—'}</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{c.district?.name || '—'}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-semibold ${priorityColors[c.priority] || 'text-slate-500'}`}>
                        {c.priority || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${statusColors[c.status] || statusColors.PENDING}`}>
                        {c.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Results count */}
        {!isLoading && !isError && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-400 dark:text-slate-500">
            Showing {filtered.length} of {complaints.length} complaints
          </div>
        )}
      </div>
    </div>
  )
}
