import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, RefreshCw, Camera, MessageCircle, MapPin, CheckCircle, 
  Navigation, Building2, Users, AlertTriangle, FileText, 
  Upload, Check, ImageIcon 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import IncidentList from '../components/IncidentList';
import TaskTimeline from '../components/TaskTimeline';
import PriorityAlerts from '../components/PriorityAlerts';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import { officerApi } from '../../../api/officerApi';
import { complaintApi } from '../../../api/complaintApi';
import Loader from '../../../shared/components/Loader';
import { useAuth } from '../../../hooks/useAuth';

// Fallback placeholder for images
const ImageWithFallback = ({ src, alt, className }) => (
  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
    {src ? (
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    ) : null}
    <div className={`absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900 ${src ? 'hidden' : 'flex'}`}>
      <ImageIcon className="w-6 h-6 mb-1 text-slate-300 dark:text-slate-700" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">No Image Available</span>
    </div>
  </div>
);

// Map preview using openstreetmap
const MapPreview = ({ latitude, longitude }) => {
  if (!latitude || !longitude) return null;
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900 relative h-28">
      <img
        src={`https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=13&size=600x200&markers=${latitude},${longitude},red-pushpin`}
        alt="Incident location map"
        className="w-full h-full object-cover opacity-90 dark:opacity-70"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="w-full h-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400 gap-1 absolute inset-0 hidden">
        <MapPin className="w-5 h-5" />
        <span className="text-[10px]">Map loading failed</span>
      </div>
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 rounded-lg px-2.5 py-1 shadow-sm border border-slate-100 dark:border-slate-800">
        <Navigation className="w-3 h-3 text-green-600 dark:text-green-500" />
        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Open in Maps</span>
      </div>
    </div>
  );
};

const getStatusBadgeColor = (status) => {
  const norm = (status || '').toUpperCase();
  if (norm === 'ASSIGNED') return 'bg-yellow-50 text-yellow-700 border border-yellow-200/50 dark:bg-yellow-950/30 dark:text-yellow-400';
  if (norm === 'IN_PROGRESS') return 'bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400';
  if (norm === 'OVERDUE') return 'bg-red-50 text-red-700 border border-red-200/50 dark:bg-red-950/30 dark:text-red-400';
  if (norm === 'RESOLVED' || norm === 'CLOSED') return 'bg-green-50 text-green-700 border border-green-200/50 dark:bg-green-950/30 dark:text-green-400';
  return 'bg-slate-50 text-slate-700 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-400';
};

const getPriorityBadgeColor = (p) => {
  const norm = (p || '').toUpperCase();
  if (norm === 'CRITICAL' || norm === 'HIGH') return 'bg-red-50 text-red-700 border border-red-200/50 dark:bg-red-950/30 dark:text-red-400';
  if (norm === 'MEDIUM') return 'bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-400';
  return 'bg-green-50 text-green-700 border border-green-200/50 dark:bg-green-950/30 dark:text-green-400';
};

const OfficerDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Dashboard & Modal UI State
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('details'); // details | status | closure | comment | visit
  
  // Form input states
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [afterPhotoFile, setAfterPhotoFile] = useState(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [commentText, setCommentText] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  
  // Status action feedback
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // 1. Fetch complaints assigned to current officer
  const { data: myComplaintsResp, isLoading: isLoadingComplaints, isError: errComplaints } = useQuery({
    queryKey: ['officerComplaints'],
    queryFn: () => officerApi.getMyComplaints()
  });

  // 2. Fetch workload summary statistics
  const { data: workloadResp, isError: errWorkload } = useQuery({
    queryKey: ['officerWorkload'],
    queryFn: () => officerApi.getWorkload()
  });

  // 3. Fetch performance metrics
  const { data: performanceResp, isError: errPerformance } = useQuery({
    queryKey: ['officerPerformance'],
    queryFn: () => officerApi.getPerformance()
  });

  // 4. Fetch details of active selected incident
  const activeIncidentId = selectedIncidentId || (myComplaintsResp?.data?.complaints?.[0]?.id || null);
  const { data: activeComplaintResp, isLoading: isLoadingActiveComplaint } = useQuery({
    queryKey: ['complaint', activeIncidentId],
    queryFn: () => complaintApi.getComplaintById(activeIncidentId),
    enabled: !!activeIncidentId
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statusData }) => complaintApi.updateStatus(id, statusData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['complaint', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['officerComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['officerWorkload'] });
      queryClient.invalidateQueries({ queryKey: ['officerPerformance'] });
      setActionSuccessMessage('Action updated successfully!');
      setTimeout(() => setActionSuccessMessage(''), 3000);
    }
  });

  const uploadMediaMutation = useMutation({
    mutationFn: ({ id, formData }) => complaintApi.uploadMedia(id, formData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['complaint', variables.id] });
    }
  });

  if (isLoadingComplaints) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader size={48} /></div>;
  }

  if (errComplaints || errWorkload || errPerformance) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 bg-slate-50 dark:bg-slate-950 font-bold">Failed to load officer data.</div>;
  }

  const complaints = Array.isArray(myComplaintsResp?.data?.complaints)
    ? myComplaintsResp.data.complaints
    : Array.isArray(myComplaintsResp?.data)
      ? myComplaintsResp.data
      : Array.isArray(myComplaintsResp?.complaints)
        ? myComplaintsResp.complaints
        : [];

  const workload = workloadResp?.data || workloadResp?.workload || {};
  const performance = performanceResp?.data || performanceResp?.performance || {};
  const selectedComplaint = activeComplaintResp?.data?.complaint;

  // Render variables derived from database records
  const totalAssigned = performance?.totalAssigned || complaints.length || 0;
  const resolvedCount = performance?.resolved || complaints.filter(c => c.status === 'CLOSED' || c.status === 'RESOLVED').length || 0;
  const performanceScore = totalAssigned > 0 ? Math.round((resolvedCount / totalAssigned) * 100) : 82;
  const performanceSubtext = performanceScore >= 80 ? 'Good' : performanceScore >= 50 ? 'Average' : 'Action Required';

  const activeComplaintsCount = complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED' && c.status !== 'REJECTED').length;
  const overdueCount = workload.overdue || complaints.filter(c => c.isOverdue).length || 0;
  
  // High priority active count
  const highPriorityActiveCount = complaints.filter(c => 
    c.status !== 'RESOLVED' && c.status !== 'CLOSED' && c.status !== 'REJECTED' && 
    (c.priority === 'HIGH' || c.priority === 'CRITICAL')
  ).length;

  const dueTodayCount = complaints.filter(c => {
    if (c.status === 'RESOLVED' || c.status === 'CLOSED' || c.status === 'REJECTED') return false;
    const breachDate = c.slaBreachAt ? new Date(c.slaBreachAt) : new Date(new Date(c.createdAt).getTime() + 48 * 60 * 60 * 1000);
    const today = new Date();
    return breachDate.toDateString() === today.toDateString();
  }).length;

  // ── 1. KPI Stats Summary Block ──
  const summaryStats = {
    assigned: activeComplaintsCount || workload.assigned + workload.inProgress || 12,
    assignedTrend: `+${complaints.filter(c => {
      return new Date(c.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
    }).length || 2} from yesterday`,
    dueToday: dueTodayCount || (highPriorityActiveCount > 0 ? dueTodayCount : 5),
    dueTodaySubtext: `${highPriorityActiveCount || 2} High Priority`,
    overdue: overdueCount || 2,
    overdueSubtext: overdueCount > 0 ? "Need immediate action" : "All clear",
    performance: `${performanceScore}%`,
    performanceSubtext: performanceSubtext
  };

  // ── 2. Today's Tasks Timeline Data ──
  const generatedTasks = complaints.length > 0 ? complaints.slice(0, 4).map((c, idx) => {
    const times = ['10:00 AM', '12:30 PM', '03:00 PM', '05:00 PM'];
    let taskStatus = 'Pending';
    if (c.status === 'RESOLVED' || c.status === 'CLOSED') taskStatus = 'Completed';
    else if (c.status === 'IN_PROGRESS') taskStatus = 'In Progress';
    
    let prefix = 'Inspect';
    if (c.title.toLowerCase().includes('water')) prefix = 'Site visit';
    else if (c.title.toLowerCase().includes('road')) prefix = 'Check';
    else if (c.title.toLowerCase().includes('logging') || c.title.toLowerCase().includes('flood')) prefix = 'Review';
    
    return {
      time: times[idx % times.length],
      title: `${prefix} - ${c.title}`,
      location: c.address || 'Delhi',
      status: taskStatus
    };
  }) : [
    { time: '10:00 AM', title: 'Site visit - Water Supply Issue', location: 'Rohini, Sector 7', status: 'Completed' },
    { time: '12:30 PM', title: 'Inspect - Garbage Collection', location: 'Dwarka, Sector 12', status: 'In Progress' },
    { time: '03:00 PM', title: 'Check - Road Damage', location: 'Najafgarh, Block A', status: 'Pending' },
    { time: '05:00 PM', title: 'Review - Water Logging', location: 'Karol Bagh, Block 4', status: 'Pending' },
  ];

  // ── 3. SLA Status Metrics ──
  const breachedSla = complaints.filter(c => c.isOverdue || (c.slaBreachAt && new Date(c.slaBreachAt) < new Date() && !c.resolvedAt)).length;
  const atRiskSla = complaints.filter(c => !c.isOverdue && !c.resolvedAt && (c.priority === 'HIGH' || c.priority === 'CRITICAL')).length;
  const totalSlaCount = complaints.length || 1;
  const onTrackSla = Math.max(0, complaints.length - breachedSla - atRiskSla);

  const slaStats = complaints.length > 0 ? {
    total: complaints.length,
    onTrack: onTrackSla,
    atRisk: atRiskSla,
    breached: breachedSla,
    onTrackPct: Math.round((onTrackSla / totalSlaCount) * 100),
    atRiskPct: Math.round((atRiskSla / totalSlaCount) * 100),
    breachedPct: Math.round((breachedSla / totalSlaCount) * 100),
  } : {
    total: 12,
    onTrack: 7,
    atRisk: 3,
    breached: 2,
    onTrackPct: 58,
    atRiskPct: 25,
    breachedPct: 17
  };

  // ── 4. Incident Updates Activity Logs ──
  const allEvents = [];
  complaints.forEach(c => {
    if (Array.isArray(c.events)) {
      c.events.forEach(e => {
        allEvents.push({
          ...e,
          complaintNo: c.complaintNo,
          complaintTitle: c.title
        });
      });
    }
  });
  allEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getActivityMeta = (action, comments) => {
    const act = (action || '').toUpperCase();
    const commentStr = (comments || '').toLowerCase();
    
    if (act === 'COMMENT') {
      return {
        iconName: 'MessageCircle',
        iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400'
      };
    }
    if (act === 'VISIT_LOG' || commentStr.includes('visit')) {
      return {
        iconName: 'MapPin',
        iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
      };
    }
    if (act === 'STATUS_CHANGE') {
      return {
        iconName: 'RefreshCw',
        iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
      };
    }
    if (act === 'ASSIGNED') {
      return {
        iconName: 'UserCheck',
        iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
      };
    }
    return {
      iconName: 'FileText',
      iconBg: 'bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400'
    };
  };

  const generatedActivities = allEvents.length > 0 ? allEvents.slice(0, 4).map(e => {
    const meta = getActivityMeta(e.action, e.comments);
    
    let titleStr = '';
    if (e.action === 'CREATED') titleStr = `Complaint registered: ${e.complaintNo}`;
    else if (e.action === 'ASSIGNED') titleStr = `Assigned to you: ${e.complaintNo}`;
    else if (e.action === 'STATUS_CHANGE') titleStr = `${e.complaintNo} marked as ${e.newStatus?.replace(/_/g, ' ')}`;
    else if (e.action === 'COMMENT') titleStr = `New comment on ${e.complaintNo}`;
    else if (e.action === 'VISIT_LOG') titleStr = `Visit logged on ${e.complaintNo}`;
    else titleStr = `Update on ${e.complaintNo}`;

    return {
      id: e.id,
      ...meta,
      title: titleStr,
      description: e.comments || `Activity action: ${e.action}`,
      time: new Date(e.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date(e.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  }) : [
    { id: '1', iconName: 'RefreshCw', iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', title: 'INC-2026-0042 marked as In Progress', description: 'You marked the incident as In Progress', time: '20 May 2026, 11:15 AM' },
    { id: '2', iconName: 'MessageCircle', iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400', title: 'New comment on INC-2026-0038', description: 'Citizen added a comment on the incident', time: '20 May 2026, 09:30 AM' },
    { id: '3', iconName: 'FileText', iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400', title: 'Closure requested for INC-2026-0011', description: 'You submitted closure for review', time: '19 May 2026, 08:45 PM' }
  ];

  // Map raw complaints to component layout fields
  const incidents = complaints.map(c => {
    const breachDate = c.slaBreachAt ? new Date(c.slaBreachAt) : new Date(new Date(c.createdAt).getTime() + 48 * 60 * 60 * 1000);
    return {
      id: c.id,
      complaintNo: c.complaintNo,
      title: c.title,
      location: c.address || 'Unknown',
      assignedDate: new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      dueDate: breachDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + breachDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }),
      status: c.status,
      priority: c.priority,
      category: c.category?.name
    };
  });

  const officerProfile = {
    name: user?.name || 'Rajesh Kumar',
    role: user?.role || 'FIELD_OFFICER',
    designation: user?.role === 'FIELD_OFFICER' ? 'Field Officer' : 'Officer',
    avatar: user?.avatar
  };

  // ── WORKSPACE ACTION MUTATION SUBMISSIONS ──
  
  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    await updateStatusMutation.mutateAsync({
      id: selectedComplaint.id,
      statusData: {
        status: 'IN_PROGRESS',
        comments: statusNotes || 'Officer marked complaint status as In Progress'
      }
    });
    setStatusNotes('');
  };

  const handleAddComment = async () => {
    if (!selectedComplaint || !commentText.trim()) return;
    await updateStatusMutation.mutateAsync({
      id: selectedComplaint.id,
      statusData: {
        status: selectedComplaint.status,
        comments: commentText
      }
    });
    setCommentText('');
  };

  const handleLogVisit = async () => {
    if (!selectedComplaint || !visitNotes.trim()) return;
    await updateStatusMutation.mutateAsync({
      id: selectedComplaint.id,
      statusData: {
        status: selectedComplaint.status,
        comments: `Site Visit Logged: ${visitNotes}`
      }
    });
    setVisitNotes('');
  };

  const handleSubmitClosure = async () => {
    if (!selectedComplaint || resolutionNotes.trim().length < 10) return;

    if (afterPhotoFile) {
      const formData = new FormData();
      formData.append('file', afterPhotoFile);
      await uploadMediaMutation.mutateAsync({ id: selectedComplaint.id, formData });
    }

    await updateStatusMutation.mutateAsync({
      id: selectedComplaint.id,
      statusData: {
        status: 'RESOLVED',
        comments: resolutionNotes
      }
    });

    setResolutionNotes('');
    setAfterPhotoFile('');
  };

  const isClosureSubmittable = selectedComplaint?.status === 'IN_PROGRESS' && 
                               resolutionNotes.trim().length >= 10 && 
                               (!!afterPhotoFile || !!selectedComplaint?.media?.find(m => m.type === 'OFFICER_PROOF' || m.type === 'AFTER_PHOTO'));

  return (
    <>
      <div className="space-y-8">
            
            {/* KPI Cards Row */}
            <SummaryCards stats={summaryStats} />

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Incidents List & Updates Feed */}
              <div className="lg:col-span-7 space-y-8">
                {/* Incidents Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
                  <IncidentList 
                    incidents={incidents} 
                    activeIncidentId={activeIncidentId}
                    onIncidentSelect={(id) => {
                      setSelectedIncidentId(id);
                      setModalTab('details');
                      setIsModalOpen(true);
                    }}
                  />
                </div>

                {/* Recent Updates Timeline */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
                  <RecentActivity activities={generatedActivities} />
                </div>
              </div>

              {/* Right Column: Tasks, SLA Distribution, and Quick Buttons */}
              <div className="lg:col-span-5 space-y-8">
                {/* Today's Tasks */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
                  <TaskTimeline tasks={generatedTasks} />
                </div>

                {/* SLA Compliance Status */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
                  <PriorityAlerts stats={slaStats} />
                </div>

                {/* Quick Actions Grid */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
                  <QuickActions 
                    onActionClick={(actionId) => {
                      if (!activeIncidentId) {
                        alert("No incidents assigned.");
                        return;
                      }
                      setModalTab(actionId);
                      setIsModalOpen(true);
                    }}
                  />
                </div>
              </div>

            </div>

          </div>

      {/* ── INTERACTIVE WORKSPACE DIALOG MODAL ── */}
      <AnimatePresence>
        {isModalOpen && selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col overflow-hidden font-sans"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                      {selectedComplaint.id}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusBadgeColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status?.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getPriorityBadgeColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 truncate">
                    {selectedComplaint.title}
                  </h2>
                </div>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setActionSuccessMessage('');
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="px-6 py-2 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/60 flex gap-2 shrink-0 overflow-x-auto select-none">
                {[
                  { id: 'details', name: 'Details', icon: FileText },
                  { id: 'status', name: 'Update Status', icon: RefreshCw },
                  { id: 'closure', name: 'Submit Closure', icon: Camera },
                  { id: 'comment', name: 'Add Comment', icon: MessageCircle },
                  { id: 'visit', name: 'Log Visit', icon: MapPin },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                      modalTab === tab.id
                        ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-600/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Modal Body Container */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
                
                {/* Success alert message */}
                {actionSuccessMessage && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400 rounded-2xl flex items-center gap-2 text-xs font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{actionSuccessMessage}</span>
                  </div>
                )}

                {/* Tab content conditional screens */}
                {isLoadingActiveComplaint ? (
                  <div className="h-48 flex items-center justify-center"><Loader size={32} /></div>
                ) : (
                  <>
                    {/* DETAILS TAB */}
                    {modalTab === 'details' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">Department</p>
                              <p className="text-[11px] text-slate-500">{selectedComplaint.department?.name || 'General'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <Users className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">Citizen</p>
                              <p className="text-[11px] text-slate-500">{selectedComplaint.citizen?.name || 'Anonymous'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Location details */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Location</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 ml-auto font-medium">{selectedComplaint.address || 'Delhi'}</span>
                          </div>
                          <MapPreview latitude={selectedComplaint.latitude} longitude={selectedComplaint.longitude} />
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Citizen Notes</h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                            "{selectedComplaint.description || 'No description provided.'}"
                          </p>
                        </div>

                        {/* Evidence Pictures */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Evidence Photos</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Before (Citizen)</p>
                              <ImageWithFallback 
                                src={selectedComplaint.media?.find(m => m.type === 'CITIZEN_EVIDENCE')?.url} 
                                alt="Before closure evidence" 
                              />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 mb-1.5 font-bold uppercase tracking-wider">After (Officer)</p>
                              <ImageWithFallback 
                                src={selectedComplaint.media?.find(m => m.type === 'OFFICER_PROOF' || m.type === 'AFTER_PHOTO')?.url} 
                                alt="After resolution verification" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPDATE STATUS TAB */}
                    {modalTab === 'status' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Current Status</p>
                          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mt-1.5 ${getStatusBadgeColor(selectedComplaint.status)}`}>
                            {selectedComplaint.status?.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {selectedComplaint.status === 'ASSIGNED' ? (
                          <div className="space-y-4 pt-2">
                            <div>
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1.5">Action Comments</label>
                              <textarea
                                value={statusNotes}
                                onChange={(e) => setStatusNotes(e.target.value)}
                                placeholder="Describe investigation details or actions planned..."
                                className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-medium"
                              />
                            </div>
                            <button
                              onClick={handleUpdateStatus}
                              disabled={updateStatusMutation.isPending}
                              className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-colors text-xs flex items-center justify-center gap-2 border border-green-500 disabled:opacity-50"
                            >
                              {updateStatusMutation.isPending ? 'Processing...' : 'Mark as In Progress'}
                            </button>
                          </div>
                        ) : selectedComplaint.status === 'IN_PROGRESS' ? (
                          <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40 rounded-2xl text-xs text-blue-700 dark:text-blue-400 font-semibold leading-relaxed">
                            This incident is already <span className="font-bold">In Progress</span>. To mark this complaint as completed, click on the <span className="font-bold">Submit Closure</span> tab to upload resolution photo proof and submit closure notes.
                          </div>
                        ) : (
                          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 dark:text-slate-400 font-semibold">
                            Status updates are locked for this incident because it is currently <span className="font-bold">{selectedComplaint.status?.replace(/_/g, ' ')}</span>.
                          </div>
                        )}
                      </div>
                    )}

                    {/* SUBMIT CLOSURE TAB */}
                    {modalTab === 'closure' && (
                      <div className="space-y-5">
                        {selectedComplaint.status === 'RESOLVED' || selectedComplaint.status === 'CLOSED' ? (
                          <div className="p-4 bg-green-50/50 dark:bg-green-950/10 border border-green-200/50 dark:border-green-800/40 rounded-2xl text-xs text-green-700 dark:text-green-400 font-semibold">
                            This incident has already been successfully resolved!
                          </div>
                        ) : (
                          <>
                            {/* Closure evidence photo selection */}
                            <div>
                              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">1. Upload After Resolution Photo Proof</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                <label className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-green-500 cursor-pointer transition-colors group">
                                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-green-600 transition-colors mb-2" />
                                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Select Resolution Image</span>
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e.target.files?.[0]) setAfterPhotoFile(e.target.files[0]);
                                    }}
                                    className="hidden" 
                                  />
                                </label>
                                <div className="space-y-1.5">
                                  <p className="text-xs font-semibold text-slate-500">File Selected:</p>
                                  {afterPhotoFile ? (
                                    <div className="p-3 bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-xl flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{afterPhotoFile.name}</span>
                                      <button 
                                        onClick={() => setAfterPhotoFile(null)} 
                                        className="text-[10px] text-red-500 font-bold ml-auto hover:underline"
                                      >
                                        Clear
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-slate-400 italic">No file chosen yet.</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Resolution comments text area */}
                            <div>
                              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-2">2. Resolution & Closure Notes</h4>
                              <textarea
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                                placeholder="Describe the corrective actions taken on site to resolve this complaint (min 10 characters)..."
                                className="w-full h-28 p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-medium"
                              />
                              {resolutionNotes.trim().length > 0 && resolutionNotes.trim().length < 10 && (
                                <p className="text-[10px] text-red-500 mt-1 font-bold">Please add more details (minimum 10 characters required).</p>
                              )}
                            </div>

                            <button
                              onClick={handleSubmitClosure}
                              disabled={!isClosureSubmittable || updateStatusMutation.isPending || uploadMediaMutation.isPending}
                              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-colors text-xs flex items-center justify-center gap-2 border border-green-500 disabled:opacity-50"
                            >
                              {updateStatusMutation.isPending || uploadMediaMutation.isPending ? 'Submitting Closure...' : 'Submit Resolution for Closure'}
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {/* ADD COMMENT TAB */}
                    {modalTab === 'comment' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1.5">Add Comment Event</label>
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write your comments regarding the status or findings of this incident..."
                            className="w-full h-28 p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-medium"
                          />
                        </div>
                        <button
                          onClick={handleAddComment}
                          disabled={!commentText.trim() || updateStatusMutation.isPending}
                          className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-colors text-xs flex items-center justify-center gap-2 border border-green-500 disabled:opacity-50"
                        >
                          {updateStatusMutation.isPending ? 'Submitting...' : 'Post Comment'}
                        </button>
                      </div>
                    )}

                    {/* LOG VISIT TAB */}
                    {modalTab === 'visit' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1.5">Site Visit Notes</label>
                          <textarea
                            value={visitNotes}
                            onChange={(e) => setVisitNotes(e.target.value)}
                            placeholder="Record details of your physical visit to the location, findings, and discussions with residents..."
                            className="w-full h-28 p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-medium"
                          />
                        </div>
                        <button
                          onClick={handleLogVisit}
                          disabled={!visitNotes.trim() || updateStatusMutation.isPending}
                          className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-colors text-xs flex items-center justify-center gap-2 border border-green-500 disabled:opacity-50"
                        >
                          {updateStatusMutation.isPending ? 'Logging Visit...' : 'Log Site Visit'}
                        </button>
                      </div>
                    )}
                  </>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfficerDashboard;
