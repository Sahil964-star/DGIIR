import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '../../shared/components/Card';
import { BarChart3, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { analyticsApi } from '../../api/analyticsApi';
import Loader from '../../shared/components/Loader';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f97316', '#eab308', '#a855f7'];

const CMDashboard = () => {
  const { data: overviewResp, isLoading: isLoadingOverview, isError: errOverview } = useQuery({
    queryKey: ['cmOverview'],
    queryFn: () => analyticsApi.getCmOverview()
  });

  const { data: concernsResp, isLoading: isLoadingConcerns, isError: errConcerns } = useQuery({
    queryKey: ['cmTopConcerns'],
    queryFn: () => analyticsApi.getCmTopConcerns()
  });

  const { data: riskResp, isLoading: isLoadingRisk, isError: errRisk } = useQuery({
    queryKey: ['cmDistrictRisk'],
    queryFn: () => analyticsApi.getCmDistrictRisk()
  });

  const { data: resolutionResp, isLoading: isLoadingResolution, isError: errResolution } = useQuery({
    queryKey: ['cmResolutionTime'],
    queryFn: () => analyticsApi.getCmResolutionTime()
  });

  const { data: priorityResp, isLoading: isLoadingPriority, isError: errPriority } = useQuery({
    queryKey: ['cmPriority'],
    queryFn: () => analyticsApi.getCmPriority()
  });

  if (isLoadingOverview || isLoadingConcerns || isLoadingRisk || isLoadingResolution || isLoadingPriority) {
    return <div className="min-h-screen flex items-center justify-center"><Loader size={48} /></div>;
  }

  if (errOverview || errConcerns || errRisk || errResolution || errPriority) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load Chief Minister data.</div>;
  }

  const kpis = overviewResp?.data || {};
  const topConcerns = concernsResp?.data || [];
  const districtRisk = riskResp?.data || [];
  const resolutionTime = resolutionResp?.data || { averageDays: "0" };
  const rawPriority = priorityResp?.data || [];
  const priorityAnalytics = rawPriority.map(p => ({
    name: p.priority,
    value: p._count?.id || 0
  }));
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Chief Minister Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">High-level metrics and city-wide performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Critical Incidents (Overdue)</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.overdue || 0}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl text-green-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resolution Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.resolutionRate ? `${kpis.resolutionRate}%` : '0%'}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Reported</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.total || 0}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Concerns */}
        <Card className="p-6 h-80 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Concerns</h2>
          <div className="flex-1 bg-white dark:bg-[#0b1120] rounded-lg">
            {topConcerns.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topConcerns} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color, #e2e8f0)" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
            )}
          </div>
        </Card>
        
        {/* District Risk */}
        <Card className="p-6 h-80 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">District Risk Assessment</h2>
          <div className="flex-1 bg-white dark:bg-[#0b1120] rounded-lg">
            {districtRisk.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtRisk} margin={{ top: 5, right: 30, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e2e8f0)" />
                  <XAxis dataKey="district" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="total" fill="#3b82f6" name="Total" />
                  <Bar dataKey="overdue" fill="#ef4444" name="Overdue" />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
            )}
          </div>
        </Card>

        {/* Resolution Time Average */}
        <Card className="p-6 h-80 flex flex-col justify-center">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Average Resolution Time</h2>
          <div className="flex-1 bg-white dark:bg-[#0b1120] rounded-lg flex flex-col items-center justify-center p-8 text-center border border-slate-100 dark:border-white/5 shadow-inner">
            <Clock size={48} className="text-blue-500 mb-6" />
            <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
              {resolutionTime.averageDays || 0}
            </span>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-2">Days</span>
          </div>
        </Card>

        {/* Priority Analytics */}
        <Card className="p-6 h-80 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Priority Distribution</h2>
          <div className="flex-1 bg-white dark:bg-[#0b1120] rounded-lg relative">
            {priorityAnalytics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityAnalytics}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {priorityAnalytics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CMDashboard;
