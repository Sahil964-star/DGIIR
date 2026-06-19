import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import QuickActions from '../components/QuickActions';
import ComplaintList from '../components/ComplaintList';
import HowItWorks from '../components/HowItWorks';
import SupportCard from '../components/SupportCard';

const CitizenDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex">
      <Sidebar />
      
      <div className="flex-1 ml-[260px] flex flex-col">
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 mt-20 p-8 flex flex-col xl:flex-row gap-8">
          
          {/* Left Column (Hero, Actions, Complaints) */}
          <div className="flex-1 min-w-0">
            <HeroBanner />
            <QuickActions />
            <ComplaintList />
          </div>

          {/* Right Information Panel */}
          <div className="w-full xl:w-[320px] shrink-0">
            <HowItWorks />
            <SupportCard />
          </div>
          
        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 px-8 border-t border-gray-200 dark:border-gray-700 text-center xl:text-left flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Government of NCT of Delhi
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CitizenDashboard;
