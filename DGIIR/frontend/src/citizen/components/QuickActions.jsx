import React from 'react';
import { ClipboardList, Search, Folder, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'File Complaint',
      description: 'Report a civic issue',
      icon: ClipboardList,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      borderColor: 'hover:border-green-300 dark:hover:border-green-600'
    },
    {
      title: 'Track Complaint',
      description: 'Check issue status',
      icon: Search,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      borderColor: 'hover:border-blue-300 dark:hover:border-blue-600'
    },
    {
      title: 'My Complaints',
      description: 'View past reports',
      icon: Folder,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-50 dark:bg-slate-800',
      borderColor: 'hover:border-slate-300 dark:hover:border-slate-600'
    },
    {
      title: 'Emergency Issue',
      description: 'Immediate assistance',
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      borderColor: 'hover:border-red-300 dark:hover:border-red-600'
    }
  ];

  const handleAction = (title) => {
    if (title === 'File Complaint') {
      navigate('/citizen/report');
    } else if (title === 'Track Complaint' || title === 'My Complaints') {
      navigate('/citizen/my-reports');
    } else if (title === 'Emergency Issue') {
      window.location.href = 'tel:112';
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {actions.map((action, index) => (
          <button 
            key={index}
            onClick={() => handleAction(action.title)}
            className={`flex items-center text-left bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors cursor-pointer ${action.borderColor}`}
          >
            <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center shrink-0 mr-4`}>
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{action.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

