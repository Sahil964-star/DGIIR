import React from 'react';
import { RefreshCw, Camera, MessageCircle, MapPin } from 'lucide-react';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { id: 'status', name: 'Update Status', icon: RefreshCw, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/50' },
    { id: 'closure', name: 'Submit Closure', icon: Camera, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50' },
    { id: 'comment', name: 'Add Comment', icon: MessageCircle, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100/80 dark:hover:bg-purple-900/50' },
    { id: 'visit', name: 'Log Visit', icon: MapPin, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100/80 dark:hover:bg-amber-900/50' },
  ];

  return (
    <div className="font-sans">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all cursor-pointer ${action.bg} border border-slate-100 dark:border-slate-800/80 shadow-sm flex-1`}
          >
            <div className={`p-2.5 rounded-full ${action.bg.split(' ')[0]} mb-2`}>
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 text-center leading-tight">
              {action.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
