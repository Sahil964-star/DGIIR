import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PasswordStrengthMeter = ({ password }) => {
  const requirements = [
    { id: 'length', label: 'Minimum 8 Characters', regex: /.{8,}/ },
    { id: 'upper', label: 'One Uppercase Letter', regex: /[A-Z]/ },
    { id: 'number', label: 'One Number', regex: /[0-9]/ },
    { id: 'special', label: 'One Special Character', regex: /[^A-Za-z0-9]/ }
  ];

  return (
    <div className="w-full mt-2 space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {requirements.map(req => {
          const isMet = req.regex.test(password);
          return (
            <div key={req.id} className="flex items-center space-x-2 text-xs">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isMet ? '#16a34a' : '#94a3b8',
                  scale: isMet ? [1, 1.2, 1] : 1
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center text-white transition-colors"
              >
                {isMet ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
              </motion.div>
              <span className={`transition-colors ${isMet ? 'text-green-700 dark:text-green-500 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
