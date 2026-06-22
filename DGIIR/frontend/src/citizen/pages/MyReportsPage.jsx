import React from 'react';
import ComplaintList from '../components/ComplaintList';

const MyReportsPage = () => {
  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          My Complaints
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          View and track all complaints you have submitted.
        </p>
      </div>
      <ComplaintList />
    </div>
  );
};

export default MyReportsPage;
