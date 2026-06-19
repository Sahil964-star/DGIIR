import React from 'react';
import { ClipboardList, Clock, AlertTriangle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, icon: Icon, color, subtitle, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
          {subtitle && (
            <p className={`text-xs mt-2 font-medium ${subtitle.color}`}>{subtitle.text}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color.bg}`}>
          <Icon className={`w-5 h-5 ${color.text}`} />
        </div>
      </div>
    </motion.div>
  );
};

const SummaryCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        title="Assigned"
        value={stats.assigned}
        icon={ClipboardList}
        color={{ bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' }}
        subtitle={{ text: '+2 from yesterday', color: 'text-slate-500 dark:text-slate-400' }}
        delay={0.1}
      />
      <SummaryCard
        title="Due Today"
        value={stats.dueToday}
        icon={Clock}
        color={{ bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' }}
        subtitle={{ text: '2 Critical', color: 'text-orange-600 dark:text-orange-400' }}
        delay={0.2}
      />
      <SummaryCard
        title="Overdue"
        value={stats.overdue}
        icon={AlertTriangle}
        color={{ bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' }}
        subtitle={{ text: 'Immediate action needed', color: 'text-red-600 dark:text-red-400' }}
        delay={0.3}
      />
      <SummaryCard
        title="Performance Score"
        value={`${stats.performanceScore}%`}
        icon={Trophy}
        color={{ bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' }}
        subtitle={{ text: 'Good — Keep it up', color: 'text-green-600 dark:text-green-400' }}
        delay={0.4}
      />
    </div>
  );
};

export default SummaryCards;
