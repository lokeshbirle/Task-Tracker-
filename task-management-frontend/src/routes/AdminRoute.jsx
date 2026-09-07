import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Frontend-side gate only - the real enforcement is server-side RBAC (@PreAuthorize / SecurityConfig). */
export default function AdminRoute() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/app" replace />
  return <Outlet />
}
