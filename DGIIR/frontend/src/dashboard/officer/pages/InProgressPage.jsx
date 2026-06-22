import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, MessageCircle, Camera, CheckCircle, AlertCircle, RefreshCw, Upload, Check } from 'lucide-react';
import { officerApi } from '../../../api/officerApi';
import { complaintApi } from '../../../api/complaintApi';
import Loader from '../../../shared/components/Loader';

const InProgressPage = () => {
  const queryClient = useQueryClient();
  
  // Expanded item index to show tools
  const [expandedId, setExpandedId] = useState(null);
  
  // Forms states
  const [commentText, setCommentText] = useState('');
  const [closureNotes, setClosureNotes] = useState('');
  const [closureFile, setClosureFile] = useState(null);

  // Success indicators
  const [successMsg, setSuccessMsg] = useState('');

  const { data: resp, isLoading, isError } = useQuery({
    queryKey: ['officerComplaints'],
    queryFn: () => officerApi.getMyComplaints()
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statusData }) => complaintApi.updateStatus(id, statusData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['officerComplaints'] });
      setCommentText('');
      setClosureNotes('');
      setClosureFile(null);
      setSuccessMsg('Incident action updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  });

  const uploadMediaMutation = useMutation({
    mutationFn: ({ id, formData }) => complaintApi.uploadMedia(id, formData),
    onSuccess: () => {
      setSuccessMsg('Evidence photo uploaded successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
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
        <p className="text-sm text-slate-500 dark:text-slate-400">An error occurred while fetching your in-progress list.</p>
      </div>
    );
  }

  const complaints = resp?.data?.complaints || resp?.complaints || [];
  const inProgressComplaints = complaints.filter(c => c.status === 'IN_PROGRESS');

  if (inProgressComplaints.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl">
        <Play className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Active Incidents</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">You do not currently have any incidents in progress.</p>
      </div>
    );
  }

  const handleAddComment = async (id) => {
    if (!commentText.trim()) return;
    await updateStatusMutation.mutateAsync({
      id,
      statusData: { status: 'IN_PROGRESS', comments: commentText }
    });
  };

  const handleCompleteIncident = async (id) => {
    if (closureNotes.trim().length < 10) return;

    if (closureFile) {
      const formData = new FormData();
      formData.append('file', closureFile);
      await uploadMediaMutation.mutateAsync({ id, formData });
    }

    await updateStatusMutation.mutateAsync({
      id,
      statusData: { status: 'RESOLVED', comments: closureNotes }
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Active (In Progress) Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage details, submit timeline comments, or request closure for active tasks.</p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-blue-200/50">
          Active: {inProgressComplaints.length}
        </span>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-sm">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        {inProgressComplaints.map((c) => {
          const isExpanded = expandedId === c.id;
          return (
            <div 
              key={c.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div 
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
                className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer select-none"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{c.complaintNo}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-blue-50 text-blue-700 border border-blue-100">
                      {c.priority}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 truncate max-w-[400px] font-medium">{c.address}</p>
                </div>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 self-start sm:self-auto hover:underline">
                  {isExpanded ? 'Hide Tools' : 'Open Tools'}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                  
                  {/* Left Action Box: Comment Updates */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-slate-400" />
                      Add Status Update Notes
                    </h4>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write minor progress updates to log on the complaint event stream..."
                      className="w-full h-24 p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-medium text-slate-800 dark:text-white"
                    />
                    <button
                      onClick={() => handleAddComment(c.id)}
                      disabled={!commentText.trim() || updateStatusMutation.isPending}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-[11px] transition-colors border border-green-500 disabled:opacity-50"
                    >
                      {updateStatusMutation.isPending ? 'Submitting...' : 'Post Update'}
                    </button>
                  </div>

                  {/* Right Action Box: Complete / Closure Request */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-slate-400" />
                      Complete Task & Submit Resolution
                    </h4>
                    
                    {/* File Upload Selector */}
                    <div className="grid grid-cols-2 gap-3 items-center">
                      <label className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-50 cursor-pointer hover:border-green-500 group transition-all">
                        <Camera className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-all mb-1" />
                        <span className="text-[9px] font-bold text-slate-500">Attach Resolution Photo</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setClosureFile(e.target.files[0]);
                          }}
                          className="hidden" 
                        />
                      </label>
                      <div className="min-w-0">
                        {closureFile ? (
                          <div className="p-2 bg-green-50/40 border border-green-200/50 rounded-xl flex items-center gap-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            <Upload className="w-3.5 h-3.5 text-green-600 shrink-0" />
                            <span className="truncate flex-1">{closureFile.name}</span>
                            <button onClick={() => setClosureFile(null)} className="text-red-500 text-[10px] hover:underline pl-1 shrink-0 font-bold">Clear</button>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">No closure image selected.</p>
                        )}
                      </div>
                    </div>

                    <textarea
                      value={closureNotes}
                      onChange={(e) => setClosureNotes(e.target.value)}
                      placeholder="Describe final corrective actions taken on-site to resolve this incident (min 10 characters)..."
                      className="w-full h-24 p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-medium text-slate-800 dark:text-white"
                    />
                    
                    {closureNotes.trim().length > 0 && closureNotes.trim().length < 10 && (
                      <p className="text-[10px] text-red-500 font-bold">Minimum 10 characters required for notes.</p>
                    )}

                    <button
                      onClick={() => handleCompleteIncident(c.id)}
                      disabled={closureNotes.trim().length < 10 || updateStatusMutation.isPending || uploadMediaMutation.isPending}
                      className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-green-500 disabled:opacity-50"
                    >
                      {updateStatusMutation.isPending || uploadMediaMutation.isPending ? 'Submitting Closure...' : 'Submit Closure'}
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InProgressPage;
