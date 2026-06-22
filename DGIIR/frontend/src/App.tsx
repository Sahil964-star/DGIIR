import { Routes, Route, Navigate } from 'react-router-dom';

// Auth context/components
// @ts-ignore
import ProtectedRoute from './routes/ProtectedRoute';
// @ts-ignore
import Layout from './shared/components/Layout';

// Auth Pages
// @ts-ignore
import LoginPage from './auth/pages/LoginPage';
// @ts-ignore
import RegisterPage from './auth/pages/RegisterPage';

// Officer Auth Pages
// @ts-ignore
import OfficerLoginPage from './auth/officer/pages/OfficerLoginPage';
// @ts-ignore
import RequestAccessPage from './auth/officer/pages/RequestAccessPage';
// @ts-ignore
import RequestSubmittedPage from './auth/officer/pages/RequestSubmittedPage';
// @ts-ignore
import TrackRequestPage from './auth/officer/pages/TrackRequestPage';
// @ts-ignore
import OfficerOnboardingPage from './auth/officer/pages/OfficerOnboardingPage';

// Operations Auth Pages
// @ts-ignore
import OperationsLoginPage from './auth/operations/pages/OperationsLoginPage';
// @ts-ignore
import OpsRequestAccessPage from './auth/operations/pages/RequestAccessPage';
// @ts-ignore
import OpsRequestSubmittedPage from './auth/operations/pages/RequestSubmittedPage';
// @ts-ignore
import OpsTrackRequestPage from './auth/operations/pages/TrackRequestPage';
// @ts-ignore
import OperationsSetupPage from './auth/operations/pages/OperationsSetupPage';

// Password Reset Pages
// @ts-ignore
import ForgotPasswordPage from './auth/password-reset/pages/ForgotPasswordPage';
// @ts-ignore
import OTPVerificationPage from './auth/password-reset/pages/OTPVerificationPage';
// @ts-ignore
import ResetPasswordPage from './auth/password-reset/pages/ResetPasswordPage';
// @ts-ignore
import ResetSuccessPage from './auth/password-reset/pages/ResetSuccessPage';

// Dashboard Pages
// @ts-ignore
import CitizenDashboard from './citizen/pages/CitizenDashboard';
// @ts-ignore
import OperationsDashboard from './dashboard/pages/OperationsDashboard';
// @ts-ignore
import OfficerDashboard from './dashboard/officer/pages/OfficerDashboard';
// @ts-ignore
import OfficerLayout from './dashboard/officer/components/OfficerLayout';
// @ts-ignore
import MyIncidentsPage from './dashboard/officer/pages/MyIncidentsPage';
// @ts-ignore
import IncidentDetailsPage from './dashboard/officer/pages/IncidentDetailsPage';
// @ts-ignore
import AssignmentsPage from './dashboard/officer/pages/AssignmentsPage';
// @ts-ignore
import InProgressPage from './dashboard/officer/pages/InProgressPage';
// @ts-ignore
import SlaDeadlinesPage from './dashboard/officer/pages/SlaDeadlinesPage';
// @ts-ignore
import OfficerReportsPage from './dashboard/officer/pages/ReportsPage';
// @ts-ignore
import ProfilePage from './dashboard/officer/pages/ProfilePage';
// @ts-ignore
import OfficerNotificationsPage from './dashboard/officer/pages/NotificationsPage';
// @ts-ignore
import HelpSupportPage from './dashboard/officer/pages/HelpSupportPage';

// Intake / CM Dashboard (from origin/main)
import DashboardLayout from './layouts/DashboardLayout';
import OverviewPage from './dashboard/pages/OverviewPage';
import ComplaintsPage from './dashboard/pages/ComplaintsPage';
import ReportsPage from './dashboard/pages/ReportsPage';
import ComplaintFormPage from './citizen/pages/ComplaintFormPage';
// @ts-ignore
import MyReportsPage from './citizen/pages/MyReportsPage';
// @ts-ignore
import SettingsPage from './citizen/pages/SettingsPage';
// @ts-ignore
import NotificationsPage from './citizen/pages/NotificationsPage';
// @ts-ignore
import SupportPage from './citizen/pages/SupportPage';

export default function App() {
  return (
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

      {/* Public Complaint Intake Form */}
      <Route path="/submit" element={<ComplaintFormPage />} />

      {/* Protected Routes (Require Authentication) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Citizen Routes */}
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/report" element={<ComplaintFormPage />} />
          <Route path="/citizen/my-reports" element={<MyReportsPage />} />
          <Route path="/citizen/settings" element={<SettingsPage />} />
          <Route path="/citizen/notifications" element={<NotificationsPage />} />
          <Route path="/citizen/support" element={<SupportPage />} />
          <Route path="/citizen/*" element={<Navigate to="/citizen" replace />} />

          {/* Operations Routes */}
          <Route path="/dashboard/operations" element={<OperationsDashboard />} />
          <Route path="/dashboard/operations/*" element={<Navigate to="/dashboard/operations" replace />} />

          {/* CM Routes */}
          <Route path="/dashboard/cm" element={<Navigate to="/overview" replace />} />
          <Route path="/dashboard/cm/*" element={<Navigate to="/overview" replace />} />
        </Route>

        {/* CM Dashboard layout routes (from origin/main) */}
        <Route element={<ProtectedRoute allowedRoles={['CHIEF_MINISTER', 'SUPER_ADMIN']} />}>
          <Route path="/overview" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
          </Route>
          <Route path="/complaints" element={<DashboardLayout />}>
            <Route index element={<ComplaintsPage />} />
          </Route>
          <Route path="/reports" element={<DashboardLayout />}>
            <Route index element={<ReportsPage />} />
          </Route>
        </Route>

        {/* Officer Routes - Uses its own specialized layout (Sidebar & Header) */}
        <Route path="/dashboard/officer/*" element={<Navigate to="/officer" replace />} />
        
        {/* Officer Nested Routes via OfficerLayout */}
        <Route path="/officer" element={<OfficerLayout />}>
          <Route index element={<OfficerDashboard />} />
          <Route path="incidents" element={<MyIncidentsPage />} />
          <Route path="incidents/:id" element={<IncidentDetailsPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="in-progress" element={<InProgressPage />} />
          <Route path="sla" element={<SlaDeadlinesPage />} />
          <Route path="reports" element={<OfficerReportsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<OfficerNotificationsPage />} />
          <Route path="help" element={<HelpSupportPage />} />
          <Route path="*" element={<Navigate to="/officer" replace />} />
        </Route>
      </Route>

      {/* Default Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
