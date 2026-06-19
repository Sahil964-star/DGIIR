import React from 'react';
import { PhoneCall } from 'lucide-react';
import Card from '../../shared/components/Card';

const SupportCard = () => {
  return (
    <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 relative overflow-hidden transition-colors">
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mb-3 text-red-600 dark:text-red-400 transition-colors">
          <PhoneCall className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Emergency Contact</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">For urgent civic issues requiring immediate intervention.</p>
        <a 
          href="tel:1076" 
          className="bg-white dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold py-2.5 px-6 rounded-xl text-lg shadow-sm hover:bg-red-50 dark:hover:bg-red-900/60 hover:border-red-300 dark:hover:border-red-700 transition-colors w-full"
        >
          Dial 1076
        </a>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
        <PhoneCall className="w-32 h-32" />
      </div>
    </Card>
  );
};

export default SupportCard;
