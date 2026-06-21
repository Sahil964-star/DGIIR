import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, Activity, AlertTriangle, ShieldAlert, CheckCircle, TrendingUp
} from 'lucide-react';
import { analyticsApi } from '../../api/analyticsApi';
import Loader from '../../shared/components/Loader';

const KPICard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-white/10 transition-all shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={22} />
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{title}</p>
    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-semibold text-slate-800 dark:text-white tracking-wide">{title}</h2>
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

  const kpis = overviewResp?.data || {};
  const slaData = slaResp?.data || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-700 dark:text-slate-300 p-4 lg:p-6 font-sans transition-colors duration-300">
      
      {/* Top Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Operations Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time overview of city operations and incident management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard 
          title="Total Incidents" 
          value={kpis.total || 0} 
          icon={FileText} 
          colorClass="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <KPICard 
          title="Unassigned" 
          value={kpis.unassigned || 0} 
          icon={Activity} 
          colorClass="bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />
        <KPICard 
          title="Escalations" 
          value={kpis.escalations || 0} 
          icon={AlertTriangle} 
          colorClass="bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* SLA Performance Grid */}
        <div className="bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-lg flex flex-col">
          <SectionHeader title="SLA Compliance Snapshot" />
          <div className="grid grid-cols-2 gap-4 mt-2 h-full">
            <div className="bg-slate-50 dark:bg-[#0b1120] border border-slate-100 dark:border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
               <FileText className="w-8 h-8 text-blue-500 mb-2" />
               <span className="text-3xl font-bold text-slate-900 dark:text-white">{slaData.total || 0}</span>
               <span className="text-xs text-slate-500 mt-1 uppercase font-semibold">Total Evaluated</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#0b1120] border border-slate-100 dark:border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
               <ShieldAlert className="w-8 h-8 text-red-500 mb-2" />
               <span className="text-3xl font-bold text-red-600 dark:text-red-400">{slaData.breached || 0}</span>
               <span className="text-xs text-slate-500 mt-1 uppercase font-semibold">Breached</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#0b1120] border border-slate-100 dark:border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
               <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
               <span className="text-3xl font-bold text-green-600 dark:text-green-400">{slaData.compliant || 0}</span>
               <span className="text-xs text-slate-500 mt-1 uppercase font-semibold">Compliant</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#0b1120] border border-slate-100 dark:border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
               <TrendingUp className="w-8 h-8 text-indigo-500 mb-2" />
               <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{slaData.complianceRate ? `${slaData.complianceRate}%` : '0%'}</span>
               <span className="text-xs text-slate-500 mt-1 uppercase font-semibold">Compliance Rate</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OperationsDashboard;
