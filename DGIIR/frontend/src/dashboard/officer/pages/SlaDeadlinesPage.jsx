import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, Calendar, CheckSquare, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { officerApi } from '../../../api/officerApi';
import Loader from '../../../shared/components/Loader';

const formatSlaCountdown = (breachTimeStr) => {
  if (!breachTimeStr) return 'N/A';
  const breachTime = new Date(breachTimeStr).getTime();
  const now = Date.now();
  const diff = breachTime - now;

  if (diff <= 0) {
    const hoursPast = Math.abs(Math.floor(diff / (1000 * 60 * 60)));
    return `${hoursPast}h overdue`;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}m remaining`;
  }
  return `${hours}h ${minutes}m remaining`;
};

const getSlaUrgency = (c) => {
  if (c.isOverdue) return { label: 'BREACHED', color: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/30 dark:text-red-400' };
  
  const breachTime = c.slaBreachAt ? new Date(c.slaBreachAt).getTime() : new Date(c.createdAt).getTime() + 48 * 60 * 60 * 1000;
  const diff = breachTime - Date.now();

  if (diff <= 0) {
    return { label: 'BREACHED', color: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/30 dark:text-red-400' };
  }
  if (diff < 12 * 60 * 60 * 1000) {
    return { label: 'URGENT', color: 'text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400' };
  }
  return { label: 'ON TRACK', color: 'text-green-700 bg-green-50 border-green-200 dark:bg-green-950/30 dark:text-green-400' };
};

const SlaDeadlinesPage = () => {
  const [activeTab, setActiveTab] = useState('all'); // all | overdue | today | upcoming
  const [, setTick] = useState(0);

  // Force re-render every minute to update countdowns
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const { data: resp, isLoading, isError } = useQuery({
    queryKey: ['officerComplaints'],
    queryFn: () => officerApi.getMyComplaints()
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Failed to Load SLA Deadlines</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">An error occurred while fetching your SLA metrics.</p>
      </div>
    );
  }

  const complaints = resp?.data?.complaints || resp?.complaints || [];
  
  // Filter for active complaints only (unresolved)
  const activeComplaints = complaints.filter(c => 
    c.status !== 'RESOLVED' && c.status !== 'CLOSED' && c.status !== 'REJECTED'
  );

  const categorized = activeComplaints.map(c => {
    const breachTime = c.slaBreachAt ? new Date(c.slaBreachAt) : new Date(new Date(c.createdAt).getTime() + 48 * 60 * 60 * 1000);
    const urgency = getSlaUrgency(c);
    
    let categoryBucket = 'upcoming';
    if (urgency.label === 'BREACHED') categoryBucket = 'overdue';
    else if (urgency.label === 'URGENT') categoryBucket = 'today';

    return {
      ...c,
      breachTime,
      urgency,
      bucket: categoryBucket
    };
  });

  const filtered = categorized.filter(c => {
    if (activeTab === 'all') return true;
    return c.bucket === activeTab;
  });

  const countBucket = (b) => categorized.filter(c => c.bucket === b).length;

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SLA & Deadlines</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track resolution deadlines and prevent service level agreements (SLA) breaches.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 overflow-x-auto select-none">
        {[
          { id: 'all', name: 'All Active', count: activeComplaints.length },
          { id: 'overdue', name: 'Overdue / Breached', count: countBucket('overdue'), color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20' },
          { id: 'today', name: 'Due Today', count: countBucket('today'), color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20' },
          { id: 'upcoming', name: 'Upcoming', count: countBucket('upcoming'), color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span>{tab.name}</span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] ${tab.color || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Deadlines Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">There are no active incidents in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(c => {
            const formattedBreach = c.breachTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + 
              ', ' + c.breachTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });

            return (
              <div 
                key={c.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">{c.complaintNo}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${c.urgency.color}`}>
                      {c.urgency.label}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {c.priority}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[400px]">{c.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{c.address}</p>
                </div>

                <div className="flex items-center gap-6 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800/60 shrink-0">
                  {/* Countdown Timer */}
                  <div className="text-left md:text-right shrink-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 flex items-center md:justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      SLA Countdown
                    </p>
                    <p className={`text-sm font-bold ${c.bucket === 'overdue' ? 'text-red-600 dark:text-red-400' : c.bucket === 'today' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {formatSlaCountdown(c.breachTime)}
                    </p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                      Limit: {formattedBreach}
                    </p>
                  </div>

                  {/* Details Link */}
                  <Link 
                    to={`/officer/incidents/${c.id}`}
                    className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-2xl transition-all border border-slate-200/40 dark:border-slate-700/40 flex items-center justify-center shrink-0"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 hover:text-slate-900 dark:hover:text-white" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SlaDeadlinesPage;
