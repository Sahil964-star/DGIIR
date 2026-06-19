import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Routes & Layout
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './shared/components/Layout';

// Auth Pages
import LoginPage from './auth/pages/LoginPage';
import RegisterPage from './auth/pages/RegisterPage';

// Officer Auth Pages
import OfficerLoginPage from './auth/officer/pages/OfficerLoginPage';
import RequestAccessPage from './auth/officer/pages/RequestAccessPage';
import RequestSubmittedPage from './auth/officer/pages/RequestSubmittedPage';
import TrackRequestPage from './auth/officer/pages/TrackRequestPage';
import OfficerOnboardingPage from './auth/officer/pages/OfficerOnboardingPage';

// Operations Auth Pages
import OperationsLoginPage from './auth/operations/pages/OperationsLoginPage';
import OpsRequestAccessPage from './auth/operations/pages/RequestAccessPage';
import OpsRequestSubmittedPage from './auth/operations/pages/RequestSubmittedPage';
import OpsTrackRequestPage from './auth/operations/pages/TrackRequestPage';
import OperationsSetupPage from './auth/operations/pages/OperationsSetupPage';

// Password Reset Pages
import ForgotPasswordPage from './auth/password-reset/pages/ForgotPasswordPage';
import OTPVerificationPage from './auth/password-reset/pages/OTPVerificationPage';
import ResetPasswordPage from './auth/password-reset/pages/ResetPasswordPage';
import ResetSuccessPage from './auth/password-reset/pages/ResetSuccessPage';

// Dashboard Pages
import CitizenDashboard from './citizen/pages/CitizenDashboard';
import OperationsDashboard from './dashboard/pages/OperationsDashboard';
import OfficerDashboard from './dashboard/pages/OfficerDashboard';
import CMDashboard from './dashboard/pages/CMDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Primary Auth Routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Officer Auth Pipeline */}
              <Route path="/officer/login" element={<OfficerLoginPage />} />
              <Route path="/officer/request-access" element={<RequestAccessPage />} />
              <Route path="/officer/request-submitted" element={<RequestSubmittedPage />} />
              <Route path="/officer/track-request" element={<TrackRequestPage />} />
              <Route path="/officer/onboarding" element={<OfficerOnboardingPage />} />

              {/* Operations Auth Pipeline */}
              <Route path="/operations/login" element={<OperationsLoginPage />} />
              <Route path="/operations/request-access" element={<OpsRequestAccessPage />} />
              <Route path="/operations/request-submitted" element={<OpsRequestSubmittedPage />} />
              <Route path="/operations/track-request" element={<OpsTrackRequestPage />} />
              <Route path="/operations/setup" element={<OperationsSetupPage />} />

              {/* Password Reset Pipeline */}
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/forgot-password/verify" element={<OTPVerificationPage />} />
              <Route path="/forgot-password/reset" element={<ResetPasswordPage />} />
              <Route path="/forgot-password/success" element={<ResetSuccessPage />} />

              {/* Protected Routes (Require Authentication) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  {/* Citizen Routes */}
                  <Route path="/citizen" element={<CitizenDashboard />} />
                  <Route path="/citizen/*" element={<Navigate to="/citizen" replace />} />

                  {/* Operations Routes */}
                  <Route path="/dashboard/operations" element={<OperationsDashboard />} />
                  <Route path="/dashboard/operations/*" element={<Navigate to="/dashboard/operations" replace />} />

                  {/* Officer Routes */}
                  <Route path="/dashboard/officer" element={<OfficerDashboard />} />
                  <Route path="/dashboard/officer/*" element={<Navigate to="/dashboard/officer" replace />} />

                  {/* CM Routes */}
                  <Route path="/dashboard/cm" element={<CMDashboard />} />
                  <Route path="/dashboard/cm/*" element={<Navigate to="/dashboard/cm" replace />} />
                </Route>
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
