import React from 'react';
import Card from '../../shared/components/Card';
import { MapPin, CheckCircle, ClipboardList } from 'lucide-react';

const OfficerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Field Officer Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">View your assigned tasks and update incident status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl text-rose-600">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">My Tasks</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">4</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl text-green-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resolved Today</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Distance Traveled</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">12km</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Assigned Incidents Map</h2>
        <div className="bg-slate-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center">
          <span className="text-slate-500 dark:text-slate-400 flex items-center">
            <MapPin className="mr-2" />
            Map Integration Placeholder
          </span>
        </div>
      </Card>
    </div>
  );
};

export default OfficerDashboard;
