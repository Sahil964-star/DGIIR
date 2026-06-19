import React from 'react';
import { AlertOctagon, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const PriorityAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: 'high_priority',
      message: '2 complaints have exceeded resolution deadlines.',
      date: 'Today, 09:00 AM'
    },
    {
      id: 2,
      type: 'rejection',
      message: 'Citizen rejected your resolution for INC-2026-0011.',
      date: 'Yesterday, 06:45 PM'
    },
    {
      id: 3,
      type: 'escalation',
      message: 'Supervisor marked INC-2026-0042 as critical.',
      date: 'Yesterday, 02:15 PM'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Priority Alerts</h3>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <motion.div 
            key={alert.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 * index }}
            className={`p-3 rounded-lg flex items-start gap-3 border ${
              alert.type === 'high_priority' 
                ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30' 
                : alert.type === 'rejection'
                ? 'bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-900/30'
                : 'bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-900/30'
            }`}
          >
            {alert.type === 'high_priority' ? (
              <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            ) : alert.type === 'rejection' ? (
              <XCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-semibold ${
                alert.type === 'high_priority' ? 'text-red-800 dark:text-red-300' : 
                alert.type === 'rejection' ? 'text-orange-800 dark:text-orange-300' :
                'text-yellow-800 dark:text-yellow-300'
              }`}>
                {alert.message}
              </p>
              <p className={`text-[10px] mt-1 font-medium ${
                alert.type === 'high_priority' ? 'text-red-600/80 dark:text-red-400/80' : 
                alert.type === 'rejection' ? 'text-orange-600/80 dark:text-orange-400/80' :
                'text-yellow-600/80 dark:text-yellow-400/80'
              }`}>
                {alert.date}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PriorityAlerts;
