import React from 'react';
import SupportCard from '../components/SupportCard';

const SupportPage = () => {
  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Help & Support
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Access official support helplines, query resolution FAQ, and contact detail directories.
        </p>
      </div>

      <div className="max-w-md">
        <SupportCard />
      </div>
    </div>
  );
};

export default SupportPage;
