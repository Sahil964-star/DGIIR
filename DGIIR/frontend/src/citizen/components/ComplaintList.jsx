import React from 'react';
import { Droplet, Trash2, MapPin, Calendar, Hash } from 'lucide-react';
import Card from '../../shared/components/Card';
import StatusBadge from '../../shared/components/StatusBadge';

const mockComplaints = [
  {
    id: 'CMP-2026-089',
    title: 'Water Supply Issue',
    location: 'Sector 4, Dwarka',
    date: '18 Jun 2026',
    status: 'In Progress',
    icon: Droplet,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50'
  },
  {
    id: 'CMP-2026-085',
    title: 'Garbage Collection Pending',
    location: 'Vasant Kunj, Block C',
    date: '16 Jun 2026',
    status: 'Under Review',
    icon: Trash2,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50'
  },
  {
    id: 'CMP-2026-072',
    title: 'Pothole on Main Road',
    location: 'Outer Ring Road, Munirka',
    date: '10 Jun 2026',
    status: 'Resolved',
    icon: MapPin,
    iconColor: 'text-dgiir-green-600',
    iconBg: 'bg-dgiir-green-50'
  }
];

const ComplaintList = () => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">My Complaints</h3>
        <button className="text-sm font-medium text-dgiir-green-700 hover:text-dgiir-green-800">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {mockComplaints.map((complaint) => (
          <Card 
            key={complaint.id} 
            className="group cursor-pointer hover:border-dgiir-green-200 transition-colors"
          >
            <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
              {/* Icon */}
              <div className={`w-12 h-12 shrink-0 rounded-xl ${complaint.iconBg} flex items-center justify-center`}>
                <complaint.icon className={`w-6 h-6 ${complaint.iconColor}`} />
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-dgiir-green-700 transition-colors">
                    {complaint.title}
                  </h4>
                  <StatusBadge status={complaint.status} />
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-4 h-4" />
                    <span>{complaint.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{complaint.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{complaint.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComplaintList;
