import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Home, FileText, AlertTriangle, Users, 
  MapPin, BarChart3, Settings 
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { role } = useAuth();

  const getLinks = () => {
    switch (role) {
      case 'citizen':
        return [
          { path: '/citizen', label: 'Dashboard', icon: Home },
          { path: '/citizen/report', label: 'Report Issue', icon: AlertTriangle },
          { path: '/citizen/my-reports', label: 'My Reports', icon: FileText },
        ];
      case 'operations':
        return [
          { path: '/dashboard/operations', label: 'Dashboard', icon: Home },
          { path: '/dashboard/operations/triage', label: 'Triage Queue', icon: AlertTriangle },
          { path: '/dashboard/operations/officers', label: 'Field Officers', icon: Users },
        ];
      case 'officer':
        return [
          { path: '/dashboard/officer', label: 'Dashboard', icon: Home },
          { path: '/dashboard/officer/tasks', label: 'My Tasks', icon: FileText },
          { path: '/dashboard/officer/map', label: 'Map View', icon: MapPin },
        ];
      case 'cm':
        return [
          { path: '/dashboard/cm', label: 'Overview', icon: Home },
          { path: '/dashboard/cm/analytics', label: 'Analytics', icon: BarChart3 },
          { path: '/dashboard/cm/reports', label: 'City Reports', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center font-bold text-white">
            D
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">DGIIR</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/citizen' || link.path.endsWith('/dashboard')}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm
                ${isActive 
                  ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white'}
              `}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-gray-800">
          <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl transition-colors font-medium text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
