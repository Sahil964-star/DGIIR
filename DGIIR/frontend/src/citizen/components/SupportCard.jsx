import React from 'react';
import { PhoneCall, Mail, AlertCircle, MessageSquare, HelpCircle, Building2 } from 'lucide-react';
import Card from '../../shared/components/Card';

const SupportCard = () => {
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden hover:scale-[1.01] transition-transform duration-300">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4 relative z-10">Help & Support</h3>
      <div className="space-y-3 relative z-10">
        <a href="tel:1076" className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-600">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Call Support</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dial 1076 (Toll Free)</p>
          </div>
        </a>
        
        <a href="mailto:support@delhi.gov.in" className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-600">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 text-green-600 dark:text-green-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Email Support</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">support@delhi.gov.in</p>
          </div>
        </a>

        {/* New Support Options */}
        <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-700"></div>
        <div className="flex justify-between">
          <button className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium">FAQ</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-medium">Chat</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Depts</span>
          </button>
        </div>

        <a href="tel:112" className="flex items-center p-3 mt-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-800/50">
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mr-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Emergency Helpline</p>
            <p className="text-xs text-red-500 dark:text-red-500/80">Dial 112</p>
          </div>
        </a>
      </div>
      {/* Decorative subtle icon background */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <PhoneCall className="w-40 h-40 text-slate-900 dark:text-white" />
      </div>
    </Card>
  );
};

export default SupportCard;
