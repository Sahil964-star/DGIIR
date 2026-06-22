import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Phone, Globe, Map, Bell, CheckCircle2 } from 'lucide-react';
import BrandingPanel from '../../components/BrandingPanel';
import ThemeToggle from '../components/ThemeToggle';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const languages = ["English", "Hindi", "Punjabi", "Urdu"];
const zones = ["Zone A (Central/New Delhi)", "Zone B (South/South East)", "Zone C (West/South West)", "Zone D (North/North West)", "Zone E (East/North East/Shahdara)"];

const OfficerOnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup'); // 'setup' | 'gateway'
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    emergencyContact: '',
    language: 'English',
    zone: '',
    notifySms: true,
    notifyEmail: true,
    notifyPush: true
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSetupComplete = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('gateway');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-300 flex">
      <BrandingPanel variant="login" />
      
      <div className="w-full lg:w-[55%] flex flex-col relative overflow-hidden">
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-800/30 rounded-full blur-[100px] pointer-events-none hidden dark:block"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-900/10 rounded-full blur-[80px] pointer-events-none hidden dark:block"></div>
        
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative z-10 overflow-y-auto">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait">
              
              {/* STAGE 5: SETUP PIPELINE */}
              {step === 'setup' && (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                      Initialize Officer Profile
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Configure your active operational preferences.
                    </p>
                  </div>

                  <form onSubmit={handleSetupComplete} className="space-y-6 bg-white/50 dark:bg-[#111827]/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-100 dark:border-[#1f2937] shadow-sm">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center justify-center mb-6">
                      <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-[#0f172a] shadow-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                        <Camera className="w-8 h-8 text-slate-400 group-hover:text-green-500 transition-colors" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold">Upload</span>
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-3">Profile Photo</span>
                    </div>

                    <Input id="emergencyContact" type="tel" placeholder="Emergency Contact Number" value={formData.emergencyContact} onChange={handleChange} icon={Phone} required />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-slate-400" />
                        </div>
                        <select id="language" value={formData.language} onChange={handleChange} required
                          className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block p-3.5 transition-colors">
                          <option value="" disabled>Preferred Language</option>
                          {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Map className="h-5 w-5 text-slate-400" />
                        </div>
                        <select id="zone" value={formData.zone} onChange={handleChange} required
                          className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block p-3.5 transition-colors">
                          <option value="" disabled>Working Zone Boundary</option>
                          {zones.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Notification Matrix */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                        <Bell className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" />
                        Notification Preferences
                      </h4>
                      <div className="space-y-3">
                        {[
                          { id: 'notifySms', label: 'SMS Alerts (Critical Dispatch)' },
                          { id: 'notifyEmail', label: 'Email Reports (Daily Digest)' },
                          { id: 'notifyPush', label: 'System In-App Push Alerts' }
                        ].map((pref) => (
                          <label key={pref.id} className="flex items-center space-x-3 cursor-pointer">
                            <input id={pref.id} type="checkbox" checked={formData[pref.id]} onChange={handleChange}
                              className="rounded border-slate-300 text-green-600 focus:ring-green-600 bg-white dark:bg-slate-800 dark:border-slate-600 h-5 w-5 transition-colors" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{pref.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" fullWidth variant="primary" isLoading={isLoading}
                      className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-4 mt-6">
                      Complete Setup
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* STAGE 6: GATEWAY */}
              {step === 'gateway' && (
                <motion.div
                  key="gateway"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center w-full py-12"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                    Welcome Officer
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                    Your structural profile configuration setup is complete. Direct operations access is now provisioned.
                  </p>
                  
                  <Button 
                    onClick={() => navigate('/dashboard/officer')}
                    fullWidth 
                    variant="primary"
                    className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-4 text-lg shadow-lg shadow-green-900/20"
                  >
                    Go To Officer Dashboard
                  </Button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerOnboardingPage;
