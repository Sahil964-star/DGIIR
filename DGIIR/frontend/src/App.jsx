import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './auth/pages/LoginPage';

const queryClient = new QueryClient();

// Mock Component for Authorized Routes
const MockDashboard = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white transition-colors duration-300">
    <h1 className="text-3xl font-bold">{title} Dashboard</h1>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Primary Auth Route */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<Navigate to="/" replace />} />

              {/* Protected Routes (Require Authentication) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/citizen" element={<MockDashboard title="Citizen" />} />
                <Route path="/dashboard/operations" element={<MockDashboard title="Operations" />} />
                <Route path="/dashboard/officer" element={<MockDashboard title="Field Officer" />} />
                <Route path="/dashboard/cm" element={<MockDashboard title="Chief Minister" />} />
              </Route>

              {/* Default Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
