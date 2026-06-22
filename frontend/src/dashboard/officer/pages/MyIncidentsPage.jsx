import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Play, CheckCircle, ExternalLink, Calendar, MapPin, AlertCircle, Info } from 'lucide-react';
import { officerApi } from '../../../api/officerApi';
import { complaintApi } from '../../../api/complaintApi';
import Loader from '../../../shared/components/Loader';

const getStatusBadgeClass = (status) => {
  const norm = (status || '').toUpperCase();
  if (norm === 'ASSIGNED') return 'bg-yellow-50 text-yellow-700 border border-yellow-200/50 dark:bg-yellow-950/30 dark:text-yellow-400';
  if (norm === 'IN_PROGRESS') return 'bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400';
  if (norm === 'OVERDUE') return 'bg-red-50 text-red-700 border border-red-200/50 dark:bg-red-950/30 dark:text-red-400';
  if (norm === 'RESOLVED' || norm === 'CLOSED') return 'bg-green-50 text-green-700 border border-green-200/50 dark:bg-green-950/30 dark:text-green-400';
  return 'bg-slate-50 text-slate-700 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-400';
};

const getPriorityBadgeClass = (priority) => {
  const norm = (priority || '').toUpperCase();
  if (norm === 'CRITICAL' || norm === 'HIGH') return 'bg-red-50 text-red-700 border border-red-200/50 dark:bg-red-950/30 dark:text-red-400';
  if (norm === 'MEDIUM') return 'bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-400';
  return 'bg-green-50 text-green-700 border border-green-200/50 dark:bg-green-950/30 dark:text-green-400';
};

const MyIncidentsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: resp, isLoading, isError } = useQuery({
    queryKey: ['officerComplaints'],
    queryFn: () => officerApi.getMyComplaints()
  });

  const acceptMutation = useMutation({
    mutationFn: (id) => complaintApi.acceptComplaint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officerComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['officerWorkload'] });
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Failed to Load Incidents</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">An error occurred while fetching your assigned complaints.</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['officerComplaints'] })}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const complaints = resp?.data?.complaints || resp?.complaints || [];

  if (complaints.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Incidents Assigned</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">You do not currently have any incidents assigned to you.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Assigned Incidents</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">List of all complaints currently assigned to you.</p>
        </div>
        <div className="text-xs bg-slate-100 dark:bg-slate-800 font-bold px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 shrink-0 self-start sm:self-auto">
          Total: {complaints.length}
        </div>
      </div>

      {/* Grid Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">Complaint ID</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Address</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {complaints.map((c) => {
                const isAssigned = c.status === 'ASSIGNED';
                const assignedDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

                return (
                  <tr 
                    key={c.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors text-xs text-slate-700 dark:text-slate-300"
                  >
                    {/* Complaint ID */}
                    <td className="p-4 pl-6 font-mono font-bold text-slate-500 dark:text-slate-400">
                      {c.complaintNo}
                    </td>

                    {/* Category */}
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {c.category?.name || 'General'}
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${getPriorityBadgeClass(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>

                    {/* Address */}
                    <td className="p-4 max-w-[200px] truncate font-medium">
                      {c.address}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${getStatusBadgeClass(c.status)}`}>
                        {c.status?.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Assigned Date */}
                    <td className="p-4 font-semibold text-slate-500">
                      {assignedDate}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isAssigned && (
                          <button
                            onClick={() => acceptMutation.mutate(c.id)}
                            disabled={acceptMutation.isPending}
                            title="Start Work"
                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-xl transition-all border border-green-200/50 dark:border-green-800/30 flex items-center justify-center shrink-0"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        )}
                        <Link
                          to={`/officer/incidents/${c.id}`}
                          title="View Details"
                          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyIncidentsPage;
