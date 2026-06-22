import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Printer, Filter, Calendar, AlertCircle } from 'lucide-react';
import { officerApi } from '../../../api/officerApi';
import Loader from '../../../shared/components/Loader';

const ReportsPage = () => {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDate, setFilterDate] = useState('ALL'); // ALL | 7days | 30days

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
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Failed to Load Reports</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">An error occurred while loading your completed tasks report.</p>
      </div>
    );
  }

  const complaints = resp?.data?.complaints || resp?.complaints || [];

  // Completed complaints are those that are RESOLVED or CLOSED
  const completedComplaints = complaints.filter(c => 
    c.status === 'RESOLVED' || c.status === 'CLOSED'
  );

  // Derive categories for filter dropdown
  const uniqueCategories = [...new Set(completedComplaints.map(c => c.category?.name).filter(Boolean))];

  // Apply filters
  const filteredComplaints = completedComplaints.filter(c => {
    if (filterCategory !== 'ALL' && c.category?.name !== filterCategory) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    
    if (filterDate !== 'ALL' && c.resolvedAt) {
      const resolvedTime = new Date(c.resolvedAt).getTime();
      const limitTime = Date.now() - (filterDate === '7days' ? 7 : 30) * 24 * 60 * 60 * 1000;
      if (resolvedTime < limitTime) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    if (filteredComplaints.length === 0) return;
    const headers = ['Complaint No', 'Title', 'Category', 'Priority', 'Address', 'Status', 'Resolved Date'];
    const rows = filteredComplaints.map(c => [
      c.complaintNo,
      c.title,
      c.category?.name || 'General',
      c.priority,
      c.address,
      c.status,
      c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : 'N/A'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `officer_resolution_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans print:p-0">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resolution Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">View and export reports of all resolved and closed complaints.</p>
        </div>
        <div className="flex gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            disabled={filteredComplaints.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl text-xs font-bold transition-all border border-slate-900 hover:opacity-90 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            disabled={filteredComplaints.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm flex flex-wrap gap-4 items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Filters</span>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Category Selector */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <option value="ALL">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Date Selector */}
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <option value="ALL">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Records Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">There are no completed complaints matching your filter conditions.</p>
        </div>
      ) : (
        /* Report Table Container */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden print:border-none print:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Complaint No</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Resolved Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredComplaints.map((c) => {
                  const resolvedDate = c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
                  return (
                    <tr 
                      key={c.id} 
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors text-xs text-slate-700 dark:text-slate-300"
                    >
                      <td className="p-4 pl-6 font-mono font-bold text-slate-500">{c.complaintNo}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{c.title}</td>
                      <td className="p-4 font-bold text-slate-500">{c.category?.name || 'General'}</td>
                      <td className="p-4 font-bold text-slate-500">{c.priority}</td>
                      <td className="p-4 max-w-[200px] truncate font-medium">{c.address}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                          c.status === 'RESOLVED' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400' 
                            : 'bg-green-50 text-green-700 border border-green-200/50 dark:bg-green-950/30 dark:text-green-400'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 font-bold text-slate-500">{resolvedDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
