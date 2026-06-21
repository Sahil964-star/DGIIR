import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const CitizenFeedback = ({ verification }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="h-full flex flex-col pt-2"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Citizen Verification</h3>
      </div>

      <div className="space-y-6 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[120px]">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pending</span>
            </div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{verification || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CitizenFeedback;
