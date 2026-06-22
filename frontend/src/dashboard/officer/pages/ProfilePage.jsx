import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Phone, Shield, Building, MapPin, Check, AlertCircle, Lock } from 'lucide-react';
import { authApi } from '../../../api/authApi';
import Loader from '../../../shared/components/Loader';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  
  // Tab control
  const [activeSubTab, setActiveSubTab] = useState('profile'); // profile | password

  // Form states
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Status feedback
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: resp, isLoading, isError } = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      const data = await authApi.getCurrentUser();
      const u = data?.data?.user || data?.user;
      if (u) {
        setProfileForm({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || ''
        });
      }
      return u;
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      setSuccessMessage('Profile details updated successfully!');
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (err) => {
      setErrorMessage(err?.response?.data?.message || 'Failed to update profile details.');
      setSuccessMessage('');
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => authApi.changePassword(data),
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Password updated successfully!');
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (err) => {
      setErrorMessage(err?.response?.data?.message || 'Failed to change password.');
      setSuccessMessage('');
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Failed to Load Profile</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">An error occurred while loading your profile details from backend.</p>
      </div>
    );
  }

  const user = resp;

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your personal credentials, contact details, and account security.</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-sm">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-400 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Card: Summary Stats */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-3xl border border-slate-200 dark:border-slate-800 mx-auto">
            {(user?.name || 'O').charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">{user?.role?.replace(/_/g, ' ')}</p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 text-left space-y-3.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span>Dept: {user?.department?.name || 'Delhi Governance Response'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Zone: {user?.district?.name || 'Delhi District Zone'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>ID: {user?.id?.substring(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Right Card: Actions Tabbed Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          {/* Sub-Tabs */}
          <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-6 select-none">
            <button
              onClick={() => {
                setActiveSubTab('profile');
                setErrorMessage('');
              }}
              className={`text-xs font-bold pb-2 border-b-2 transition-all ${
                activeSubTab === 'profile'
                  ? 'border-green-600 text-green-600 dark:text-green-400 dark:border-green-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}
            >
              Update Account Details
            </button>
            <button
              onClick={() => {
                setActiveSubTab('password');
                setErrorMessage('');
              }}
              className={`text-xs font-bold pb-2 border-b-2 transition-all ${
                activeSubTab === 'password'
                  ? 'border-green-600 text-green-600 dark:text-green-400 dark:border-green-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Form Content */}
          {activeSubTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl text-xs transition-colors border border-green-500 disabled:opacity-50 mt-4"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl text-xs transition-colors border border-green-500 disabled:opacity-50 mt-4"
              >
                {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
