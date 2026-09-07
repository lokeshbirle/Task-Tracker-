import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import DashboardLayout from './layouts/DashboardLayout'

import Login from './pages/Login'
import Register from './pages/Register'
import Notifications from './pages/Notifications'
import TaskDetail from './pages/shared/TaskDetail'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTeams from './pages/admin/AdminTeams'
import AdminTasks from './pages/admin/AdminTasks'
import TeamTasks from './pages/admin/TeamTasks'
import Reports from './pages/admin/Reports'

import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import MyTasks from './pages/employee/MyTasks'
import Profile from './pages/employee/Profile'

// Role-aware landing so /app always renders the right dashboard without a redirect flash
function RoleDashboard() {
  const { isAdmin } = useAuth()
  return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/app" element={<RoleDashboard />} />
          <Route path="/app/notifications" element={<Notifications />} />

          {/* Employee-only pages (Admin has no need for them, but nothing sensitive here) */}
          <Route path="/app/my-tasks" element={<MyTasks />} />
          <Route path="/app/my-tasks/:id" element={<TaskDetail />} />
          <Route path="/app/profile" element={<Profile />} />

          {/* Admin-only pages, gated client-side; backend still enforces via @PreAuthorize/RBAC */}
          <Route element={<AdminRoute />}>
            <Route path="/app/users" element={<AdminUsers />} />
            <Route path="/app/teams" element={<AdminTeams />} />
            <Route path="/app/teams/:id/tasks" element={<TeamTasks />} />
            <Route path="/app/tasks" element={<AdminTasks />} />
            <Route path="/app/tasks/:id" element={<TaskDetail />} />
            <Route path="/app/reports" element={<Reports />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}
