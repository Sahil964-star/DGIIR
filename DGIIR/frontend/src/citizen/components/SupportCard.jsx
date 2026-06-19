import React from 'react';
import { PhoneCall } from 'lucide-react';
import Card from '../../shared/components/Card';

const SupportCard = () => {
  return (
    <Card className="bg-red-50 border-red-100 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 text-red-600">
          <PhoneCall className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">Emergency Contact</h3>
        <p className="text-sm text-gray-600 mb-4">For urgent civic issues requiring immediate intervention.</p>
        <a 
          href="tel:1076" 
          className="bg-white border border-red-200 text-red-600 font-bold py-2.5 px-6 rounded-xl text-lg shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors w-full"
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
