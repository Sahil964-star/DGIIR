import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Briefcase, Building, FileBadge, CheckSquare, UploadCloud } from 'lucide-react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const departments = [
  "Delhi Jal Board", "MCD", "PWD", "Electricity Department", 
  "Transport Department", "Disaster Management", "Environment Department"
];

const districts = [
  "Central Delhi", "East Delhi", "New Delhi", "North Delhi",
  "North East Delhi", "North West Delhi", "Shahdara",
  "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
];

const AccessRequestForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    mobile: '',
    department: '',
    designation: '',
    district: '',
    officeAddress: '',
    certified: false
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
    if (!formData.certified) return;
    
    setIsLoading(true);
    // Simulate API call for submitting access request
    setTimeout(() => {
      setIsLoading(false);
      navigate('/officer/request-submitted');
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
          Request Field Officer Access
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Submit your official verification parameters for centralized validation.
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
              <Building className="h-5 w-5 text-slate-400" />
            </div>
            <select id="department" value={formData.department} onChange={handleChange} required
              className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block p-3.5 transition-colors">
              <option value="" disabled>Select Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <Input id="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} icon={Briefcase} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <select id="district" value={formData.district} onChange={handleChange} required
              className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block p-3.5 transition-colors">
              <option value="" disabled>Assigned District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <Input id="officeAddress" placeholder="Office Address" value={formData.officeAddress} onChange={handleChange} required />
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
            <UploadCloud className="h-8 w-8 text-green-600 dark:text-green-500 mb-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload Government ID Card</span>
            <span className="text-xs text-slate-500 mt-1">Required (PDF, JPG)</span>
          </div>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload Appointment Letter</span>
            <span className="text-xs text-slate-500 mt-1">Optional (PDF)</span>
          </div>
        </div>

        <div className="flex items-center py-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input id="certified" type="checkbox" required checked={formData.certified} onChange={handleChange}
              className="rounded border-slate-300 text-green-600 focus:ring-green-600 bg-white dark:bg-slate-800 dark:border-slate-600 h-5 w-5" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
              <CheckSquare className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" />
              I certify that the information provided is accurate and official.
            </span>
          </label>
        </div>

        <div className="pt-2">
          <Button type="submit" fullWidth variant="primary" isLoading={isLoading} disabled={!formData.certified}
            className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-4 text-lg">
            Submit Request
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AccessRequestForm;
