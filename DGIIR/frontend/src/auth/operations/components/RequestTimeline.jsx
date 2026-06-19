import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

const RequestTimeline = ({ currentStatus = 'review' }) => {
  // Define the timeline states
  const states = [
    { id: 'submitted', label: 'Submitted', description: 'Request logged' },
    { id: 'review', label: 'Under Review', description: 'Audit validation' },
    { id: 'verification', label: 'Verification', description: 'Security clearance' },
    { id: 'approved', label: 'Approved / Rejected', description: 'Terminal States' }
  ];

  // Determine active states
  const getStatusIndex = (status) => {
    return states.findIndex(s => s.id === status);
  };
  
  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10"></div>
        <div 
          className="absolute top-5 left-0 h-1 bg-green-500 transition-all duration-700 -z-10" 
          style={{ width: `${(currentIndex / (states.length - 1)) * 100}%` }}
        ></div>

        <div className="flex justify-between relative z-10">
          {states.map((state, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={state.id} className="flex flex-col items-center w-1/4">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                    isCompleted 
                      ? 'bg-green-600 border-green-200 dark:border-green-900/50 text-white' 
                      : isCurrent
                        ? 'bg-amber-500 border-amber-200 dark:border-amber-900/50 text-white animate-pulse'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={3} />
                  ) : isCurrent ? (
                    <AlertCircle size={18} />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <h4 className={`text-sm font-bold ${
                    isCurrent ? 'text-amber-600 dark:text-amber-500' : 
                    isCompleted ? 'text-green-700 dark:text-green-500' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {state.label}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 hidden sm:block">
                    {state.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RequestTimeline;
