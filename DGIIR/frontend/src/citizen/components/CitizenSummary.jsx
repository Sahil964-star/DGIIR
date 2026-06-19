import React from 'react';
import Card from '../../shared/components/Card';

const CitizenSummary = () => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">My Activity</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card noPadding className="p-4 flex flex-col justify-center border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Complaints</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
        </Card>
        <Card noPadding className="p-4 flex flex-col justify-center border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</p>
        </Card>
        <Card noPadding className="p-4 flex flex-col justify-center border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">8</p>
        </Card>
        <Card noPadding className="p-4 flex flex-col justify-center border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Under Review</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</p>
        </Card>
      </div>
    </div>
  );
};

export default CitizenSummary;
