import React from 'react';
import { Camera, FileUp, MessageSquare, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickActions = () => {
  const actions = [
    { name: 'Update Status', icon: ArrowRight, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40' },
    { name: 'Upload Photo', icon: Camera, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', hover: 'hover:bg-green-100 dark:hover:bg-green-900/40' },
    { name: 'Submit Closure', icon: FileUp, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40' },
    { name: 'Add Comment', icon: MessageSquare, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/40' },
    { name: 'Escalate', icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', hover: 'hover:bg-red-100 dark:hover:bg-red-900/40' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-slate-200 dark:border-gray-800 shadow-sm">
      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Quick Actions</h3>
      <div className="grid grid-cols-5 gap-2">
        {actions.map((action, index) => (
          <motion.button
            key={action.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 * index }}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg transition-all ${action.bg} ${action.hover} border border-transparent hover:border-slate-200 dark:hover:border-slate-700`}
          >
            <action.icon className={`w-5 h-5 mb-1.5 ${action.color}`} />
            <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
              {action.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
