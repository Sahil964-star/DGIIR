import React from 'react';
import { Droplet, Trash2, MapPin, Calendar, Hash, ArrowRight } from 'lucide-react';
import Card from '../../shared/components/Card';
import StatusBadge from '../../shared/components/StatusBadge';

const mockComplaints = [
  {
    id: 'CMP-2026-089',
    title: 'Water Supply Issue',
    department: 'Delhi Jal Board',
    location: 'Sector 4, Dwarka',
    date: '18 Jun 2026',
    eta: '48 Hours',
    status: 'In Progress',
    stage: 3, // 1: Submitted, 2: Reviewed, 3: Assigned, 4: Resolved
    icon: Droplet,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-900/30'
  },
  {
    id: 'CMP-2026-085',
    title: 'Garbage Collection Pending',
    department: 'MCD',
    location: 'Vasant Kunj, Block C',
    date: '16 Jun 2026',
    eta: '24 Hours',
    status: 'Submitted',
    stage: 1,
    icon: Trash2,
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-50 dark:bg-orange-900/30'
  },
  {
    id: 'CMP-2026-072',
    title: 'Pothole on Main Road',
    department: 'PWD',
    location: 'Outer Ring Road, Munirka',
    date: '10 Jun 2026',
    eta: 'Completed',
    status: 'Resolved',
    stage: 4,
    icon: MapPin,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-50 dark:bg-green-900/30'
  }
];

const ProgressNodes = ({ currentStage }) => {
  const stages = ['Submitted', 'Reviewed', 'Assigned', 'Resolved'];
  return (
    <div className="flex items-center gap-1 mt-3">
      {stages.map((stage, idx) => {
        const isCompleted = currentStage >= idx + 1;
        const isLast = idx === stages.length - 1;
        return (
          <React.Fragment key={stage}>
            <div className={`w-2.5 h-2.5 rounded-full ${isCompleted ? 'bg-dgiir-green-500' : 'bg-slate-300 dark:bg-slate-600 border border-slate-400 dark:border-slate-500'} shrink-0`} title={stage}></div>
            {!isLast && (
              <div className={`h-0.5 w-6 ${currentStage > idx + 1 ? 'bg-dgiir-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
            )}
          </React.Fragment>
        );
      })}
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 ml-2">{stages[currentStage - 1] || 'Submitted'}</span>
    </div>
  );
};

const ComplaintList = () => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Complaints</h3>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {mockComplaints.map((complaint) => (
          <Card 
            key={complaint.id} 
            className="cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 hover:scale-[1.01] transition-all duration-300 bg-white dark:bg-slate-800"
          >
            <div className="flex items-start md:items-center gap-4 flex-col md:flex-row relative">
              {/* Icon */}
              <div className={`w-12 h-12 shrink-0 rounded-xl ${complaint.iconBg} flex items-center justify-center`}>
                <complaint.icon className={`w-6 h-6 ${complaint.iconColor}`} />
              </div>

              {/* Details */}
              <div className="flex-1 w-full">
                <div className="flex items-start justify-between mb-1 gap-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                    {complaint.title}
                  </h4>
                  <StatusBadge status={complaint.status} />
                </div>
                
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{complaint.department}</p>
                
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-4 h-4" />
                    <span>{complaint.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted: {complaint.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">ETA:</span>
                    <span>{complaint.eta}</span>
                  </div>
                </div>
                
                <ProgressNodes currentStage={complaint.stage} />
              </div>
              
              {/* View Details CTA */}
              <div className="hidden md:flex items-center gap-1 text-sm font-medium text-dgiir-green-700 dark:text-dgiir-green-500 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2">
                View Details <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            
            {/* Mobile View Details CTA */}
            <div className="mt-4 md:hidden flex justify-end items-center gap-1 text-sm font-medium text-dgiir-green-700 dark:text-dgiir-green-500">
              View Details <ArrowRight className="w-4 h-4" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComplaintList;
