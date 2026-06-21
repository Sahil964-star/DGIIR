import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '../../shared/components/Card';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { analyticsApi } from '../../api/analyticsApi';
import Loader from '../../shared/components/Loader';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f97316', '#eab308', '#a855f7'];

const CMDashboard = () => {
  const { data: overviewResp, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['cmOverview'],
    queryFn: () => analyticsApi.getCmOverview()
  });

  const { data: concernsResp, isLoading: isLoadingConcerns } = useQuery({
    queryKey: ['cmTopConcerns'],
    queryFn: () => analyticsApi.getCmTopConcerns()
  });

  const { data: riskResp, isLoading: isLoadingRisk } = useQuery({
    queryKey: ['cmDistrictRisk'],
    queryFn: () => analyticsApi.getCmDistrictRisk()
  });

  const { data: resolutionResp, isLoading: isLoadingResolution } = useQuery({
    queryKey: ['cmResolutionTime'],
    queryFn: () => analyticsApi.getCmResolutionTime()
  });

  const { data: priorityResp, isLoading: isLoadingPriority } = useQuery({
    queryKey: ['cmPriority'],
    queryFn: () => analyticsApi.getCmPriority()
  });

  if (isLoadingOverview || isLoadingConcerns || isLoadingRisk || isLoadingResolution || isLoadingPriority) {
    return <div className="min-h-screen flex items-center justify-center"><Loader size={48} /></div>;
  }

  const kpis = overviewResp?.data?.kpis || overviewResp?.kpis || {};
  const topConcerns = concernsResp?.data || concernsResp || [];
  const districtRisk = riskResp?.data || riskResp || [];
  const resolutionTime = resolutionResp?.data || resolutionResp || [];
  const priorityAnalytics = priorityResp?.data || priorityResp || [];

  const kpis = overviewResp?.data?.kpis || overviewResp?.kpis || {};
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
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Critical Incidents</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.criticalCount || 0}</h3>
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
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.resolutionRatePct ? `${kpis.resolutionRatePct}%` : '0%'}</h3>
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
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.totalCount || 0}</h3>
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
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
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
                  <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                  <Bar dataKey="high" stackId="a" fill="#f97316" name="High" />
                  <Bar dataKey="normal" stackId="a" fill="#22c55e" name="Normal" />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
            )}
          </div>
        </Card>

        {/* Resolution Time Trends */}
        <Card className="p-6 h-80 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Resolution Time Trends</h2>
          <div className="flex-1 bg-white dark:bg-[#0b1120] rounded-lg">
            {resolutionTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resolutionTime} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e2e8f0)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="avgTimeHours" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Avg Hours" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
            )}
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
