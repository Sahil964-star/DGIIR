import React from 'react';
import Card from '../../shared/components/Card';
import { useQuery } from '@tanstack/react-query';
import { complaintApi } from '../../api/complaintApi';

const CitizenSummary = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-complaints'],
    queryFn: () => complaintApi.getComplaints()
  });

  if (isError) {
    return <div className="mt-6 text-red-500">Failed to load activity summary.</div>;
  }

  const complaints = data?.data?.complaints || data?.complaints || [];

  const total = complaints.length;
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const underReview = complaints.filter(c => c.status === 'REVIEWED' || c.status === 'ACKNOWLEDGED').length;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">My Activity</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card noPadding className="p-4 flex flex-col justify-center border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Complaints</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{isLoading ? '-' : total}</p>
        </Card>
        <Card noPadding className="p-4 flex flex-col justify-center border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{isLoading ? '-' : inProgress}</p>
        </Card>
        <Card noPadding className="p-4 flex flex-col justify-center border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{isLoading ? '-' : resolved}</p>
        </Card>
        <Card noPadding className="p-4 flex flex-col justify-center border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Under Review</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{isLoading ? '-' : underReview}</p>
        </Card>
      </div>
    </div>
  );
};

export default CitizenSummary;
