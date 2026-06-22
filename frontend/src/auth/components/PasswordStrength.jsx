import React from 'react';

const PasswordStrength = ({ password }) => {
  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200 dark:bg-slate-700' };

    if (pass.length > 7) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z\d]/.test(pass)) score += 1;

    switch (score) {
      case 0:
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-red-500' };
      case 2:
      case 3:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 4:
        return { score: 3, label: 'Strong', color: 'bg-green-600' };
      default:
        return { score: 0, label: '', color: 'bg-slate-200 dark:bg-slate-700' };
    }
  };

  const { score, label, color } = calculateStrength(password);

  return (
    <div className="w-full mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Password Strength</span>
        {label && <span className={`text-xs font-bold ${color.replace('bg-', 'text-')}`}>{label}</span>}
      </div>
      <div className="flex gap-1 h-1.5 w-full">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className={`flex-1 rounded-full transition-colors duration-300 ${
              score >= index ? color : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
