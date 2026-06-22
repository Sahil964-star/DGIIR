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
    <div className="h-full flex flex-col pt-2 font-sans">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Tasks</h3>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
      
      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-2 space-y-8 flex-1">
        {tasks.map((task, index) => {
          const styles = getStatusStyles(task.status);
          const isNextTask = task.status !== 'Completed' && index === tasks.findIndex(t => t.status !== 'Completed');

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className={`relative pl-8 ${isNextTask ? 'bg-blue-50/50 dark:bg-blue-900/10 py-4 -my-4 -ml-4 pl-12 rounded-2xl border-l-4 border-blue-500 shadow-sm' : ''}`}
            >
              <div className={`absolute ${isNextTask ? 'left-[-4px] top-1/2 -translate-y-1/2' : '-left-[9px] top-1.5'} w-4 h-4 rounded-full ring-4 ${styles.dot}`}></div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{task.time}</span>
                    <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">{task.title}</span>
                    {isNextTask && (
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded uppercase tracking-wider ml-1">
                        Next Task
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{task.location}</p>
                </div>
                {!isNextTask && (
                  <span className={`text-[10px] px-2 py-1 rounded font-medium whitespace-nowrap ${styles.text}`}>
                    {task.status}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <button className="w-full mt-6 py-3 text-sm text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
        View Full Schedule
      </button>
    </div>
  );
};

export default TaskTimeline;
