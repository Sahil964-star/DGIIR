import React from 'react';
import { Users, User, AlertCircle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const roles = [
  {
    id: 'citizen',
    title: 'Citizen',
    description: 'Report an issue',
    icon: Users,
    colorClass: 'text-green-600',
    bgClass: 'bg-green-50',
  },
  {
    id: 'operations',
    title: 'Operations Team',
    description: 'Manage incidents',
    icon: User,
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-50',
  },
  {
    id: 'officer',
    title: 'Field Officer',
    description: 'Resolve incidents',
    icon: AlertCircle,
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-50',
  },
  {
    id: 'cm',
    title: 'CM Dashboard',
    description: 'Executive view',
    icon: Crown,
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-50',
  }
];

const RoleSelector = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Login as</h3>
      <div className="flex flex-row justify-between gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;
          
          return (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={`
                relative flex flex-col items-center flex-1 min-w-[120px] p-4 rounded-xl text-center border transition-all focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-1 dark:focus:ring-offset-slate-900
                ${isSelected 
                  ? 'border-green-600 bg-green-50/50 dark:bg-green-900/20 ring-1 ring-green-600' 
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`
                p-2 rounded-full mb-3
                ${role.bgClass} ${role.colorClass} dark:bg-opacity-20
              `}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col items-center">
                <div className={`font-bold text-sm leading-tight mb-1 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                  {role.title}
                </div>
                <div className="text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                  {role.description}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
