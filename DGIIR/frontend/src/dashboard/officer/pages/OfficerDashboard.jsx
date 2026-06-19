import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import IncidentList from '../components/IncidentList';
import TaskTimeline from '../components/TaskTimeline';
import PriorityAlerts from '../components/PriorityAlerts';
import CitizenFeedback from '../components/CitizenFeedback';
import RecentActivity from '../components/RecentActivity';
import IncidentWorkspace from '../components/IncidentWorkspace';
import { officerProfile, summaryStats, incidents, todayTasks, priorityAlerts } from '../data';

const OfficerDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex">
      <Sidebar officerProfile={officerProfile} />

      <div className="flex-1 flex flex-col md:ml-[280px] w-full min-w-0">
        <Header officerProfile={officerProfile} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full space-y-6">

            {/* ── KPI Row ── */}
            <SummaryCards stats={summaryStats} />

            {/* ── Main Working Area: Assigned Incidents (~65%) + Active Incident (~35%) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <IncidentList incidents={incidents} />
              </div>
              <div className="lg:col-span-4">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 pl-1">Active Incident</p>
                <div className="h-[620px]">
                  <IncidentWorkspace />
                </div>
              </div>
            </div>

            {/* ── Second Row: Today's Tasks (50%) + Citizen Verification (50%) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 pl-1">Today's Tasks</p>
                <TaskTimeline tasks={todayTasks} />
              </div>
              <div>
                <p className="text-xs font-bold text-green-600 dark:text-green-500 uppercase tracking-wider mb-2 pl-1">⬤ Citizen Verification</p>
                <CitizenFeedback verification={summaryStats.verification} />
              </div>
            </div>

            {/* ── Third Row: Recent Activity (50%) + Priority Alerts (50%) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div>
                <RecentActivity />
              </div>
              <div>
                <PriorityAlerts alerts={priorityAlerts} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficerDashboard;
