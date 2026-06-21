import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import IncidentList from '../components/IncidentList';
import TaskTimeline from '../components/TaskTimeline';
import PriorityAlerts from '../components/PriorityAlerts';
import CitizenFeedback from '../components/CitizenFeedback';
import RecentActivity from '../components/RecentActivity';
import IncidentWorkspace from '../components/IncidentWorkspace';
import { officerApi } from '../../../api/officerApi';
import Loader from '../../../shared/components/Loader';
import { useAuth } from '../../../hooks/useAuth';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

  const { data: myComplaintsResp, isLoading: isLoadingComplaints, isError: errComplaints } = useQuery({
    queryKey: ['officerComplaints'],
    queryFn: () => officerApi.getMyComplaints()
  });

  const { data: workloadResp, isError: errWorkload } = useQuery({
    queryKey: ['officerWorkload'],
    queryFn: () => officerApi.getWorkload()
  });

  const { data: performanceResp, isError: errPerformance } = useQuery({
    queryKey: ['officerPerformance'],
    queryFn: () => officerApi.getPerformance()
  });

  if (isLoadingComplaints) {
    return <div className="min-h-screen flex items-center justify-center"><Loader size={48} /></div>;
  }

  if (errComplaints || errWorkload || errPerformance) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load officer data.</div>;
  }

  const complaints = myComplaintsResp?.data || myComplaintsResp?.complaints || [];
  const workload = workloadResp?.data || workloadResp?.workload || {};
  const performance = performanceResp?.data || performanceResp?.performance || {};

  const summaryStats = {
    assigned: workload.assigned || 0,
    inProgress: workload.inProgress || 0,
    overdue: workload.overdue || 0,
    resolved: performance.resolved || 0,
    verification: performance.verificationPending || 0
  };

  const incidents = complaints.map(c => ({
    id: c.id,
    title: c.title,
    location: c.address || 'Unknown',
    time: new Date(c.createdAt).toLocaleTimeString(),
    status: c.status,
    severity: c.priority || 'MEDIUM',
    priority: c.priority,
  }));

  // Auto-select first incident if none selected
  const activeIncidentId = selectedIncidentId || (incidents.length > 0 ? incidents[0].id : null);

  const officerProfile = {
    name: user?.name,
    role: user?.role,
    id: user?.id,
    zone: user?.department?.name || user?.departmentId,
    avatar: user?.avatar,
    contact: user?.phone
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex">
      <Sidebar officerProfile={officerProfile} />

      <div className="flex-1 flex flex-col md:ml-[280px] w-full min-w-0">
        <Header officerProfile={officerProfile} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto space-y-16">

            {/* ── KPI Row ── */}
            <SummaryCards stats={summaryStats} />

            {/* ── Main Working Area: Assigned Incidents (~65%) + Active Incident (~35%) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-8">
                <div onClick={(e) => {
                  // Capture clicks on the IncidentList and try to find the incident id
                  const target = e.target.closest('[data-incident-id]');
                  if (target) {
                    setSelectedIncidentId(target.getAttribute('data-incident-id'));
                  }
                }}>
                  <IncidentList incidents={incidents} />
                </div>
              </div>
              <div className="lg:col-span-4 pl-0 lg:pl-4 border-t pt-8 lg:pt-0 lg:border-t-0 lg:border-l border-slate-200 dark:border-gray-800/60 h-full">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Active Workspace</h3>
                <div className="h-[700px]">
                  {activeIncidentId ? (
                    <IncidentWorkspace incidentId={activeIncidentId} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">No active incidents.</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Second Row: Today's Tasks (50%) + Citizen Verification (50%) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start border-t border-slate-200 dark:border-gray-800/60 pt-12">
              <div>
                <TaskTimeline tasks={[]} />
              </div>
              <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-gray-800/60 pt-8 lg:pt-0 lg:pl-16 h-full">
                <CitizenFeedback verification={summaryStats.verification} />
              </div>
            </div>

            {/* ── Third Row: Recent Activity (50%) + Priority Alerts (50%) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start border-t border-slate-200 dark:border-gray-800/60 pt-12 pb-12">
              <div>
                <RecentActivity />
              </div>
              <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-gray-800/60 pt-8 lg:pt-0 lg:pl-16 h-full">
                <PriorityAlerts alerts={[]} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficerDashboard;
