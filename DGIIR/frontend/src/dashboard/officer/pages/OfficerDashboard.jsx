import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import IncidentList from '../components/IncidentList';
import TaskTimeline from '../components/TaskTimeline';
import PriorityAlerts from '../components/PriorityAlerts';
import CitizenFeedback from '../components/CitizenFeedback';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import IncidentWorkspace from '../components/IncidentWorkspace';
import RecentResolutionActivity from '../components/RecentResolutionActivity';
import { officerProfile, summaryStats, incidents, todayTasks, priorityAlerts } from '../data';

const OfficerDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex">
      <Sidebar officerProfile={officerProfile} />

      <div className="flex-1 flex flex-col md:ml-64 w-full min-w-0">
        <Header officerProfile={officerProfile} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* ── KPI Row ── */}
            <SummaryCards stats={summaryStats} />

            {/* ── ROW 1: Assigned Incidents (2/5) + Closure Workflow (3/5) ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
              <div className="xl:col-span-2">
                <IncidentList incidents={incidents} />
              </div>
              <div className="xl:col-span-3">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 pl-1">Closure Workflow</p>
                <div className="h-[620px]">
                  <IncidentWorkspace />
                </div>
              </div>
            </div>

            {/* ── ROW 2: Quick Actions (2/5) + Today's Tasks (3/5) ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
              <div className="xl:col-span-2">
                <QuickActions />
              </div>
              <div className="xl:col-span-3">
                <TaskTimeline tasks={todayTasks} />
              </div>
            </div>

            {/* ── ROW 3: Recent Activity (1/2) + Citizen Verification (1/2) ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              <div>
                <RecentActivity />
              </div>
              <div>
                <p className="text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-widest mb-2 pl-1">⬤ Citizen Verification</p>
                <CitizenFeedback verification={summaryStats.verification} />
              </div>
            </div>

            {/* ── ROW 4: Priority Alerts (1/2) + Recent Resolution Activity (1/2) ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              <div>
                <PriorityAlerts alerts={priorityAlerts} />
              </div>
              <div>
                <RecentResolutionActivity />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficerDashboard;
