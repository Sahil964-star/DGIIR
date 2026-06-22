import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Home, FileText, AlertTriangle, Users, 
  MapPin, BarChart3, Settings, HelpCircle,
  ClipboardList, Search, User, Bell, ShieldAlert,
  PlusCircle, AlertCircle, Shield, CheckCircle, ChevronDown
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { role, user } = useAuth();
  const location = useLocation();
  const normalizedRole = role?.toLowerCase();
  const isCitizen = normalizedRole === 'citizen';

  const getLinks = () => {
    switch (normalizedRole) {
      case 'citizen':
        return [
          { path: '/citizen', label: 'Dashboard', icon: Home },
          { path: '/citizen/report', label: 'Report Issue', icon: PlusCircle },
          { path: '/citizen/my-reports', label: 'My Complaints', icon: ClipboardList },
          { path: '/citizen/my-reports', label: 'Track Complaint', icon: Search },
          { path: '/citizen/notifications', label: 'Notifications', icon: Bell },
          { path: '/citizen/settings', label: 'Profile', icon: User },
          { path: '/citizen/support', label: 'Help & Support', icon: HelpCircle },
        ];
      case 'operations':
        return [
          { path: '/dashboard/operations', search: '', label: 'Dashboard', icon: Home },
          { path: '/dashboard/operations', search: '?tab=complaints', label: 'Complaints', icon: FileText },
          { path: '/dashboard/operations', search: '?tab=incidents', label: 'Incidents', icon: AlertCircle },
          { path: '/dashboard/operations', search: '?tab=assignments', label: 'Assignments', icon: Shield },
          { path: '/dashboard/operations', search: '?tab=officers', label: 'Officers', icon: Users },
          { path: '/dashboard/operations', search: '?tab=audit', label: 'Audit Queue', icon: ClipboardList },
          { path: '/dashboard/operations', search: '?tab=analytics', label: 'Analytics', icon: BarChart3 },
          { path: '/dashboard/operations', search: '?tab=reports', label: 'Reports', icon: FileText },
          { path: '/dashboard/operations', search: '?tab=settings', label: 'Settings', icon: Settings },
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

  const getSettingsPath = () => {
    if (normalizedRole === 'citizen') return '/citizen/settings';
    return '/settings';
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
        fixed lg:static inset-y-0 left-0 z-40 w-64 border-r flex flex-col transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCitizen || normalizedRole === 'operations'
          ? 'bg-[#0f172a] text-white border-slate-800' 
          : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800'}
      `}>
        <div className="p-6 flex items-center space-x-3">
          {isCitizen || normalizedRole === 'operations' ? (
            <>
              <div className="w-10 h-10 bg-green-600/20 text-green-500 rounded-xl flex items-center justify-center font-bold border border-green-500/25">
                <ShieldAlert className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight block">DGIIR</span>
                <span className="text-[10px] text-slate-400 font-medium leading-none block mt-0.5">
                  Delhi Governance Intelligence<br/>& Incident Response
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center font-bold text-white">
                D
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">DGIIR</span>
            </>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {links.map((link) => {
            const isActive = link.search !== undefined
              ? location.search === link.search
              : (location.pathname === link.path && !location.search);

            return (
              <Link
                key={(link.path || '') + (link.search || '') + link.label}
                to={(link.path || '') + (link.search || '')}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm
                  ${normalizedRole === 'operations'
                    ? isActive
                      ? 'bg-green-700 text-white font-semibold'
                      : 'text-slate-400 hover:bg-[#1e293b] hover:text-white'
                    : isCitizen
                      ? isActive
                        ? 'bg-[#162e2a] text-green-500 font-semibold'
                        : 'text-slate-400 hover:bg-[#242f41] hover:text-white'
                      : isActive 
                        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {normalizedRole === 'operations' ? (
          <div className="p-4 border-t border-slate-800 mt-auto flex items-center justify-between gap-3 text-slate-400">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shrink-0">
                <User size={18} className="text-slate-400" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[13px] font-bold text-white truncate max-w-[130px]">{user?.name || 'Operations Team'}</div>
                <div className="text-[11px] text-slate-500 truncate max-w-[130px]">{user?.email || 'ops.team@delhi.gov.in'}</div>
              </div>
            </div>
            <ChevronDown size={16} className="text-slate-500 shrink-0 cursor-pointer hover:text-white transition-colors" />
          </div>
        ) : isCitizen ? (
          <div className="p-4 mt-auto">
            <div className="bg-[#242f41] rounded-2xl p-4 text-center border border-slate-700/50">
              <div className="bg-[#1a2332] w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-700/30">
                <HelpCircle className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Need Help?</h3>
              <p className="text-xs text-slate-400 mb-3">Our support team is available 24/7</p>
              <Link 
                to="/citizen/support"
                className="block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-200 dark:border-gray-800">
            <NavLink
              to={getSettingsPath()}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm w-full
                ${isActive 
                  ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white'}
              `}
            >
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
