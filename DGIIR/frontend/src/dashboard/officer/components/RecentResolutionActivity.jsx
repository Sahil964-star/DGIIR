import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { officerApi } from '../../../api/officerApi';
import Loader from '../../../shared/components/Loader';

const RecentResolutionActivity = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['officerComplaints'],
    queryFn: () => officerApi.getMyComplaints({ limit: 10 })
  });

  const allComplaints = data?.data?.complaints || data?.complaints || [];
  // Filter for recently resolved/verified
  const recentActivities = allComplaints
    .filter(c => c.status === 'RESOLVED' || c.status === 'VERIFIED')
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm p-4 space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Resolution Activity</h3>
      {isLoading ? (
        <div className="flex justify-center py-2"><Loader size={20} /></div>
      ) : recentActivities.length === 0 ? (
        <p className="text-xs text-slate-500">No recent resolutions.</p>
      ) : (
        <ul className="space-y-2">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="truncate">{activity.title} {activity.status === 'RESOLVED' ? 'Closed' : 'Verified'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
};

export default RecentResolutionActivity;
