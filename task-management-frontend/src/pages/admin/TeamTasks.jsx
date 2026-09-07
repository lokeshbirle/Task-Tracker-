import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import { teamsApi } from '../../api/teamsApi'
import TaskCard from '../../components/TaskCard'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'

export default function TeamTasks() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [team, setTeam] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const [teamRes, tasksRes] = await Promise.all([
          teamsApi.getById(id),
          teamsApi.getTasks(id)
        ])
        setTeam(teamRes.data)
        setTasks(tasksRes.data)
      } catch (error) {
        console.error("Failed to load team tasks", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <Loader />

  return (
      <div className="max-w-7xl mx-auto pb-10">
        {/* Back Button */}
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Teams
        </button>

        {/* Header Section */}
        <div className="mb-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{team?.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5">Team Task Board • {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</p>
          </div>
        </div>

        {/* Task Grid */}
        {tasks.length === 0 ? (
            <EmptyState title="No tasks yet" description="This team currently has no active tasks." />
        ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {tasks.map((t) => <TaskCard key={t.id} task={t} basePath="/app/tasks" />)}
            </div>
        )}
      </div>
  )
}