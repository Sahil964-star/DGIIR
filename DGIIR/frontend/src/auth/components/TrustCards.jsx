import React from 'react';
import { ShieldCheck, Clock, CheckCircle } from 'lucide-react';

const TrustCards = () => {
  const cards = [
    {
      icon: <ShieldCheck size={28} className="text-green-700 dark:text-green-500" strokeWidth={1.5} />,
      title: "Secure",
      description: "Your data is safe and protected"
    },
    {
      icon: <Clock size={28} className="text-green-700 dark:text-green-500" strokeWidth={1.5} />,
      title: "Real-time",
      description: "Track and get updates in real-time"
    },
    {
      icon: <CheckCircle size={28} className="text-green-700 dark:text-green-500" strokeWidth={1.5} />,
      title: "Accountable",
      description: "Ensuring transparency and accountability"
    }
  ];

  return (
    <div className="flex flex-row justify-between bg-[#f0f9f0] dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 rounded-[20px] p-6 w-full max-w-md mx-auto">
      {cards.map((card, index) => (
        <div key={index} className="flex flex-col items-center text-center px-2 flex-1">
          <div className="mb-3 p-1">
            {card.icon}
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{card.title}</h3>
          <p className="text-[11px] leading-tight text-slate-600 dark:text-slate-400">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TrustCards;
