import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const getStatusStyles = (status) => {
  switch (status) {
    case 'Completed': return { dot: 'bg-green-500 ring-green-200 dark:ring-green-900', text: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' };
    case 'In Progress': return { dot: 'bg-blue-500 ring-blue-200 dark:ring-blue-900', text: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' };
    case 'Pending': return { dot: 'bg-slate-300 dark:bg-slate-600 ring-slate-100 dark:ring-slate-800', text: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' };
    default: return { dot: 'bg-slate-300 ring-slate-100', text: 'text-slate-600 bg-slate-100' };
  }
};

const TaskTimeline = ({ tasks }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Tasks</h3>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>21 May 2026</span>
        </div>
      </div>
      
      <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-6">
        {tasks.map((task, index) => {
          const styles = getStatusStyles(task.status);
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="relative pl-6"
            >
              <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full ring-4 ${styles.dot}`}></div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{task.time}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{task.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{task.location}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded font-medium whitespace-nowrap ${styles.text}`}>
                  {task.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <button className="w-full mt-6 py-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
        View Full Schedule
      </button>
    </div>
  );
};

export default TaskTimeline;
