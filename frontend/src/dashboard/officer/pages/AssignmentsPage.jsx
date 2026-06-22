import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Check, X, AlertTriangle, MessageSquare, MapPin } from 'lucide-react';
import { officerApi } from '../../../api/officerApi';
import { complaintApi } from '../../../api/complaintApi';
import Loader from '../../../shared/components/Loader';

const AssignmentsPage = () => {
  const queryClient = useQueryClient();
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

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

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => complaintApi.rejectComplaint(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officerComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['officerWorkload'] });
      setRejectingId(null);
      setRejectReason('');
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
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Failed to Load Assignments</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">An error occurred while fetching your assignments list.</p>
      </div>
    );
  }

  const complaints = resp?.data?.complaints || resp?.complaints || [];
  // Newly assigned items are those with status === 'ASSIGNED'
  const newAssignments = complaints.filter(c => c.status === 'ASSIGNED');

  if (newAssignments.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl">
        <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No New Assignments</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">You have accepted or cleared all assigned incidents.</p>
      </div>
    );
  }

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;
    rejectMutation.mutate({ id: rejectingId, reason: rejectReason });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Assignments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Please review and accept or reject these assigned tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newAssignments.map((c) => {
          const formattedDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
          return (
            <div 
              key={c.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">
                    {c.complaintNo}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-yellow-50 text-yellow-700 border border-yellow-100">
                    {c.priority}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-3">
                  {c.category?.name || 'General Complaint'}
                </h3>

                <div className="space-y-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{c.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate italic">"{c.description || 'No additional notes.'}"</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Assigned: {formattedDate}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 shrink-0">
                <button
                  onClick={() => acceptMutation.mutate(c.id)}
                  disabled={acceptMutation.isPending}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-green-500"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => setRejectingId(c.id)}
                  className="flex-1 py-3 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-800"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* REJECTION REASON MODAL DIALOG */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Reject Assignment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Please write down the reason for rejecting this assignment. This will be logged in the complaint history timeline and notify operations coordinators.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Out of assigned district boundary, require special sewer line equipment..."
              className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-medium text-slate-800 dark:text-white"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim() || rejectMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-colors border border-red-500 disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
