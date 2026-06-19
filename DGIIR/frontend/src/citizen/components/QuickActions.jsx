import React from 'react';
import { ClipboardList, Search, Folder, AlertTriangle } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'File a Complaint',
      description: 'Report civic issues in your area',
      icon: ClipboardList,
      color: 'text-dgiir-green-600',
      bgColor: 'bg-dgiir-green-50',
      borderColor: 'hover:border-dgiir-green-200'
    },
    {
      title: 'Track Complaint',
      description: 'Check status of your reports',
      icon: Search,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'hover:border-blue-200'
    },
    {
      title: 'My Complaints',
      description: 'View your previous reports',
      icon: Folder,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'hover:border-purple-200'
    },
    {
      title: 'Report Urgent Issue',
      description: 'For immediate assistance needed',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'hover:border-orange-200'
    }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button 
            key={index}
            className={`flex flex-col text-left bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${action.borderColor}`}
          >
            <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-4`}>
              <action.icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
            <p className="text-sm text-gray-500">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
