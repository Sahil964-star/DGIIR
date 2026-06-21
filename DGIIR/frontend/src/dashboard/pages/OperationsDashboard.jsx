import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, Bell, Settings, Map, LayoutDashboard, AlertTriangle, CheckCircle, 
  Clock, Activity, MoreVertical, Plus, ChevronDown, Calendar, Cloud, Thermometer,
  TrendingUp, TrendingDown, Users, FileText, Upload, Send, Megaphone, Filter
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { analyticsApi } from '../../api/analyticsApi';
import Loader from '../../shared/components/Loader';

// Dynamic color mapping for categories
const CATEGORY_COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f97316', '#eab308', '#a855f7'];

const KPICard = ({ title, value, icon: Icon, trend, trendLabel, colorClass }) => (
  <div className="bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-white/10 transition-all shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={22} />
      </div>
      {trend && (
        <div className={`flex items-center text-sm font-medium ${trend.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {trend.startsWith('+') ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
          {trend}
        </div>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{title}</p>
      {trendLabel && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{trendLabel}</p>}
    </div>
  </div>
);

const SectionHeader = ({ title, actionText, onAction }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-semibold text-slate-800 dark:text-white tracking-wide">{title}</h2>
    {actionText && (
      <button onClick={onAction} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
        {actionText}
      </button>
    )}
  </div>
);

const OperationsDashboard = () => {
  const { data: overviewResp, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['operationsOverview'],
    queryFn: analyticsApi.getOperationsOverview
  });

  const { data: slaResp, isLoading: isLoadingSla } = useQuery({
    queryKey: ['operationsSla'],
    queryFn: analyticsApi.getOperationsSla
  });

  if (isLoadingOverview || isLoadingSla) {
    return <div className="min-h-screen flex justify-center items-center"><Loader size={48} /></div>;
  }

  const data = overviewResp?.data || overviewResp || {};
  const slaData = slaResp?.data || slaResp || [];
  const kpis = data.kpis || {};
  const trendData = data.trendData || [];
  
  // Assign colors to categories
  const categoryData = (data.categoryData || []).map((c, i) => ({
    ...c,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length]
  }));

  const priorityIncidents = data.priorityIncidents || [];
  const deptStatus = data.deptStatus || [];
  const activityFeed = data.activityFeed || [];
  const alertsCenter = data.alertsCenter || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-700 dark:text-slate-300 p-4 lg:p-6 font-sans transition-colors duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Operations Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time overview of city operations and incident management</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-white dark:bg-[#151c2c] rounded-full px-4 py-2 border border-slate-200 dark:border-white/5">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search incidents, locations..." 
              className="bg-transparent border-none text-sm text-slate-900 dark:text-white focus:outline-none w-48 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-500 dark:text-slate-400" />
              <span>21 May 2026, Wed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-500 dark:text-slate-400" />
              <span>01:30 AM</span>
            </div>
            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
              <Cloud size={16} />
              <span>34°C Haze</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KPICard 
          title="Total Incidents" 
          value={kpis.total || 0} 
          icon={FileText} 
          trend={kpis.totalTrend || ""} 
          trendLabel="from last month"
          colorClass="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <KPICard 
          title="Resolved Today" 
          value={kpis.resolvedToday || 0} 
          icon={CheckCircle} 
          trend={kpis.resolvedTrend || ""} 
          trendLabel="from yesterday"
          colorClass="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <KPICard 
          title="In Progress" 
          value={kpis.inProgress || 0} 
          icon={Activity} 
          trend={kpis.inProgressTrend || ""} 
          trendLabel="from yesterday"
          colorClass="bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />
        <KPICard 
          title="Overdue" 
          value={kpis.overdue || 0} 
          icon={AlertTriangle} 
          trend={kpis.overdueTrend || ""} 
          trendLabel="from yesterday"
          colorClass="bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
        />
        <KPICard 
          title="Citizen Satisfaction" 
          value={`${kpis.satisfactionPct || 0}%`} 
          icon={Users} 
          trend={kpis.satisfactionTrend || ""} 
          trendLabel="from last month"
          colorClass="bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400"
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Incidents Trend Chart */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <SectionHeader title="Incidents Trend" />
            <select className="bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-[#2a3441]" vertical={false} />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-400 dark:text-[#64748b]" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" className="text-slate-400 dark:text-[#64748b]" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg, #fff)', borderColor: 'var(--tooltip-border, #e2e8f0)', color: 'var(--tooltip-text, #0f172a)', borderRadius: '8px' }}
                  itemStyle={{ color: 'inherit' }}
                />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm font-medium">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Total</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Resolved</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Overdue</div>
          </div>
        </div>

        {/* Incidents By Category */}
        <div className="bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-lg flex flex-col">
          <SectionHeader title="Incidents by Category" />
          <div className="flex-1 flex flex-col justify-center relative">
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--tooltip-bg, #fff)', borderColor: 'var(--tooltip-border, #e2e8f0)', color: 'var(--tooltip-text, #0f172a)', borderRadius: '8px' }}
                    itemStyle={{ color: 'inherit' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.total || 0}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Total</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {categoryData.slice(0,4).map((cat, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 dark:text-slate-400">{kpis.total ? Math.round((cat.value/kpis.total)*100) : 0}%</span>
                    <span className="text-slate-900 dark:text-white font-semibold w-8 text-right">{cat.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-blue-600 dark:text-blue-400 text-sm mt-4 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-center w-full">View Detailed Report →</button>
          </div>
        </div>

      </div>

      {/* Second Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Recent High Priority */}
        <div className="bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-lg">
          <SectionHeader title="Recent High Priority Incidents" actionText="View All" />
          <div className="space-y-3 mt-4">
            {priorityIncidents.map((inc, i) => (
              <div key={i} className="bg-slate-50 dark:bg-[#0b1120]/50 border border-slate-100 dark:border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${inc.color || 'bg-red-100 text-red-600'}`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-semibold text-sm">{inc.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{inc.location}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      <span className="text-xs text-slate-500 font-medium">{inc.id}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-md font-bold ${inc.priority === 'Critical' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400'}`}>
                    {inc.priority}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">{inc.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Performance instead of Heatmap */}
        <div className="bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-lg flex flex-col">
          <SectionHeader title="SLA Compliance by Department" />
          <div className="flex-1 bg-white dark:bg-[#0b1120] rounded-xl border border-slate-200 dark:border-white/5 mt-2 min-h-[300px] p-4">
            {slaData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={slaData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e2e8f0)" />
                  <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="complianceRate" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Compliance %" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
            )}
          </div>
        </div>

      </div>

      {/* Third Row Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        
        {/* Department Status */}
        <div className="bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-lg">
           <SectionHeader title="Department-wise Status" actionText="View Report" />
           <div className="mt-4">
             <div className="grid grid-cols-4 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
               <div className="col-span-2">Department</div>
               <div className="text-center">In Progress</div>
               <div className="text-right">Overdue</div>
             </div>
             <div className="space-y-3">
               {deptStatus.map((dept, i) => (
                 <div key={i} className="grid grid-cols-4 text-sm items-center py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                   <div className="col-span-2 text-slate-700 dark:text-slate-300 font-semibold truncate pr-2">{dept.name}</div>
                   <div className="text-center text-slate-900 dark:text-white font-medium">{dept.inProgress}</div>
                   <div className={`text-right font-bold ${dept.overdue > 20 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>{dept.overdue}</div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-lg">
           <SectionHeader title="Recent Activity Feed" actionText="View All" />
           <div className="mt-4 space-y-4">
             {activityFeed.map((item, i) => (
               <div key={i} className="flex gap-4">
                 <div className="mt-1">
                   <div className={`w-2 h-2 rounded-full mt-1.5 ${item.type === 'critical' ? 'bg-red-500' : item.type==='warning' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                 </div>
                 <div>
                   <p className="text-sm text-slate-800 dark:text-slate-300 font-medium leading-snug">{item.title}</p>
                   {item.id && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.id}</p>}
                   <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{item.time}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Alerts Center */}
        <div className="bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-lg">
           <SectionHeader title="Alerts Center" actionText="View All" />
           <div className="mt-4 space-y-3">
             {alertsCenter.map((alert, i) => (
               <div key={i} className={`p-3 rounded-xl border flex items-start gap-3 ${
                 alert.type === 'critical' ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20' : 
                 alert.type === 'warning' ? 'bg-orange-50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20' : 
                 'bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20'
               }`}>
                 <div className={`mt-0.5 ${
                   alert.type === 'critical' ? 'text-red-600 dark:text-red-400' : 
                   alert.type === 'warning' ? 'text-orange-600 dark:text-orange-400' : 
                   'text-blue-600 dark:text-blue-400'
                 }`}>
                   {alert.type === 'critical' ? <AlertTriangle size={18} /> : 
                    alert.type === 'warning' ? <AlertTriangle size={18} /> : 
                    <AlertTriangle size={18} />}
                 </div>
                 <div className="flex-1">
                   <h4 className="text-sm font-bold text-slate-900 dark:text-white">{alert.title}</h4>
                   <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{alert.desc}</p>
                   <p className="text-xs text-slate-500 mt-2 font-medium">{alert.time}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>

      {/* Removed Quick Actions Bar */}

    </div>
  );
};

export default OperationsDashboard;
