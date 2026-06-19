import React from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const CitizenDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Citizen Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Welcome back. Here is an overview of your reports.</p>
        </div>
        <Button className="w-full sm:w-auto">
          <AlertTriangle className="mr-2" size={20} />
          Report New Issue
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">2</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl text-green-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resolved</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">5</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-50 dark:bg-gray-800 rounded-xl text-slate-600 dark:text-slate-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Reports</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">7</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Reports</h2>
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No recent reports to display.
        </div>
      </Card>
    </div>
  );
};

export default CitizenDashboard;
