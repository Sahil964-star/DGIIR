import { MessageCircle, UserCheck, RefreshCw, AlertTriangle, FileText, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  MessageCircle: MessageCircle,
  UserCheck: UserCheck,
  RefreshCw: RefreshCw,
  AlertTriangle: AlertTriangle,
  FileText: FileText,
  MapPin: MapPin
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="h-full flex flex-col pt-2 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Incident Updates</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = iconMap[activity.iconName] || FileText;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/35 transition-colors border border-slate-100/50 dark:border-slate-800/40 bg-white dark:bg-slate-900/50"
            >
              <div className={`p-2.5 rounded-full shrink-0 ${activity.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                  {activity.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                  {activity.description}
                </p>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-1.5">
                  {activity.time}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <button className="text-xs font-bold text-green-700 dark:text-green-500 hover:text-green-800 transition-colors">
          View All Updates
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
