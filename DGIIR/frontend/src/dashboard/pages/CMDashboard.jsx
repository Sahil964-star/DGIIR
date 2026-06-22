import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '../../shared/components/Card';
import { BarChart3, TrendingUp, AlertTriangle, Clock, Sparkles } from 'lucide-react';
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

  const { data: aiAnalyticsResp, isLoading: isLoadingAi, isError: errAi } = useQuery({
    queryKey: ['cmAiAnalytics'],
    queryFn: () => analyticsApi.getCmAiAnalytics()
  });

  if (isLoadingOverview || isLoadingConcerns || isLoadingRisk || isLoadingResolution || isLoadingPriority || isLoadingAi) {
    return <div className="min-h-screen flex items-center justify-center"><Loader size={48} /></div>;
  }

  if (errOverview || errConcerns || errRisk || errResolution || errPriority || errAi) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load Chief Minister data.</div>;
  }

  const kpis = overviewResp?.data || {};
  const kpis = overviewResp?.data || {};
  const topConcerns = concernsResp?.data || [];
  const districtRisk = riskResp?.data || [];
  const resolutionTime = resolutionResp?.data || { averageDays: "0" };
  const rawPriority = priorityResp?.data || [];
  const aiData = aiAnalyticsResp?.data || { accuracyRate: 0, autoRouted: 0, manualReview: 0, totalWithAi: 0 };
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

      {/* AI Analytics Section */}
      <div className="mt-12 mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Sparkles className="text-indigo-500" /> AI Intelligence Hub
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Automated classification, routing performance, and emerging trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-800/30">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">AI Accuracy Rate</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{aiData.accuracyRate}%</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Of {aiData.totalWithAi} AI-classified complaints</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-800/30">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Auto-Routed</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{aiData.autoRouted}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Auto-assigned without manual review</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-900 border-amber-100 dark:border-amber-800/30">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Manual Review</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{aiData.manualReview}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Flagged for Ops (Confidence &lt; 90%)</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-violet-50 to-white dark:from-violet-900/20 dark:to-slate-900 border-violet-100 dark:border-violet-800/30">
          <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-2">Emerging Keywords</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {aiData.emergingKeywords?.slice(0, 5).map((kw, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 rounded-full font-bold uppercase">
                {kw.keyword} ({kw.count})
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-wider font-bold">Based on recent 50 complaints</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 h-80 flex flex-col">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">AI Category Distribution</h2>
          <div className="flex-1 bg-white dark:bg-[#0b1120] rounded-lg">
            {aiData.aiCategoryDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiData.aiCategoryDistribution} margin={{ top: 5, right: 30, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e2e8f0)" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
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
