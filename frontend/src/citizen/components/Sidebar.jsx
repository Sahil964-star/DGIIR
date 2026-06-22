import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, Search, User, Bell, HelpCircle, ShieldAlert, PlusCircle } from 'lucide-react';
import Button from '../../shared/components/Button';

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: PlusCircle, label: 'Report Issue', path: '/report' },
    { icon: ClipboardList, label: 'My Complaints', path: '/complaints' },
    { icon: Search, label: 'Track Complaint', path: '/track' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: HelpCircle, label: 'Help & Support', path: '/support' },
  ];

  return (
    <div className="w-[260px] bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 border-r border-gray-100 dark:border-gray-700 flex flex-col pt-6 pb-6 px-4 z-10 transition-colors">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="bg-dgiir-green-700 text-white p-2 rounded-xl">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 dark:text-white leading-tight">DGIIR</h1>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            Delhi Governance Intelligence<br/>& Incident Response
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-dgiir-green-50 dark:bg-dgiir-green-900/30 text-dgiir-green-700 dark:text-dgiir-green-400 font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Need Help Card */}
      <div className="mt-auto pt-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="bg-white dark:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm transition-colors">
            <HelpCircle className="w-5 h-5 text-dgiir-green-700 dark:text-dgiir-green-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Need Help?</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Our support team is available 24/7</p>
          <Button variant="primary" size="sm" className="w-full hover:brightness-110 transition-all duration-300">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
