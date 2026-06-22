import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../../auth/components/ThemeToggle';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const TopNav = ({ setMobileOpen }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-10">
      <div className="flex items-center">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
        >
          <Menu size={24} />
        </button>
        
        <h2 className="hidden sm:block text-lg font-semibold text-slate-800 dark:text-white capitalize">
          {role === 'cm' ? 'Chief Minister' : role} Portal
        </h2>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-5">
        <ThemeToggle />
        
        <NotificationDropdown />

        <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-gray-700"></div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || 'User'}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role === 'cm' ? 'Chief Minister' : (role || 'Guest')}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-sm">
            {(user?.name?.charAt(0) || 'U').toUpperCase()}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors ml-2"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
