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
          <div className="w-full max-w-7xl mx-auto space-y-16">

            {/* ── KPI Row ── */}
            <SummaryCards stats={summaryStats} />

            {/* ── Main Working Area: Assigned Incidents (~65%) + Active Incident (~35%) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-8">
                <IncidentList incidents={incidents} />
              </div>
              <div className="lg:col-span-4 pl-0 lg:pl-4 border-t pt-8 lg:pt-0 lg:border-t-0 lg:border-l border-slate-200 dark:border-gray-800/60 h-full">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Active Workspace</h3>
                <div className="h-[700px]">
                  <IncidentWorkspace />
                </div>
              </div>
            </div>

            {/* ── Second Row: Today's Tasks (50%) + Citizen Verification (50%) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start border-t border-slate-200 dark:border-gray-800/60 pt-12">
              <div>
                <TaskTimeline tasks={todayTasks} />
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
