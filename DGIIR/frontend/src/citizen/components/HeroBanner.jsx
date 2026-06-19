import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../shared/components/Button';

const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-r from-dgiir-green-50 to-dgiir-green-100 rounded-[20px] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
      <div className="z-10 relative">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">See It. Report It. Improve It.</h2>
        <p className="text-gray-600 mb-8 max-w-md text-lg">Help us build a better Delhi. Report civic issues quickly and track their resolution in real-time.</p>
        <Button variant="primary" size="lg" icon={Plus} className="shadow-sm">
          File a New Complaint
        </Button>
      </div>

      {/* Simple SVG Illustration area representing Delhi / City */}
      <div className="hidden md:block relative z-10 mr-8">
        <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="80" width="30" height="70" rx="4" fill="#86efac" />
          <rect x="60" y="40" width="40" height="110" rx="4" fill="#22c55e" />
          <rect x="110" y="60" width="35" height="90" rx="4" fill="#16a34a" />
          <rect x="155" y="90" width="25" height="60" rx="4" fill="#4ade80" />
          <circle cx="150" cy="30" r="15" fill="#fcd34d" />
          {/* Clouds */}
          <path d="M40 30 C 40 20, 60 20, 60 30 C 70 30, 70 40, 60 40 L 40 40 C 30 40, 30 30, 40 30 Z" fill="white" fillOpacity="0.8"/>
          <path d="M120 40 C 120 35, 135 35, 135 40 C 140 40, 140 45, 135 45 L 120 45 C 115 45, 115 40, 120 40 Z" fill="white" fillOpacity="0.6"/>
        </svg>
      </div>
      
      {/* Decorative background shapes */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute right-40 -top-20 w-48 h-48 bg-white opacity-20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default HeroBanner;
