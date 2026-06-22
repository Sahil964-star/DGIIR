import React from 'react';
import { MessageCircle, UserCog, RefreshCw, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="h-full flex flex-col pt-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
      </div>
      <div className="flex-1">
        {activities.length === 0 ? (
          <div className="text-slate-500 text-sm">No recent activity.</div>
        ) : (
          activities.map((activity, index) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
