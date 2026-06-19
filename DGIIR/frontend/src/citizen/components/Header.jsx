import React from 'react';
import { Bell, Globe, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../shared/context/ThemeContext';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 fixed top-0 right-0 left-[260px] flex items-center justify-between px-8 z-10 transition-colors">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Citizen Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back, Rahul Kumar</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Globe className="w-5 h-5" />
          <span className="text-sm font-medium">English</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors hover:scale-[1.05]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
        </button>

        {/* Profile Avatar */}
        <div className="w-10 h-10 rounded-full bg-dgiir-green-100 flex items-center justify-center border border-dgiir-green-200 cursor-pointer ml-2 hover:scale-[1.05] transition-transform">
          <User className="w-5 h-5 text-dgiir-green-700" />
        </div>
      </div>
    </header>
  );
};

export default Header;
