import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi } from '../../api/dashboardApi'
import { tasksApi } from '../../api/tasksApi'
import StatCard from '../../components/StatCard'
import TaskCard from '../../components/TaskCard'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { useAuth } from '../../context/AuthContext'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const [statsRes, tasksRes] = await Promise.all([
        dashboardApi.getStats(),
        tasksApi.getAll(), // backend already scopes this to "my tasks" for an EMPLOYEE caller
      ])
      setStats(statsRes.data)
      setTasks(tasksRes.data)
      setLoading(false)
    })()
  }, [])

  if (loading) return <Loader />

  const highPriority = tasks.filter((t) => ['HIGH', 'URGENT'].includes(t.priority) && t.status !== 'COMPLETED')
  const recentlyCompleted = tasks
    .filter((t) => t.status === 'COMPLETED')
    .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
    .slice(0, 4)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-slate-500 mt-1">Here's what's on your plate today.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatCard label="My Tasks" value={stats.totalTasks} />
        <StatCard label="Pending" value={stats.todo} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Overdue" value={stats.overdue} accent={stats.overdue > 0} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">High priority</h2>
        {highPriority.length === 0 ? (
          <EmptyState title="Nothing urgent" description="No high or urgent priority tasks pending." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highPriority.map((t) => <TaskCard key={t.id} task={t} basePath="/app/my-tasks" />)}
          </div>
        )}
      </div>

      {recentlyCompleted.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Recently completed</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyCompleted.map((t) => <TaskCard key={t.id} task={t} basePath="/app/my-tasks" />)}
          </div>
        </div>
      )}

      <div className="text-right">
        <Link to="/app/my-tasks" className="text-sm font-medium text-ink-900 hover:underline">
          View all my tasks →
        </Link>
      </div>
    </div>
  )
}
