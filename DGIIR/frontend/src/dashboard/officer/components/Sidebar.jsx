import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckSquare, Map, CheckCircle2, ShieldCheck, Bell, User, HelpCircle, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../hooks/useAuth';

const Sidebar = ({ officerProfile }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    queryClient.clear();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/officer' },
    { name: 'My Incidents', icon: FileText, path: '/dashboard/officer/incidents' },
    { name: 'Today\'s Tasks', icon: CheckSquare, path: '/dashboard/officer/tasks' },
    { name: 'Map View', icon: Map, path: '/dashboard/officer/map' },
    { name: 'Completed', icon: CheckCircle2, path: '/dashboard/officer/completed' },
    { name: 'Verification Queue', icon: ShieldCheck, path: '/dashboard/officer/verification' },
    { name: 'Notifications', icon: Bell, path: '/dashboard/officer/notifications', badge: 5 },
    { name: 'Profile', icon: User, path: '/dashboard/officer/profile' },
    { name: 'Help & Support', icon: HelpCircle, path: '/dashboard/officer/support' },
  ];

  return (
    <aside className="w-[280px] h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 border-r border-slate-800 hidden md:flex z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-xl">
          D
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">DGIIR</h1>
          <p className="text-[10px] text-slate-400">Delhi Governance Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard/officer'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-green-600/10 text-green-500 font-medium' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 mb-2">
          <img 
            src={officerProfile.avatar} 
            alt={officerProfile.name} 
            className="w-10 h-10 rounded-full border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">{officerProfile.name}</h3>
            <p className="text-xs text-slate-400 truncate">{officerProfile.designation}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
