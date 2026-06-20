import React from 'react';
import { MessageCircle, UserCog, RefreshCw, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const activities = [
  {
    id: 1,
    icon: MessageCircle,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    title: 'Citizen reported muddy water.',
    description: 'INC-2026-0038 • "The water supply is still very muddy."',
    time: '15 mins ago'
  },
  {
    id: 2,
    icon: UserCog,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
    title: 'Supervisor escalated priority.',
    description: 'INC-2026-0042 • Marked as critical.',
    time: '1 hr ago'
  },
  {
    id: 3,
    icon: RefreshCw,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    title: 'Photo evidence uploaded.',
    description: 'INC-2026-0029 • Added to your queue.',
    time: '2 hrs ago'
  },
  {
    id: 4,
    icon: XCircle,
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    title: 'Closure request rejected.',
    description: 'INC-2026-0011 • Citizen submitted feedback.',
    time: 'Yesterday'
  }
];

const RecentActivity = () => {
  return (
    <div className="h-full flex flex-col pt-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
      </div>
      <div className="flex-1">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.04 * index }}
            className="flex items-start gap-4 py-4 px-2 border-b border-slate-200 dark:border-gray-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors rounded-xl -mx-2"
          >
            <div className={`p-2.5 rounded-full shrink-0 ${activity.iconBg}`}>
              <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{activity.title}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">{activity.description}</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0 pt-0.5">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
