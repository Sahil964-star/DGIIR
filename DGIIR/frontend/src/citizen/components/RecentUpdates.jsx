import React from 'react';
import Card from '../../shared/components/Card';
import { Clock } from 'lucide-react';

const RecentUpdates = () => {
  const updates = [
    {
      id: 1,
      text: 'Water complaint moved to field officer',
      time: '2 hours ago',
      color: 'bg-orange-500' // In Progress
    },
    {
      id: 2,
      text: 'Garbage complaint resolved',
      time: 'Yesterday',
      color: 'bg-green-500' // Resolved
    },
    {
      id: 3,
      text: 'Road repair verification pending',
      time: '2 days ago',
      color: 'bg-blue-500' // Submitted/Under Review
    }
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:scale-[1.01] transition-transform duration-300">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Updates</h3>
      <div className="space-y-4">
        {updates.map((update, index) => (
          <div key={update.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2.5 h-2.5 rounded-full ${update.color} mt-2 shadow-sm`}></div>
              {index !== updates.length - 1 && (
                <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-2"></div>
              )}
            </div>
            <div className="flex-1 pb-2">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{update.text}</p>
              <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{update.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentUpdates;
