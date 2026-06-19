import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const getStatusColor = (status) => {
  switch (status) {
    case 'Assigned':    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'In Progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    case 'Resolved':    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Overdue':     return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:            return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
  }
};

// Priority labels renamed: High → Critical, Medium → At Risk, Low → Stable
const getPriorityConfig = (priority) => {
  switch (priority) {
    case 'High':   return { label: 'Critical', dot: 'bg-red-500',    text: 'text-red-600 dark:text-red-400' };
    case 'Medium': return { label: 'At Risk',  dot: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' };
    case 'Low':    return { label: 'Stable',   dot: 'bg-green-500',  text: 'text-green-600 dark:text-green-400' };
    default:       return { label: priority,   dot: 'bg-slate-400',  text: 'text-slate-500' };
  }
};

const IncidentCard = ({ incident, delay }) => {
  const priority = getPriorityConfig(incident.priority);
  const isOverdue = incident.status === 'Overdue';

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`bg-white dark:bg-gray-900 border rounded-xl p-4 hover:border-green-500 dark:hover:border-green-500 transition-all cursor-pointer group ${
        isOverdue ? 'border-red-200 dark:border-red-900/50' : 'border-slate-200 dark:border-gray-800'
      }`}
    >
      {/* Top row */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{incident.id}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getStatusColor(incident.status)}`}>
            {incident.status}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${priority.text}`}>
          <span className={`w-2 h-2 rounded-full ${priority.dot}`}></span>
          {priority.label}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-snug mb-3">
        {incident.title}
      </h4>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{incident.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>Assigned {incident.assignedDate}</span>
        </div>
        <div className={`flex items-center gap-1.5 ${isOverdue ? 'font-semibold text-red-600 dark:text-red-400' : ''}`}>
          <Clock className={`w-3.5 h-3.5 shrink-0 ${isOverdue ? 'text-red-500' : ''}`} />
          <span>Due {incident.dueDate}</span>
        </div>
      </div>
    </motion.div>
  );
};

const IncidentList = ({ incidents }) => {
  return (
    <div className="bg-[#f8fafc] dark:bg-gray-900/50 rounded-xl p-5 border border-slate-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Assigned Incidents</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{incidents.length} total · sorted by urgency</p>
        </div>
        <select className="text-xs bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option>All Status</option>
          <option>In Progress</option>
          <option>Assigned</option>
          <option>Overdue</option>
        </select>
      </div>

      <div className="space-y-3">
        {incidents.map((incident, index) => (
          <IncidentCard key={incident.id} incident={incident} delay={0.07 * index} />
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-green-600 dark:text-green-400 font-medium hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
        View All Incidents →
      </button>
    </div>
  );
};

export default IncidentList;
