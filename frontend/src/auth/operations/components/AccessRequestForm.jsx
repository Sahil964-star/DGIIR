import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Briefcase, Building, FileBadge, UploadCloud, Shield } from 'lucide-react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { metaApi } from '../../../api/metaApi';

const roles = [
  "Operations Analyst", "Incident Coordinator", "Escalation Manager", 
  "Supervisor", "Control Room Operator"
];

const AccessRequestForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: districtsData, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ['districts'],
    queryFn: metaApi.getDistricts
  });
  
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    mobile: '',
    designation: '',
    district: '',
    officeAddress: '',
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call for submitting access request
    setTimeout(() => {
      setIsLoading(false);
      navigate('/operations/request-submitted');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Request Operations Team Access
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Submit your details for administrative review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} icon={User} required />
          <Input id="employeeId" placeholder="Employee ID" value={formData.employeeId} onChange={handleChange} icon={FileBadge} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="email" type="email" placeholder="Official Government Email" value={formData.email} onChange={handleChange} icon={Mail} required />
          <Input id="mobile" type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} icon={Phone} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-slate-400" />
            </div>
            <select id="designation" value={formData.designation} onChange={handleChange} required
              className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block p-3.5 transition-colors">
              <option value="" disabled>Role Designation</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <select id="district" value={formData.district} onChange={handleChange} required disabled={isLoadingDistricts}
              className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block p-3.5 transition-colors">
              <option value="" disabled>{isLoadingDistricts ? "Loading..." : "Assigned Region"}</option>
              {districtsData?.data?.districts?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              <option value="ALL">All Regions (HQ)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Input id="officeAddress" placeholder="Office Address" value={formData.officeAddress} onChange={handleChange} icon={Building} required />
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
            <UploadCloud className="h-8 w-8 text-green-600 dark:text-green-500 mb-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload Government ID</span>
            <span className="text-xs text-slate-500 mt-1">Required (PDF, JPG)</span>
          </div>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
            <UploadCloud className="h-8 w-8 text-green-600 dark:text-green-500 mb-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload Authorization Letter</span>
            <span className="text-xs text-slate-500 mt-1">Required (PDF)</span>
          </div>
        </div>

        {/* Integrity Validation Indicators Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-green-600" />
              <span>Role-Based Access Control Enabled</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-green-600" />
              <span>Audit Logging Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-green-600" />
              <span>Govt Secure Access Protocol</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" fullWidth variant="primary" isLoading={isLoading}
            className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-4 text-lg">
            Submit Access Request
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AccessRequestForm;
