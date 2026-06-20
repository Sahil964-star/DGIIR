import React, { useState } from 'react';
import { Camera, Image as ImageIcon, CheckCircle, Clock, MessageCircle, MapPin, Navigation, Layers, Building2, Users, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

// Fallback placeholder for images
const ImageWithFallback = ({ src, alt, className }) => (
  <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700 aspect-video bg-slate-100 dark:bg-gray-800">
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={(e) => {
        e.target.style.display = 'none';
        if (e.target.nextSibling) {
          e.target.nextSibling.style.display = 'flex';
        }
      }}
    />
    <div className="absolute inset-0 hidden flex-col items-center justify-center bg-slate-100 dark:bg-gray-800 text-slate-400">
      <ImageIcon className="w-6 h-6 mb-1" />
      <span className="text-sm">No Citizen Photo Available</span>
    </div>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'In Progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'Overdue':     return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'Assigned':    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    default:            return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'At Risk':  return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'Stable':   return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default:         return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
};

// Compact static map preview
const MapPreview = ({ location }) => (
  <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700 bg-slate-100 dark:bg-gray-800 relative h-20">
    <img
      src="https://staticmap.openstreetmap.de/staticmap.php?center=28.7041,77.1025&zoom=13&size=600x200&markers=28.7041,77.1025,red-pushpin"
      alt="Incident map"
      className="w-full h-full object-cover opacity-80 dark:opacity-60"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
    <div className="w-full h-full flex-col items-center justify-center bg-slate-100 dark:bg-gray-800 text-slate-400 gap-1 absolute inset-0 hidden">
      <MapPin className="w-5 h-5" />
      <span className="text-[10px]">Map preview</span>
    </div>
    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 rounded px-2 py-0.5">
      <Navigation className="w-2.5 h-2.5 text-green-600" />
      <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">Open in Maps</span>
    </div>
  </div>
);

const IncidentWorkspace = ({ incident }) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [afterPhotoUploaded, setAfterPhotoUploaded] = useState(false);

  const activeIncident = incident || {
    id: 'INC-2026-0042',
    title: 'Water Supply Issue',
    location: 'Rohini, Sector 7',
    assignedDate: '20 May 2026',
    citizenNotes: 'No water supply for the past 2 days. The main pipe seems to be leaking near the park entrance.',
    category: 'Water & Sanitation',
    department: 'Delhi Jal Board',
    severity: 'Critical',
    clusterId: 'CLU-ROH-042',
    affectedCitizens: 148,
    status: 'In Progress',
    beforePhoto: 'https://images.unsplash.com/photo-1541888079-05eb92ccbb06?auto=format&fit=crop&q=80&w=400&h=250'
  };

  const canSubmit = resolutionNotes.trim().length > 10 && afterPhotoUploaded;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="py-2 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">{activeIncident.id}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getStatusColor(activeIncident.status)}`}>{activeIncident.status}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getSeverityColor(activeIncident.severity)}`}>{activeIncident.severity}</span>
          </div>
          <button className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline">Full View</button>
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activeIncident.title}</h3>
      </div>

      {/* Incident Intelligence Strip */}
      <div className="py-4 border-y border-slate-200 dark:border-gray-800/60 shrink-0 my-2">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Incident Age:</span> 3 Days Open
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Users className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Citizen Impact:</span> {activeIncident.affectedCitizens} Residents Affected
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Last Update:</span> 2 Hours Ago
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Officer Assigned:</span> Rajesh Kumar
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto py-5 space-y-8 min-h-0 pr-2">

        {/* Map + Location */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Location</span>
            <span className="text-[11px] text-slate-400 ml-auto">{activeIncident.location}</span>
          </div>
          <MapPreview location={activeIncident.location} />
        </div>

        {/* Citizen Report */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <MessageCircle className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Citizen Report</span>
          </div>
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">"{activeIncident.citizenNotes}"</p>
            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Reported {activeIncident.assignedDate}</span>
            </div>
          </div>
        </div>

        {/* Evidence Photos */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <ImageIcon className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Evidence Photos</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-slate-400 mb-1 font-medium">Before Photo (Citizen Submitted)</p>
              <ImageWithFallback src={activeIncident.beforePhoto} alt="Before Photo" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-1 font-medium">After Photo (Officer Resolution)</p>
              {afterPhotoUploaded ? (
                <div className="rounded-lg overflow-hidden border border-green-400 dark:border-green-700 aspect-video bg-green-50 dark:bg-green-900/20 flex flex-col items-center justify-center gap-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-[10px] text-green-700 dark:text-green-400 font-medium">Uploaded</span>
                </div>
              ) : (
                <button
                  onClick={() => setAfterPhotoUploaded(true)}
                  className="w-full aspect-video flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 bg-slate-50 hover:bg-green-50 dark:bg-gray-800/50 dark:hover:bg-green-900/20 transition-colors text-slate-400 hover:text-green-600 dark:hover:text-green-400"
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Upload Photo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resolution Notes */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Resolution Notes</span>
          </div>
          <textarea
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Describe the corrective actions taken..."
            className="w-full h-16 p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
          {resolutionNotes.trim().length > 0 && resolutionNotes.trim().length <= 10 && (
            <p className="text-[10px] text-orange-500 mt-0.5">Add more detail (min. 10 characters).</p>
          )}
        </div>
      </div>

      {/* Closure Actions — sticky at bottom */}
      <div className="pb-2 pt-4 border-t border-slate-200 dark:border-gray-800/60 shrink-0 space-y-3">
        {/* Primary CTA — Submit for Closure */}
        <motion.button
          whileHover={{ scale: canSubmit ? 1.02 : 1 }}
          whileTap={{ scale: canSubmit ? 0.98 : 1 }}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all ${
            canSubmit
              ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-700/25 ring-2 ring-green-400/30'
              : 'bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-gray-700'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          Submit for Closure
          {!canSubmit && <span className="text-[10px] font-normal ml-1">(upload photo + add notes)</span>}
        </motion.button>
        <button className="w-full py-2 px-4 bg-transparent border border-slate-200 dark:border-gray-700 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
          Save as Draft
        </button>
      </div>
    </div>
  );
};

export default IncidentWorkspace;
