import React from 'react';
import { CheckCircle } from 'lucide-react';

// Mock data for recent resolution activity
const recentActivities = [
  { id: 1, title: 'Water Supply Issue Closed', icon: 'CheckCircle' },
  { id: 2, title: 'Garbage Collection Verified', icon: 'CheckCircle' },
  { id: 3, title: 'Road Damage Approved', icon: 'CheckCircle' },
];

const RecentResolutionActivity = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm p-4 space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Resolution Activity</h3>
      <ul className="space-y-2">
        {recentActivities.map((activity) => (
          <li key={activity.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>{activity.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentResolutionActivity;
