import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import OperationsBrandingPanel from '../components/OperationsBrandingPanel';
import ThemeToggle from '../components/ThemeToggle';
import RequestTimeline from '../components/RequestTimeline';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const TrackRequestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-300 flex">
      <OperationsBrandingPanel />
      
      {/* Right Content Area */}
      <div className="w-full lg:w-[55%] flex flex-col relative overflow-hidden">
        {/* Top Bar */}
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-sm font-semibold text-slate-500 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Public Portal
          </button>
        </div>
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-800/30 rounded-full blur-[100px] pointer-events-none hidden dark:block"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-900/10 rounded-full blur-[80px] pointer-events-none hidden dark:block"></div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 relative z-10">
          <div className="w-full max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Immutable Progress Tracking Hub
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor the precise records of your access request and audit status.
              </p>
            </div>

            <Card className="p-8 bg-white/80 dark:bg-[#111827]/90 backdrop-blur-sm border border-slate-200 dark:border-[#1f2937]">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">OPS-2026-0042</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Operations Control Center • Submitted Oct 14, 2026</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center">
                  <span className="px-4 py-1.5 text-sm font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border border-amber-200 dark:border-amber-800/50">
                    Verification
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <RequestTimeline currentStatus="verification" />
              
              <div className="mt-10 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Current Audit Status:</strong> Security clearance and administrative review are actively processing your authorization letter and government ID metrics.
              </div>
            </Card>

            <div className="mt-8 flex justify-center space-x-4">
              <Button variant="outline" className="text-slate-600 dark:text-slate-400">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Record
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackRequestPage;
