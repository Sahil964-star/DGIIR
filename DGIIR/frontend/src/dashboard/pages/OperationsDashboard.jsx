import React from 'react';
import Card from '../../shared/components/Card';
import { Activity, Users, AlertCircle } from 'lucide-react';

const OperationsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Operations Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage triage queue and field officer assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Triage Queue</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">14</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Incidents</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">32</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Officers</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">8</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Unassigned Incidents</h2>
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No unassigned incidents in the triage queue.
        </div>
      </Card>
    </div>
  );
};

export default OperationsDashboard;
