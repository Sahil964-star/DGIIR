import React from 'react';
import { CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const CitizenFeedback = ({ verification }) => {
  const total = verification.verified + verification.pending + verification.rejected;
  const verifiedPct = Math.round((verification.verified / total) * 100);
  const pendingPct = Math.round((verification.pending / total) * 100);
  const rejectedPct = Math.round((verification.rejected / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="h-full flex flex-col pt-2"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Citizen Verification</h3>
        <span className="text-lg font-bold text-green-600 dark:text-green-400">{verifiedPct}% Verified</span>
      </div>

      <div className="space-y-6 flex-1 flex flex-col">
        {/* Stacked Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-gray-800 h-2 flex overflow-hidden rounded-full mb-2">
          <motion.div className="bg-green-500 h-2" initial={{ width: 0 }} animate={{ width: `${verifiedPct}%` }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} />
          <motion.div className="bg-orange-400 h-2" initial={{ width: 0 }} animate={{ width: `${pendingPct}%` }} transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }} />
          <motion.div className="bg-red-500 h-2" initial={{ width: 0 }} animate={{ width: `${rejectedPct}%` }} transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }} />
        </div>

        {/* Status Rows */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[120px]">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Verified</span>
            </div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{verification.verified}</span>
          </div>

          <div className="flex-1 min-w-[120px]">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pending</span>
            </div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{verification.pending}</span>
          </div>

          <div className="flex-1 min-w-[120px]">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rejected</span>
            </div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{verification.rejected}</span>
          </div>
        </div>

        {verification.rejected > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-start gap-2 mt-4"
          >
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">{verification.rejected} closure{verification.rejected > 1 ? 's' : ''} rejected</span> — follow-up required.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CitizenFeedback;
