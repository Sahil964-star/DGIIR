import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-400',
          dot: 'bg-blue-500'
        };
      case 'resolved':
        return {
          bg: 'bg-dgiir-green-100 dark:bg-dgiir-green-900/30',
          text: 'text-dgiir-green-800 dark:text-dgiir-green-400',
          dot: 'bg-dgiir-green-500'
        };
      case 'under review':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-800 dark:text-orange-400',
          dot: 'bg-orange-500'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-800 dark:text-gray-400',
          dot: 'bg-gray-500'
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
