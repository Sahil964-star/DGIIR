import React, { useContext } from 'react';
import TrustCards from './TrustCards';
import { Building2, Landmark, Home } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const BrandingPanel = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#f8fcf9] dark:bg-slate-900 p-12 text-slate-900 dark:text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-200 dark:bg-green-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-100 dark:bg-emerald-600 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Branding */}
      <div className="relative z-10">
        <div className="mb-12">
          <div className="flex items-end space-x-2 text-green-700 dark:text-green-500 mb-2">
            <Building2 size={32} />
            <Landmark size={40} className="mb-0.5" />
            <Home size={28} />
            <h1 className="text-4xl font-black tracking-tight ml-2">DGIIR</h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Delhi Governance Intelligence<br />& Incident Response
          </p>
          <div className="w-12 h-0.5 bg-green-600 mt-4"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-md mt-8">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            <span className="text-slate-900 dark:text-white">Smart Governance.</span><br />
            <span className="text-green-700 dark:text-green-500">Stronger Delhi.</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            DGIIR is an integrated platform for citizens and government officials to report issues, manage incidents and build a better Delhi.
          </p>
        </div>
      </div>

      {/* Premium Illustration Area (Skyline) */}
      <div className="relative z-10 flex-1 flex items-end justify-center mt-8 mb-4">
        <img 
          src={isDarkMode ? "/delhi-skyline-dark.png" : "/delhi-skyline-light.png"} 
          alt="Delhi Skyline Illustration" 
          className="w-full max-w-[450px] object-contain drop-shadow-xl transition-opacity duration-300"
        />
      </div>

      {/* Trust Cards */}
      <div className="relative z-10 w-full mb-8">
        <TrustCards />
      </div>

      <div className="relative z-10 text-xs text-slate-500 dark:text-slate-400 font-medium">
        © 2026 DGIIR | Government of NCT of Delhi
      </div>
    </div>
  );
};

export default BrandingPanel;
