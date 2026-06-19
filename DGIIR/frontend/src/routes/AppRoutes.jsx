import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CitizenDashboard from '../citizen/pages/CitizenDashboard';
import OfficerDashboard from '../dashboard/officer/pages/OfficerDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root to citizen dashboard by default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Citizen Dashboard Route */}
      <Route path="/dashboard" element={<CitizenDashboard />} />
      
      {/* Officer Dashboard Route */}
      <Route path="/dashboard/officer" element={<OfficerDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
