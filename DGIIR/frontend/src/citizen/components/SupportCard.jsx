import React from 'react';
import { PhoneCall } from 'lucide-react';
import Card from '../../shared/components/Card';

// SupportCard – provides quick emergency contact for citizens.
// Updated to use neutral theme consistent with the overall dashboard design.
const SupportCard = () => {
  return (
    <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden transition-colors relative">
      <div className="relative z-10 flex flex-col items-center text-center p-6">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 text-teal-600 dark:text-teal-400 transition-colors">
          <PhoneCall className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Emergency Contact</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          For urgent civic issues requiring immediate intervention.
        </p>
        <a
          href="tel:1076"
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl text-lg shadow-sm transition-colors w-full flex justify-center"
        >
          Dial 1076
        </a>
      </div>
      {/* Decorative subtle icon background */}
      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
        <PhoneCall className="w-32 h-32 text-gray-300 dark:text-gray-600" />
      </div>
    </Card>
  );
};

export default SupportCard;
