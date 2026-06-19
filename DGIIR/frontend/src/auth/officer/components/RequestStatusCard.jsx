import React from 'react';
import { FileText, Building2, Clock } from 'lucide-react';
import Card from '../../../shared/components/Card';

const RequestStatusCard = ({ requestId = 'REQ-2026-0042', department = 'Delhi Jal Board', status = 'Pending Approval' }) => {
  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Details</h3>
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 flex items-center border border-amber-200 dark:border-amber-800/50">
          <Clock className="w-3 h-3 mr-1" />
          {status}
        </span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Request ID</p>
            <p className="text-base font-medium text-slate-900 dark:text-white">{requestId}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Building2 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</p>
            <p className="text-base font-medium text-slate-900 dark:text-white">{department}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RequestStatusCard;
