import React from 'react';
import HeroBanner from '../components/HeroBanner';
import CitizenSummary from '../components/CitizenSummary';
import QuickActions from '../components/QuickActions';
import ComplaintList from '../components/ComplaintList';
import RecentUpdates from '../components/RecentUpdates';
import HowItWorks from '../components/HowItWorks';
import SupportCard from '../components/SupportCard';

const CitizenDashboard = () => {
  return (
    <div className="space-y-6 py-4">
      {/* Welcome Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Citizen Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Delhi Public Grievance Tracking Portal</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col xl:flex-row gap-8 lg:gap-10">
        
        {/* Left Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <HeroBanner />
          {/* Mobile Only Recent Updates */}
          {/* Removed as no endpoint exists */}
          <CitizenSummary />
          <QuickActions />
          <ComplaintList />
        </div>

        {/* Right Information Panel */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
          {/* Desktop Only Recent Updates */}
          {/* Removed as no endpoint exists */}
          <SupportCard />
          <HowItWorks />
        </div>
        
      </div>

      {/* Footer */}
      <footer className="mt-8 py-6 border-t border-slate-200 dark:border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p className="font-semibold">&copy; {new Date().getFullYear()} Government of NCT of Delhi</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">DGIIR Platform</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default CitizenDashboard;
