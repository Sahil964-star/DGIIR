import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Droplet, Trash2, MapPin, Calendar, Hash, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import StatusBadge from '../../shared/components/StatusBadge';
import { complaintApi } from '../../api/complaintApi';
import Loader from '../../shared/components/Loader';

const getIconProps = (categoryName) => {
  if (!categoryName) return { icon: MapPin, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/30' };
  const lower = categoryName.toLowerCase();
  if (lower.includes('water') || lower.includes('drain')) return { icon: Droplet, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' };
  if (lower.includes('waste') || lower.includes('garbage')) return { icon: Trash2, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30' };
  if (lower.includes('road') || lower.includes('pothole')) return { icon: MapPin, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30' };
  return { icon: AlertCircle, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' };
};

const getStageFromStatus = (status) => {
  const upper = status?.toUpperCase() || 'SUBMITTED';
  if (upper === 'RESOLVED' || upper === 'CLOSED') return 4;
  if (upper === 'IN_PROGRESS' || upper === 'ASSIGNED') return 3;
  if (upper === 'REVIEWED' || upper === 'ACKNOWLEDGED') return 2;
  return 1;
};

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
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-complaints'],
    queryFn: () => complaintApi.getComplaints()
  });

  const complaints = data?.data?.complaints || data?.complaints || [];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Complaints</h3>
        <button 
          onClick={() => navigate('/citizen/my-reports')}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader size={32} /></div>
      ) : isError ? (
        <div className="text-red-500 py-4">Failed to load complaints.</div>
      ) : complaints.length === 0 ? (
        <div className="text-slate-500 dark:text-slate-400 py-4 text-center">No complaints found.</div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => {
            const { icon: IconComponent, color, bg } = getIconProps(complaint.category?.name);
            const displayId = complaint.id.split('-')[0].substring(0, 8).toUpperCase();
            
            return (
              <Card 
                key={complaint.id} 
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-start md:items-center gap-4 flex-col md:flex-row relative">
                  {/* Icon */}
                  <div className={`w-12 h-12 shrink-0 rounded-xl ${bg} flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${color}`} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full">
                    <div className="flex items-start justify-between mb-1 gap-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                        {complaint.title}
                      </h4>
                      <StatusBadge status={complaint.status} />
                    </div>
                    
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {complaint.department?.name || 'Assigned Department'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-4 h-4" />
                        <span>CMP-{displayId}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">ETA:</span>
                        <span>{complaint.etaHours ? `${complaint.etaHours} Hours` : 'TBD'}</span>
                      </div>
                    </div>
                    
                    <ProgressNodes currentStage={getStageFromStatus(complaint.status)} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
