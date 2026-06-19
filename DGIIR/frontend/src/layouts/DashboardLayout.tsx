import { Outlet } from 'react-router-dom'
import Sidebar from '../dashboard/components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex">
      <Sidebar />
      {/* Push content past fixed sidebar */}
      <main className="flex-1 ml-56 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
