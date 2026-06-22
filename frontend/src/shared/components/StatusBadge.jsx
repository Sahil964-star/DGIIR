import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-400',
          dot: 'bg-blue-500'
        };
      case 'in progress':
      case 'under review':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-800 dark:text-orange-400',
          dot: 'bg-orange-500'
        };
      case 'resolved':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-400',
          dot: 'bg-green-500'
        };
      case 'rejected':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-400',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-800 dark:text-slate-400',
          dot: 'bg-slate-500'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
