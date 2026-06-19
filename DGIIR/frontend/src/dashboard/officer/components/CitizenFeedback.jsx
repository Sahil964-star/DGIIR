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
      className="bg-white dark:bg-gray-900 rounded-xl border-2 border-green-200 dark:border-green-900/40 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2.5 border-b border-green-100 dark:border-green-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-green-600 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Citizen Verification</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">DGIIR Accountability Tracker</p>
            </div>
          </div>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">{verifiedPct}%</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {/* Stacked Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-2 flex overflow-hidden">
          <motion.div className="bg-green-500 h-2" initial={{ width: 0 }} animate={{ width: `${verifiedPct}%` }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} />
          <motion.div className="bg-orange-400 h-2" initial={{ width: 0 }} animate={{ width: `${pendingPct}%` }} transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }} />
          <motion.div className="bg-red-500 h-2" initial={{ width: 0 }} animate={{ width: `${rejectedPct}%` }} transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }} />
        </div>

        {/* Status Rows */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <div>
                <span className="text-sm font-semibold text-green-800 dark:text-green-300">Citizen Verified</span>
                <p className="text-[10px] text-green-600/70 dark:text-green-400/60">Closure accepted by citizen</p>
              </div>
            </div>
            <span className="text-xl font-bold text-green-700 dark:text-green-400">{verification.verified}</span>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <div>
                <span className="text-sm font-semibold text-orange-800 dark:text-orange-300">Pending Verification</span>
                <p className="text-[10px] text-orange-600/70 dark:text-orange-400/60">Awaiting citizen response</p>
              </div>
            </div>
            <span className="text-xl font-bold text-orange-700 dark:text-orange-400">{verification.pending}</span>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <div>
                <span className="text-sm font-semibold text-red-800 dark:text-red-300">Rejected by Citizen</span>
                <p className="text-[10px] text-red-600/70 dark:text-red-400/60">Requires follow-up action</p>
              </div>
            </div>
            <span className="text-xl font-bold text-red-700 dark:text-red-400">{verification.rejected}</span>
          </div>
        </div>

        {verification.rejected > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-lg flex items-start gap-2"
          >
            <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-400 font-medium leading-snug">
              {verification.rejected} closure{verification.rejected > 1 ? 's' : ''} rejected — follow-up required.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CitizenFeedback;
