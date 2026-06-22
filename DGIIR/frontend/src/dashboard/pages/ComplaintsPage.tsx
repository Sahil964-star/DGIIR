import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// @ts-ignore
import { complaintApi } from '../../api/complaintApi'
// @ts-ignore
import { metaApi } from '../../api/metaApi'
import Header from '../components/Header'

const statusColors: Record<string, string> = {
  PENDING:              'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  UNDER_REVIEW:         'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  ASSIGNED:             'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  IN_PROGRESS:          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  RESOLVED:             'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  VERIFICATION_PENDING: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  CLOSED:               'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  REOPENED:             'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  REJECTED:             'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

const priorityColors: Record<string, string> = {
  CRITICAL: 'text-red-600 dark:text-red-400',
  HIGH:     'text-orange-600 dark:text-orange-400',
  MEDIUM:   'text-amber-600 dark:text-amber-400',
  LOW:      'text-emerald-600 dark:text-emerald-400',
}

const confidenceColor = (v: number | null) => {
  if (v === null || v === undefined) return 'text-slate-400'
  if (v >= 90) return 'text-emerald-600 dark:text-emerald-400'
  if (v >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-500 dark:text-red-400'
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

const AIBadge = () => (
  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wide">
    AI
  </span>
)

const FlaggedBadge = () => (
  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase tracking-wide">
    ⚑ Review
  </span>
)

export default function ComplaintsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const [overrideData, setOverrideData] = useState<Record<string, any>>({})
  
  const { data: departmentsResp } = useQuery({ queryKey: ['departments'], queryFn: metaApi.getDepartments })
  const { data: categoriesResp } = useQuery({ queryKey: ['categories'], queryFn: metaApi.getCategories })
  
  const overrideMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => complaintApi.overrideClassification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cm-complaints'] })
      alert('Classification updated successfully!')
    },
    onError: (err: any) => {
      alert(`Error updating classification: ${err?.response?.data?.message || err.message}`)
    }
  })

  const handleOverrideSubmit = (id: string) => {
    const data = overrideData[id]
    if (!data?.categoryId || !data?.departmentId) {
      alert('Please select both category and department to override.')
      return
    }
    overrideMutation.mutate({ id, data })
  }

  const { data: complaintsResp, isLoading, isError } = useQuery({
    queryKey: ['cm-complaints', statusFilter, priorityFilter],
    queryFn: () => complaintApi.getComplaints({
      ...(statusFilter && { status: statusFilter }),
      ...(priorityFilter && { priority: priorityFilter }),
    }),
  })

  const complaints = complaintsResp?.data?.complaints || []
  const filtered = complaints.filter((c: any) => {
    const matchesSearch = !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.complaintNo?.toLowerCase().includes(search.toLowerCase()) ||
      c.address?.toLowerCase().includes(search.toLowerCase())
    const matchesFlagged = !showFlaggedOnly || c.aiIsFlagged
    return matchesSearch && matchesFlagged
  })

  const flaggedCount = complaints.filter((c: any) => c.aiIsFlagged).length

  return (
    <div className="page-enter px-7 pb-8">
      <Header />

      {/* Flagged complaints alert */}
      {flaggedCount > 0 && (
        <div
          className="mb-4 flex items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/30 transition"
          onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span><strong>{flaggedCount} complaint{flaggedCount > 1 ? 's' : ''}</strong> flagged by AI for manual review (low confidence or district mismatch)</span>
          </div>
          <span className="text-xs font-semibold shrink-0">{showFlaggedOnly ? 'Show All' : 'Filter Flagged'}</span>
        </div>
      )}

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
                  <th className="text-left pb-3 pr-4">
                    <span className="flex items-center gap-1.5">Category <AIBadge /></span>
                  </th>
                  <th className="text-left pb-3 pr-4">District</th>
                  <th className="text-left pb-3 pr-4">Priority</th>
                  <th className="text-left pb-3 pr-4">
                    <span className="flex items-center gap-1.5">AI Conf. <AIBadge /></span>
                  </th>
                  <th className="text-left pb-3 pr-4">Status</th>
                  <th className="text-left pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {filtered.map((c: any) => (
                  <>
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${c.aiIsFlagged ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''}`}
                      onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    >
                      <td className="py-3 pr-4 font-mono text-xs text-slate-500 dark:text-slate-400">{c.complaintNo}</td>
                      <td className="py-3 pr-4 font-medium text-slate-700 dark:text-slate-200 max-w-[180px]">
                        <div className="truncate">{c.title}</div>
                        {c.aiIsFlagged && <FlaggedBadge />}
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                        <div className="flex flex-col gap-0.5">
                          <span>{c.category?.name || c.aiCategory || '—'}</span>
                          {c.aiCategory && c.aiCategory !== c.category?.name && (
                            <span className="text-[10px] text-indigo-500 dark:text-indigo-400">
                              AI: {c.aiCategory}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                        <div className="flex flex-col gap-0.5">
                          <span>{c.district?.name || '—'}</span>
                          {c.aiDistrictSuggestion && c.aiDistrictSuggestion !== c.district?.name && (
                            <span className="text-[10px] text-amber-500">
                              AI: {c.aiDistrictSuggestion}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs font-semibold ${priorityColors[c.priority] || 'text-slate-500'}`}>
                          {c.priority || 'MEDIUM'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {c.aiConfidence !== null && c.aiConfidence !== undefined ? (
                          <span className={`text-xs font-bold ${confidenceColor(c.aiConfidence)}`}>
                            {Math.round(c.aiConfidence)}%
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
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

                    {/* Expandable AI Details Row */}
                    {expandedId === c.id && (
                      <tr key={`${c.id}-detail`} className="bg-indigo-50/50 dark:bg-indigo-950/10">
                        <td colSpan={8} className="py-4 px-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* AI Summary */}
                            {c.aiSummary && (
                              <div className="col-span-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                                  <AIBadge /> AI Summary
                                </p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{c.aiSummary}"</p>
                              </div>
                            )}

                            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <p className="text-xs text-slate-400 mb-0.5">AI Category</p>
                              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{c.aiCategory || '—'}</p>
                            </div>

                            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <p className="text-xs text-slate-400 mb-0.5">AI Department</p>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{c.aiDepartmentSuggestion || '—'}</p>
                            </div>

                            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <p className="text-xs text-slate-400 mb-0.5">Severity Score</p>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{c.aiSeverityScore ?? '—'}/100</p>
                            </div>

                            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <p className="text-xs text-slate-400 mb-0.5">AI Priority</p>
                              <p className={`text-sm font-semibold ${priorityColors[c.aiPriority] || 'text-slate-600'}`}>{c.aiPriority || '—'}</p>
                            </div>

                            {/* Keywords */}
                            {c.aiKeywords?.length > 0 && (
                              <div className="col-span-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-400 mb-1.5">Keywords Detected</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {c.aiKeywords.map((kw: string) => (
                                    <span key={kw} className="text-[11px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-medium">
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Detected objects */}
                            {c.aiDetectedObjects?.length > 0 && (
                              <div className="col-span-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-400 mb-1.5">Image Analysis — Detected Objects</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {c.aiDetectedObjects.map((obj: string) => (
                                    <span key={obj} className="text-[11px] px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full font-medium">
                                      {obj}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Override Section */}
                            <div className="col-span-full mt-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Manual Review & Override</h4>
                              <div className="flex flex-wrap items-end gap-4">
                                <div className="flex-1 min-w-[200px]">
                                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Actual Category</label>
                                  <select 
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                                    value={overrideData[c.id]?.categoryId || ''}
                                    onChange={(e) => setOverrideData({...overrideData, [c.id]: { ...overrideData[c.id], categoryId: e.target.value }})}
                                  >
                                    <option value="">Select Category...</option>
                                    {(categoriesResp as any)?.data?.map((cat: any) => (
                                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Assign Department</label>
                                  <select 
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                                    value={overrideData[c.id]?.departmentId || ''}
                                    onChange={(e) => setOverrideData({...overrideData, [c.id]: { ...overrideData[c.id], departmentId: e.target.value }})}
                                  >
                                    <option value="">Select Department...</option>
                                    {(departmentsResp as any)?.data?.map((dept: any) => (
                                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <button 
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                  onClick={(e) => { e.stopPropagation(); handleOverrideSubmit(c.id); }}
                                  disabled={overrideMutation.isPending}
                                >
                                  {overrideMutation.isPending ? 'Saving...' : 'Approve & Route'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Results count */}
        {!isLoading && !isError && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
            Showing {filtered.length} of {complaints.length} complaints
            {showFlaggedOnly && <span className="text-amber-500 font-medium">· Showing flagged only</span>}
            <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 italic">Click any row to see AI details</span>
          </div>
        )}
      </div>
    </div>
  )
}
