import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import OverviewPage    from './dashboard/pages/OverviewPage'
import ComplaintsPage  from './dashboard/pages/ComplaintsPage'
import ReportsPage     from './dashboard/pages/ReportsPage'
import ComplaintFormPage from './citizen/pages/ComplaintFormPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview"   element={<OverviewPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="reports"    element={<ReportsPage />} />
      </Route>
      <Route path="/submit" element={<ComplaintFormPage />} />
    </Routes>
  )
}
