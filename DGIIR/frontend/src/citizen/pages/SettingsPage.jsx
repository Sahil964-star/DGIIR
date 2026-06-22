import React from 'react';
import Card from '../../shared/components/Card';
import { useAuth } from '../../hooks/useAuth';

const SettingsPage = () => {
  const { user, role } = useAuth();

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account and preferences.
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Profile Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Name</label>
            <p className="text-base text-slate-900 dark:text-white font-semibold mt-0.5">{user?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Phone</label>
            <p className="text-base text-slate-900 dark:text-white font-semibold mt-0.5">{user?.phone || 'N/A'}</p>
          </div>
          {user?.email && (
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Email</label>
              <p className="text-base text-slate-900 dark:text-white font-semibold mt-0.5">{user.email}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Account Type</label>
            <p className="text-base text-slate-900 dark:text-white font-semibold mt-0.5 capitalize">{role?.toLowerCase() || 'N/A'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
