import React from 'react';
import { Search, Bell, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../shared/context/ThemeContext';

const Header = ({ officerProfile }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Field Officer Dashboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Good Morning, {officerProfile?.name?.split(' ')[0] || 'Rajesh'} • <span className="text-orange-600 dark:text-orange-400 font-medium">2 incidents require immediate attention</span></p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search incidents..." 
            className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-md text-sm focus:ring-2 focus:ring-green-500 dark:text-white w-64"
          />
        </div>
        
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800">
          <img src={officerProfile.avatar} alt="Profile" className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
