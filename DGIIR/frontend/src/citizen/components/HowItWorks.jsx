import React from 'react';
import Card from '../../shared/components/Card';

const HowItWorks = () => {
  const steps = [
    { num: 1, title: 'File Complaint' },
    { num: 2, title: 'Dept. Reviews' },
    { num: 3, title: 'Issue Resolved' }
  ];
  return (
    <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 shadow-none">
      <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-sm">How It Works</h3>
      <div className="flex justify-between items-center relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-700 z-0"></div>
        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs shadow-sm transition-colors">
              {step.num}
            </div>
            <h4 className="font-medium text-slate-600 dark:text-slate-400 text-[10px] text-center w-16 leading-tight">{step.title}</h4>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HowItWorks;
