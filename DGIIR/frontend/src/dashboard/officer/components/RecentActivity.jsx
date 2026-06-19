import React from 'react';
import { ArrowRight, MessageCircle, Camera, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const activities = [
  {
    id: 1,
    icon: ArrowRight,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    title: 'INC-2026-0042 marked as In Progress',
    description: 'You started work on the Water Supply Issue.',
    time: 'Today, 11:15 AM'
  },
  {
    id: 2,
    icon: MessageCircle,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    title: 'New comment on INC-2026-0038',
    description: 'Citizen added a follow-up comment.',
    time: 'Today, 09:30 AM'
  },
  {
    id: 3,
    icon: Camera,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    title: 'Site photo uploaded for INC-2026-0029',
    description: 'Evidence photo submitted for road damage.',
    time: 'Yesterday, 04:20 PM'
  },
  {
    id: 4,
    icon: CheckCircle,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    title: 'Closure submitted for INC-2026-0011',
    description: 'Awaiting citizen verification.',
    time: 'Yesterday, 03:45 PM'
  },
  {
    id: 5,
    icon: XCircle,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
    title: 'Citizen rejected INC-2026-0011 closure',
    description: 'Resolution was marked as unsatisfactory.',
    time: 'Yesterday, 06:45 PM'
  }
];

const RecentActivity = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-slate-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">Recent Activity</h3>
        <button className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline">View All</button>
      </div>
      <div className="space-y-1">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.04 * index }}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${activity.iconBg}`}>
              <activity.icon className={`w-3.5 h-3.5 ${activity.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight">{activity.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.description}</p>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0 mt-0.5">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
