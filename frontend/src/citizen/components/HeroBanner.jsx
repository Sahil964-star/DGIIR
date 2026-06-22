import React from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between relative transition-colors shadow-sm">
      <div className="z-10 relative md:max-w-xl">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Report Civic Issues. Improve Delhi.</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg leading-relaxed">
          Submit complaints about water supply, garbage collection, roads, streetlights and public services. Track progress in real time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Button 
            variant="primary" 
            size="lg" 
            icon={Plus}
            onClick={() => navigate('/citizen/report')}
          >
            File New Complaint
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            icon={Search} 
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
            onClick={() => navigate('/citizen/my-reports')}
          >
            Track Existing Complaint
          </Button>
        </div>
      </div>

      {/* Clean, simple flat illustration representing a city/services */}
      <div className="hidden md:flex relative z-10 lg:mr-4 w-48 h-48 items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="100" width="40" height="80" rx="4" fill="#cbd5e1" className="dark:fill-slate-600" />
          <rect x="70" y="60" width="50" height="120" rx="4" fill="#94a3b8" className="dark:fill-slate-500" />
          <rect x="130" y="80" width="45" height="100" rx="4" fill="#64748b" className="dark:fill-slate-400" />
          {/* Windows */}
          <rect x="30" y="110" width="8" height="8" fill="white" fillOpacity="0.8" />
          <rect x="42" y="110" width="8" height="8" fill="white" fillOpacity="0.8" />
          <rect x="30" y="130" width="8" height="8" fill="white" fillOpacity="0.8" />
          <rect x="42" y="130" width="8" height="8" fill="white" fillOpacity="0.8" />
          
          <rect x="85" y="75" width="20" height="15" fill="white" fillOpacity="0.8" />
          <rect x="85" y="100" width="20" height="15" fill="white" fillOpacity="0.8" />
          <rect x="85" y="125" width="20" height="15" fill="white" fillOpacity="0.8" />
          
          <rect x="140" y="95" width="10" height="10" fill="white" fillOpacity="0.8" />
          <rect x="155" y="95" width="10" height="10" fill="white" fillOpacity="0.8" />
          <rect x="140" y="115" width="10" height="10" fill="white" fillOpacity="0.8" />
          <rect x="155" y="115" width="10" height="10" fill="white" fillOpacity="0.8" />
          
          {/* Sun / Green Accent */}
          <circle cx="160" cy="40" r="20" fill="#22c55e" fillOpacity="0.2" className="dark:fillOpacity-40" />
          <circle cx="160" cy="40" r="10" fill="#22c55e" />
        </svg>
      </div>
    </div>
  );
};

export default HeroBanner;
