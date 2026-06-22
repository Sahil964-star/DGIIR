import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const PriorityAlerts = ({ stats = { total: 12, onTrack: 7, atRisk: 3, breached: 2, onTrackPct: 58, atRiskPct: 25, breachedPct: 17 } }) => {
  const chartData = [
    { name: 'On Track', value: stats.onTrack },
    { name: 'At Risk', value: stats.atRisk },
    { name: 'Breached', value: stats.breached },
  ];

  return (
    <div className="h-full flex flex-col pt-2 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">SLA Status</h3>
        <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline">
          View All
        </button>
      </div>

      <div className="flex items-center justify-between gap-6 py-2">
        {/* Donut Chart */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" cy="50%"
                innerRadius={48} outerRadius={60}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem', color: '#f8fafc' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 flex flex-col gap-2.5 text-xs font-semibold">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600 dark:text-slate-400">On Track</span>
            </div>
            <span className="text-slate-900 dark:text-white font-bold">{stats.onTrack} ({stats.onTrackPct}%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <span className="text-slate-600 dark:text-slate-400">At Risk</span>
            </div>
            <span className="text-slate-900 dark:text-white font-bold">{stats.atRisk} ({stats.atRiskPct}%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Breached</span>
            </div>
            <span className="text-slate-900 dark:text-white font-bold">{stats.breached} ({stats.breachedPct}%)</span>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {stats.breached > 0 && (
        <div className="mt-4 p-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-red-800 dark:text-red-300">
              {stats.breached} {stats.breached === 1 ? 'incident has' : 'incidents have'} breached the SLA
            </p>
            <p className="text-[11px] text-red-600/90 dark:text-red-400/90 font-medium mt-0.5">
              Please take immediate action
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriorityAlerts;
