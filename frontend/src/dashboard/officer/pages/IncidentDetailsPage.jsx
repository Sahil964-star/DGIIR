import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Clock, MapPin, Building, User, Phone, CheckCircle, 
  AlertTriangle, MessageSquare, Upload, Camera, Send, AlertCircle, 
  ShieldAlert, Sparkles, Navigation 
} from 'lucide-react';
import { complaintApi } from '../../../api/complaintApi';
import Loader from '../../../shared/components/Loader';

const ImageWithFallback = ({ src, alt, label }) => (
  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
    {src ? (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    ) : null}
    <div className={`absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900 ${src ? 'hidden' : 'flex'}`}>
      <Camera className="w-6 h-6 mb-1 text-slate-300 dark:text-slate-700" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600">No {label} Attached</span>
    </div>
  </div>
);

const getSlaUrgency = (c) => {
  if (c.isOverdue) return { label: 'BREACHED', color: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/30 dark:text-red-400' };
  
  const breachTime = c.slaBreachAt ? new Date(c.slaBreachAt).getTime() : new Date(c.createdAt).getTime() + 48 * 60 * 60 * 1000;
  const diff = breachTime - Date.now();

  if (diff <= 0) {
    return { label: 'BREACHED', color: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/30 dark:text-red-400' };
  }
  if (diff < 12 * 60 * 60 * 1000) {
    return { label: 'URGENT', color: 'text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400' };
  }
  return { label: 'ON TRACK', color: 'text-green-700 bg-green-50 border-green-200 dark:bg-green-950/30 dark:text-green-400' };
};

const formatSlaCountdown = (breachTimeStr) => {
  if (!breachTimeStr) return 'N/A';
  const breachTime = new Date(breachTimeStr).getTime();
  const now = Date.now();
  const diff = breachTime - now;

  if (diff <= 0) {
    const hoursPast = Math.abs(Math.floor(diff / (1000 * 60 * 60)));
    return `${hoursPast}h overdue`;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return hours === 0 ? `${minutes}m left` : `${hours}h ${minutes}m left`;
};

const getStatusBadge = (status) => {
  const norm = (status || '').toUpperCase();
  if (norm === 'ASSIGNED') return 'bg-yellow-50 text-yellow-700 border border-yellow-200/50 dark:bg-yellow-950/30 dark:text-yellow-400';
  if (norm === 'IN_PROGRESS') return 'bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400';
  if (norm === 'RESOLVED' || norm === 'CLOSED') return 'bg-green-50 text-green-700 border border-green-200/50 dark:bg-green-950/30 dark:text-green-400';
  return 'bg-slate-50 text-slate-700 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-400';
};

const IncidentDetailsPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [, setTick] = useState(0);

  // Form controls
  const [commentText, setCommentText] = useState('');
  const [escalateReason, setEscalateReason] = useState('');
  const [closureNotes, setClosureNotes] = useState('');
  const [closureFile, setClosureFile] = useState(null);

  // Toggles
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);
  const [isClosureOpen, setIsClosureOpen] = useState(false);
  
  // Feedback
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const { data: resp, isLoading, isError } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintApi.getComplaintById(id),
    enabled: !!id
  });

  const acceptMutation = useMutation({
    mutationFn: () => complaintApi.acceptComplaint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      setActionSuccess('Assignment accepted! Work status updated to In Progress.');
      setTimeout(() => setActionSuccess(''), 4000);
    },
    onError: (err) => {
      setActionError(err?.response?.data?.message || 'Failed to accept assignment.');
      setTimeout(() => setActionError(''), 4000);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: (statusData) => complaintApi.updateStatus(id, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      setCommentText('');
      setClosureNotes('');
      setClosureFile(null);
      setIsClosureOpen(false);
      setActionSuccess('Incident updated successfully!');
      setTimeout(() => setActionSuccess(''), 4000);
    },
    onError: (err) => {
      setActionError(err?.response?.data?.message || 'Failed to submit status update.');
      setTimeout(() => setActionError(''), 4000);
    }
  });

  const uploadMediaMutation = useMutation({
    mutationFn: (formData) => complaintApi.uploadMedia(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
    }
  });

  const escalateMutation = useMutation({
    mutationFn: (escalateData) => complaintApi.escalateComplaint(id, escalateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      setEscalateReason('');
      setIsEscalateOpen(false);
      setActionSuccess('Incident escalated to operations control room successfully!');
      setTimeout(() => setActionSuccess(''), 4000);
    },
    onError: (err) => {
      setActionError(err?.response?.data?.message || 'Failed to request escalation.');
      setTimeout(() => setActionError(''), 4000);
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  if (isError || !resp?.data?.complaint) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Complaint Not Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">The complaint details could not be retrieved from the database.</p>
        <Link 
          to="/officer/incidents"
          className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold transition-colors inline-block"
        >
          Back to List
        </Link>
      </div>
    );
  }

  const c = resp.data.complaint;
  const isAssigned = c.status === 'ASSIGNED';
  const isInProgress = c.status === 'IN_PROGRESS';
  const isClosedOrResolved = c.status === 'RESOLVED' || c.status === 'CLOSED';
  
  const breachTime = c.slaBreachAt ? new Date(c.slaBreachAt) : new Date(new Date(c.createdAt).getTime() + 48 * 60 * 60 * 1000);
  const urgency = getSlaUrgency(c);

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    updateStatusMutation.mutate({ status: c.status, comments: commentText });
  };

  const handleCompleteClosure = async () => {
    if (closureNotes.trim().length < 10) return;

    if (closureFile) {
      const formData = new FormData();
      formData.append('file', closureFile);
      await uploadMediaMutation.mutateAsync(formData);
    }

    await updateStatusMutation.mutateAsync({
      status: 'RESOLVED',
      comments: closureNotes
    });
  };

  const handleEscalationSubmit = () => {
    if (escalateReason.trim().length < 10) return;
    escalateMutation.mutate({ reason: escalateReason });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 shrink-0">
        <div className="min-w-0">
          <Link 
            to="/officer/incidents" 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assigned Incidents
          </Link>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">{c.complaintNo}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getStatusBadge(c.status)}`}>
              {c.status?.replace(/_/g, ' ')}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getPriorityBadgeClass(c.priority)}`}>
              {c.priority}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5 truncate max-w-xl">
            {c.title}
          </h1>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-sm">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-400 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-sm">
          <AlertCircle className="w-4.5 h-4.5 text-red-600" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Metadata, Description, Evidence, History */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Metadata Card */}
          <div className={`bg-white dark:bg-slate-900 border ${c.aiConfidence < 60 ? 'border-amber-400 dark:border-amber-600 shadow-amber-500/10' : 'border-slate-200/80 dark:border-slate-800/80'} rounded-3xl p-6 shadow-sm`}>
            {c.aiConfidence < 60 && (
              <div className="mb-4 flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 p-2.5 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-800/50">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>AI Confidence is Low ({c.aiConfidence}%). Please verify citizen details carefully.</span>
              </div>
            )}
            
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Incident Information</span>
              {c.aiConfidence != null && (
                <span className="flex items-center gap-1.5 text-[10px] bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800/50">
                  <Sparkles className="w-3 h-3" />
                  AI CONFIDENCE: {c.aiConfidence}%
                </span>
              )}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Department</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{c.department?.name || 'General Response'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Category (AI)</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{c.category?.name || c.aiCategory || 'Other'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Citizen Submitter</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{c.citizen?.name || 'Anonymous citizen'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Address</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[200px]">{c.address || 'Delhi'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommended Action & Summary Card */}
          {c.aiSummary && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-800/50 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xs font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                AI Summary & Recommended Action
              </h3>
              <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
                {c.aiSummary}
              </p>
              
              {c.aiKeywords && c.aiKeywords.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.aiKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] bg-white/60 dark:bg-slate-900/50 border border-indigo-200 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Citizen Description</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-2 border-slate-200 dark:border-slate-800 pl-3">
              "{c.description || 'No additional details provided.'}"
            </p>
          </div>

          {/* Evidence Photos Gallery */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Evidence Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Before Incident (Citizen Evidence)</p>
                <ImageWithFallback 
                  src={c.media?.find(m => m.type === 'CITIZEN_EVIDENCE')?.url} 
                  alt="Incident before closure"
                  label="Before Photo"
                />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">After Resolution (Officer Proof)</p>
                <ImageWithFallback 
                  src={c.media?.find(m => m.type === 'OFFICER_PROOF' || m.type === 'AFTER_PHOTO')?.url} 
                  alt="Incident after resolution proof"
                  label="After Photo"
                />
              </div>
            </div>
          </div>

          {/* Incident Comments Entry */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Add Comment Update
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Log a comment update directly to the complaint event timeline..."
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-white"
              />
              <button
                onClick={handlePostComment}
                disabled={!commentText.trim() || updateStatusMutation.isPending}
                className="px-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-xs font-bold transition-all border border-green-500 flex items-center justify-center shrink-0 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Timeline Logs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Complaint Event Timeline</h3>
            <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-2.5 pl-6 space-y-6">
              {(c.events || []).map((e) => {
                const eventDate = e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + 
                  ', ' + new Date(e.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

                return (
                  <div key={e.id} className="relative">
                    {/* Ring dot */}
                    <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900 shrink-0"></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {e.action?.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-relaxed">
                        {e.comments || 'Status modified.'}
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold block mt-1">
                        Logged by {e.actor?.name || 'Officer'} • {eventDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Hand: SLA Timer, Location Map, Status Workflows */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SLA Countdown Status */}
          {!isClosedOrResolved && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                SLA Compliance Timer
              </h3>
              <div className="space-y-1 text-center py-2">
                <p className={`text-2xl font-bold uppercase tracking-wider ${urgency.label === 'BREACHED' ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {formatSlaCountdown(breachTime)}
                </p>
                <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${urgency.color}`}>
                  {urgency.label}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 text-center leading-relaxed">
                Breach Limit Time: {breachTime.toLocaleDateString()} at {breachTime.toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Maps Preview */}
          {c.latitude && c.longitude && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coordinates Map</h3>
              <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 h-28 relative">
                <img
                  src={`https://staticmap.openstreetmap.de/staticmap.php?center=${c.latitude},${c.longitude}&zoom=13&size=400x150&markers=${c.latitude},${c.longitude},red-pushpin`}
                  alt="Complaint Location Map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 rounded-lg px-2 py-0.5 shadow-sm border border-slate-100 dark:border-slate-800">
                  <Navigation className="w-2.5 h-2.5 text-green-600" />
                  <span className="text-[9px] font-bold text-slate-700">Open Maps</span>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Action Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workflow Panel</h3>
            
            {isAssigned && (
              <button
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
                className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl text-xs transition-colors border border-green-500 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                Accept & Start Work
              </button>
            )}

            {isInProgress && (
              <div className="space-y-3">
                <button
                  onClick={() => setIsClosureOpen(!isClosureOpen)}
                  className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl text-xs transition-colors border border-green-500 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete & Resolve Task
                </button>

                {isClosureOpen && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 animate-fadeIn">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block mb-1">1. Photo Proof</label>
                      <div className="flex gap-2 items-center">
                        <label className="p-2 border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl cursor-pointer hover:border-green-500 flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                          <Camera className="w-3.5 h-3.5 text-slate-400" />
                          <span>Attach Photo</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) setClosureFile(e.target.files[0]);
                            }}
                            className="hidden" 
                          />
                        </label>
                        {closureFile && (
                          <span className="text-[9px] font-bold text-green-600 dark:text-green-400 truncate max-w-[120px]">{closureFile.name}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block mb-1">2. Resolution Details</label>
                      <textarea
                        value={closureNotes}
                        onChange={(e) => setClosureNotes(e.target.value)}
                        placeholder="Describe corrective actions taken (min 10 characters)..."
                        className="w-full h-20 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-medium text-slate-800 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={handleCompleteClosure}
                      disabled={closureNotes.trim().length < 10 || updateStatusMutation.isPending || uploadMediaMutation.isPending}
                      className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs transition-colors border border-green-500 disabled:opacity-50"
                    >
                      {updateStatusMutation.isPending || uploadMediaMutation.isPending ? 'Submitting...' : 'Confirm Resolved'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {isClosedOrResolved && (
              <div className="p-3.5 bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/40 rounded-2xl text-[11px] text-green-700 dark:text-green-400 font-semibold leading-relaxed">
                Task is completed. Verification is handled by the citizen.
              </div>
            )}

            {/* Escalation Request */}
            {!isClosedOrResolved && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                <button
                  onClick={() => setIsEscalateOpen(!isEscalateOpen)}
                  className="w-full py-2 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-red-50/50 dark:hover:bg-red-950/10 text-red-600 dark:text-red-400 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Request Escalation
                </button>

                {isEscalateOpen && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn">
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      Describe the issue that requires manual intervention or operational coordinators reassignment.
                    </p>
                    <textarea
                      value={escalateReason}
                      onChange={(e) => setEscalateReason(e.target.value)}
                      placeholder="Reason for requesting escalation (min 10 characters)..."
                      className="w-full h-20 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-medium text-slate-800 dark:text-white"
                    />
                    {escalateReason.trim().length > 0 && escalateReason.trim().length < 10 && (
                      <p className="text-[9px] text-red-500 font-bold">Minimum 10 characters required.</p>
                    )}
                    <button
                      onClick={handleEscalationSubmit}
                      disabled={escalateReason.trim().length < 10 || escalateMutation.isPending}
                      className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-colors border border-red-500 disabled:opacity-50"
                    >
                      {escalateMutation.isPending ? 'Submitting...' : 'Confirm Escalation'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default IncidentDetailsPage;
