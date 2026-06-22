import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../../hooks/useAuth';

const OfficerLayout = () => {
  const { user } = useAuth();

  const officerProfile = {
    name: user?.name || 'Rajesh Kumar',
    role: user?.role || 'FIELD_OFFICER',
    designation: user?.role === 'FIELD_OFFICER' ? 'Field Officer' : 'Officer',
    avatar: user?.avatar
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex">
      {/* Left Sidebar */}
      <Sidebar officerProfile={officerProfile} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:ml-[280px] w-full min-w-0">
        {/* Top Header */}
        <Header officerProfile={officerProfile} />

        {/* Page Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficerLayout;
