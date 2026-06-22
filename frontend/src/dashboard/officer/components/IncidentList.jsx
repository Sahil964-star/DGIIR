import React, { useState } from 'react';
import { 
  MapPin, Calendar, Clock, AlertTriangle, 
  ChevronRight, Droplet, Trash2, Zap, ShieldAlert 
} from 'lucide-react';
import { motion } from 'framer-motion';

const getCategoryIcon = (categoryName) => {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('water')) return { icon: Droplet, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' };
  if (name.includes('garbage') || name.includes('waste') || name.includes('sanitation')) {
    return { icon: Trash2, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' };
  }
  if (name.includes('power') || name.includes('elect')) {
    return { icon: Zap, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' };
  }
  return { icon: AlertTriangle, color: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' };
};

const getStatusColor = (status) => {
  const norm = (status || '').toUpperCase();
  if (norm === 'ASSIGNED') return 'bg-yellow-50 text-yellow-700 border border-yellow-200/50 dark:bg-yellow-950/30 dark:text-yellow-400';
  if (norm === 'IN_PROGRESS') return 'bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400';
  if (norm === 'OVERDUE') return 'bg-red-50 text-red-700 border border-red-200/50 dark:bg-red-950/30 dark:text-red-400';
  if (norm === 'RESOLVED' || norm === 'CLOSED') return 'bg-green-50 text-green-700 border border-green-200/50 dark:bg-green-950/30 dark:text-green-400';
  return 'bg-slate-50 text-slate-700 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-400';
};

const IncidentCard = ({ incident, isActive, onClick }) => {
  const cat = getCategoryIcon(incident.title || incident.category);
  const Icon = cat.icon;
  const isOverdue = incident.status?.toUpperCase() === 'OVERDUE';
  const priority = incident.priority || 'MEDIUM';

  const getPriorityColor = (p) => {
    const norm = p.toUpperCase();
    if (norm === 'CRITICAL' || norm === 'HIGH') return 'bg-red-500';
    if (norm === 'MEDIUM') return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
        isActive 
          ? 'bg-slate-50 dark:bg-slate-800/80 border-green-600 dark:border-green-500 shadow-sm ring-1 ring-green-500/20' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Category Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${cat.color}`}>
          <Icon size={22} />
        </div>

        {/* Details Area */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              {incident.complaintNo || `INC-${incident.id.substring(0, 8)}`}
            </span>
          </div>
          <h4 className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
            {incident.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <MapPin size={12} className="text-slate-400" />
            <span className="truncate">{incident.location}</span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              Assigned: {incident.assignedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              Due: {incident.dueDate}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Badges & Actions */}
      <div className="flex items-center gap-4 shrink-0 pl-3">
        <div className="text-right flex flex-col items-end gap-1.5">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(incident.status)}`}>
            {incident.status?.replace(/_/g, ' ')}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
            <span>{priority}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-400 shrink-0" />
      </div>
    </div>
  );
};

const IncidentList = ({ incidents, activeIncidentId, onIncidentSelect }) => {
  const [filter, setFilter] = useState('ALL');

  const filteredIncidents = incidents.filter(inc => {
    if (filter === 'ALL') return true;
    if (filter === 'OVERDUE') return inc.status?.toUpperCase() === 'OVERDUE';
    return inc.status?.toUpperCase() === filter;
  });

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">My Assigned Incidents</h3>
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 font-semibold"
        >
          <option value="ALL">All Status</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[480px] pr-1">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident) => (
            <IncidentCard 
              key={incident.id} 
              incident={incident} 
              isActive={activeIncidentId === incident.id}
              onClick={() => onIncidentSelect(incident.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">
            No incidents matching filter criteria.
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <button className="text-xs font-bold text-green-700 dark:text-green-500 hover:text-green-800 transition-colors">
          View All Incidents
        </button>
      </div>
    </div>
  );
};

export default IncidentList;
