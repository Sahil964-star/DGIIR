import React from 'react';
import Card from '../../shared/components/Card';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

const CMDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Chief Minister Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">High-level metrics and city-wide performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Critical Incidents</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">12</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl text-green-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resolution Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">84%</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Reported</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1,204</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-6 h-80 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Incidents by Zone</h2>
          <div className="flex-1 bg-slate-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
             <span className="text-slate-500 dark:text-slate-400">Chart Placeholder</span>
          </div>
        </Card>
        
        <Card className="p-6 h-80 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Response Time Trends</h2>
          <div className="flex-1 bg-slate-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
             <span className="text-slate-500 dark:text-slate-400">Graph Placeholder</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CMDashboard;
