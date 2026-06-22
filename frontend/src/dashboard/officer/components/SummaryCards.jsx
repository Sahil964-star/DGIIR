import React from 'react';
import { ClipboardList, Clock, AlertTriangle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, subtext, subtextColor, icon: Icon, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all flex items-start gap-4 h-full"
    >
      <div className={`p-3.5 rounded-xl ${color.bg} shrink-0`}>
        <Icon className={`w-6 h-6 ${color.text}`} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white leading-none mb-1.5">{value}</h3>
        {subtext && (
          <p className={`text-xs font-bold ${subtextColor || 'text-slate-400'}`}>{subtext}</p>
        )}
      </div>
    </motion.div>
  );
};

const SummaryCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-sans">
      <SummaryCard
        title="Assigned Incidents"
        value={stats.assigned}
        subtext={stats.assignedTrend || "+2 from yesterday"}
        subtextColor="text-emerald-600 dark:text-emerald-400"
        icon={ClipboardList}
        color={{ bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400' }}
        delay={0.1}
      />
      <SummaryCard
        title="Due Today"
        value={stats.dueToday}
        subtext={stats.dueTodaySubtext || "2 High Priority"}
        subtextColor="text-orange-600 dark:text-orange-400"
        icon={Clock}
        color={{ bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-600 dark:text-orange-400' }}
        delay={0.2}
      />
      <SummaryCard
        title="Overdue"
        value={stats.overdue}
        subtext={stats.overdueSubtext || "Need immediate action"}
        subtextColor="text-red-600 dark:text-red-400"
        icon={AlertTriangle}
        color={{ bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-600 dark:text-red-400' }}
        delay={0.3}
      />
      <SummaryCard
        title="Performance Score"
        value={stats.performance}
        subtext={stats.performanceSubtext || "Good"}
        subtextColor={stats.performanceSubtextColor || "text-emerald-600 dark:text-emerald-400"}
        icon={Trophy}
        color={stats.performanceColor || { bg: 'bg-green-50 dark:bg-green-950/40', text: 'text-green-600 dark:text-green-400' }}
        delay={0.4}
      />
    </div>
  );
};

export default SummaryCards;
