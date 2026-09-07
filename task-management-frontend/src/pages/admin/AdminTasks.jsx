import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Filter, LayoutGrid, Table, X } from 'lucide-react'
import { tasksApi } from '../../api/tasksApi'
import { teamsApi } from '../../api/teamsApi'
import { usersApi } from '../../api/usersApi'
import TaskCard from '../../components/TaskCard'
import TaskFormModal from '../../components/TaskFormModal'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { TASK_STATUSES, TASK_PRIORITIES, STATUS_STYLES, PRIORITY_STYLES } from '../../utils/constants'

export default function AdminTasks() {
  const [tasks, setTasks] = useState([])
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  // Filter States
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [teamFilter, setTeamFilter] = useState('')

  // View Mode: 'grid' or 'table'
  const [viewMode, setViewMode] = useState('grid')

  const load = async () => {
    try {
      const [tasksRes, teamsRes, usersRes] = await Promise.all([
        tasksApi.getAll(), teamsApi.getAll(), usersApi.getAll(),
      ])
      setTasks(tasksRes.data)

      // Filter out deleted/inactive teams
      const activeTeams = (teamsRes.data || []).filter(
          (team) => team.status !== 'INACTIVE' && team.status !== 'DELETED'
      )
      setTeams(activeTeams)
      setMembers(usersRes.data)
    } catch (error) {
      console.error("Failed to load admin tasks", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (payload) => {
    await tasksApi.create(payload)
    await load()
  }

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id?.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter && t.status !== statusFilter) return false
      if (priorityFilter && t.priority !== priorityFilter) return false
      if (teamFilter && t.teamId !== teamFilter) return false
      return true
    })
  }, [tasks, search, statusFilter, priorityFilter, teamFilter])

  const hasActiveFilters = search || statusFilter || priorityFilter || teamFilter

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setPriorityFilter('')
    setTeamFilter('')
  }

  const getTeamName = (teamId) => teams.find(t => t.id === teamId)?.name || 'Unassigned'
  const getUserName = (userId) => members.find(u => u.id === userId)?.name || 'Unassigned'

  if (loading) return <Loader />

  return (
      <div className="max-w-7xl mx-auto pb-12 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tasks Directory</h1>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {filtered.length} of {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
            </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Comprehensive control panel for company-wide tasks and tracking.</p>
          </div>

          <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 shrink-0"
              onClick={() => setModalOpen(true)}
          >
            <Plus size={18} /> Create task
          </button>
        </div>

        {/* Advanced Filter Toolbar & View Switcher */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">

            {/* Search Bar */}
            <div className="relative flex-1 min-w-[240px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  placeholder="Search by title or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                  className="bg-slate-50/70 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              <select
                  className="bg-slate-50/70 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All priorities</option>
                {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>

              <select
                  className="bg-slate-50/70 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
              >
                <option value="">All teams</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>

              {hasActiveFilters && (
                  <button
                      onClick={clearFilters}
                      className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1 border border-rose-100"
                      title="Reset filters"
                  >
                    <X size={15} /> Reset
                  </button>
              )}

              {/* Layout View Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 ml-2">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                        viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                        viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Table View"
                >
                  <Table size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {filtered.length === 0 ? (
            <EmptyState title="No tasks match criteria" description="Try adjusting your search query or filter parameters." />
        ) : viewMode === 'grid' ? (
            /* Grid Layout */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((t) => <TaskCard key={t.id} task={t} basePath="/app/tasks" />)}
            </div>
        ) : (
            /* Table Layout */
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                  <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/75 border-b border-slate-200">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Team</th>
                    <th className="px-6 py-4">Assignee</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4 text-right">Due Date</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                  {filtered.map((t) => {
                    const dateField = t.dueDate || t.deadline || t.targetDate || t.endDate

                    return (
                        <tr
                            key={t.id}
                            onClick={() => window.location.href = `/app/tasks/${t.id}`}
                            className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            <div className="line-clamp-1">{t.title}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                            {getTeamName(t.teamId)}
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                            {getUserName(t.assigneeId)}
                          </td>
                          <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[t.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {t.status}
                        </span>
                          </td>
                          <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${PRIORITY_STYLES[t.priority] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {t.priority}
                        </span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">
                            {dateField ? (typeof dateField === 'string' ? dateField.split('T')[0] : new Date(dateField).toISOString().split('T')[0]) : <span className="text-slate-400 italic">No deadline</span>}
                          </td>
                        </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>
            </div>
        )}

        {/* Task Creation Modal */}
        <TaskFormModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleCreate}
            teams={teams}
            members={members}
        />
      </div>
  )
}