import React from 'react';
import Card from '../../shared/components/Card';

const HowItWorks = () => {
  const steps = [
    { num: 1, title: 'File a Complaint', desc: 'Provide details and location of the issue.' },
    { num: 2, title: 'We Process It', desc: 'Our AI categorizes and routes it to the right dept.' },
    { num: 3, title: 'You Get Updates', desc: 'Track progress until it is fully resolved.' }
  ];

  return (
    <Card className="mb-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6">How It Works</h3>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white dark:border-gray-800 bg-dgiir-green-100 dark:bg-dgiir-green-900/50 text-dgiir-green-700 dark:text-dgiir-green-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 transition-colors">
              {step.num}
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{step.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HowItWorks;
