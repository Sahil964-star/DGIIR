import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, Trash2, Calendar, AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { notificationApi } from '../../../api/notificationApi';
import Loader from '../../../shared/components/Loader';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'ASSIGNMENT':
      return { icon: Bell, bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' };
    case 'SLA_BREACH':
      return { icon: AlertTriangle, bg: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' };
    case 'ESCALATION':
      return { icon: AlertCircle, bg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400' };
    default:
      return { icon: Info, bg: 'bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400' };
  }
};

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: resp, isLoading, isError } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: () => notificationApi.getNotifications()
  });

  const readMutation = useMutation({
    mutationFn: (id) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
    }
  });

  const readAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
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
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Failed to Load Notifications</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">An error occurred while fetching your notification history.</p>
      </div>
    );
  }

  const notifications = resp?.data?.notifications || resp?.notifications || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Stay updated with instant alert notifications, task assignments, and warnings.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => readAllMutation.mutate()}
            disabled={readAllMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl text-xs font-bold transition-all border border-slate-900 hover:opacity-90 disabled:opacity-50 shrink-0 self-start sm:self-auto"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <Bell className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">All Clear!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">You do not have any alerts or system notifications right now.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
          {notifications.map((n) => {
            const meta = getNotificationIcon(n.type);
            const Icon = meta.icon;
            const formattedDate = n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + 
              ', ' + new Date(n.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

            return (
              <div 
                key={n.id}
                className={`p-5 flex items-start gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors ${!n.isRead ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''}`}
              >
                {/* Notification Icon */}
                <div className={`p-3 rounded-full shrink-0 ${meta.bg}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm ${!n.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold block mt-2">
                    {formattedDate}
                  </span>
                </div>

                {/* Single Read Trigger */}
                {!n.isRead && (
                  <button
                    onClick={() => readMutation.mutate(n.id)}
                    disabled={readMutation.isPending}
                    title="Mark Read"
                    className="p-2 border border-slate-200/60 dark:border-slate-800 rounded-xl text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-200 transition-all shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
