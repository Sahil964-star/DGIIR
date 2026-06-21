import React from 'react';
import { ClipboardList, Clock, AlertTriangle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, icon: Icon, color, delay, showDivider }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex-1 min-w-[200px] flex items-start gap-5 ${showDivider ? 'lg:border-r lg:border-slate-200 lg:dark:border-gray-800/60 lg:pr-8' : ''}`}
    >
      <div className={`p-3.5 rounded-full ${color.bg}`}>
        <Icon className={`w-6 h-6 ${color.text}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h3>
      </div>
    </motion.div>
  );
};

const SummaryCards = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-y-8 gap-x-8 lg:gap-x-12 py-6 border-b border-slate-200 dark:border-gray-800/50 mb-8">
      <SummaryCard
        title="Assigned Cases"
        value={stats.assigned}
        icon={ClipboardList}
        color={{ bg: 'bg-blue-50/80 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' }}
        delay={0.1}
        showDivider={true}
      />
      <SummaryCard
        title="In Progress"
        value={stats.inProgress}
        icon={Clock}
        color={{ bg: 'bg-orange-50/80 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' }}
        delay={0.2}
        showDivider={true}
      />
      <SummaryCard
        title="Overdue"
        value={stats.overdue}
        icon={AlertTriangle}
        color={{ bg: 'bg-red-50/80 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' }}
        delay={0.3}
        showDivider={true}
      />
      <SummaryCard
        title="Resolved"
        value={stats.resolved}
        icon={Trophy}
        color={{ bg: 'bg-green-50/80 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' }}
        delay={0.4}
        showDivider={false}
      />
    </div>
  );
};

export default SummaryCards;
