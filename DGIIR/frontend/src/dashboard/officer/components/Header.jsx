import React from 'react';
import { Bell, Menu, ChevronDown } from 'lucide-react';
import ThemeToggle from '../../../auth/components/ThemeToggle';

const Header = ({ officerProfile }) => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 font-sans">
      <div className="flex items-center gap-4">
        <button className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Officer Dashboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage your assigned incidents and tasks</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Bell */}
        <button className="p-2 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative">
          <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">5</span>
        </button>

        {/* Profile Droplist Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 cursor-pointer group">
          {officerProfile?.avatar ? (
            <img src={officerProfile.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700 shrink-0">
              {(officerProfile?.name || 'O').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white leading-none mb-0.5">{officerProfile?.name || 'Rajesh Kumar'}</h3>
            <p className="text-[10px] text-slate-400 font-semibold">{officerProfile?.role === 'FIELD_OFFICER' ? 'Field Officer' : 'Officer'}</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Header;
