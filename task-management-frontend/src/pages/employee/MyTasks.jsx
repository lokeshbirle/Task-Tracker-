// import { useEffect, useMemo, useState } from 'react'
// import { Search } from 'lucide-react'
// import { tasksApi } from '../../api/tasksApi'
// import TaskCard from '../../components/TaskCard'
// import Loader from '../../components/Loader'
// import EmptyState from '../../components/EmptyState'
// import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants'
//
// export default function MyTasks() {
//   const [tasks, setTasks] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [statusFilter, setStatusFilter] = useState('')
//   const [priorityFilter, setPriorityFilter] = useState('')
//
//   useEffect(() => {
//     (async () => {
//       const { data } = await tasksApi.getAll() // scoped server-side to the logged-in employee
//       setTasks(data)
//       setLoading(false)
//     })()
//   }, [])
//
//   const filtered = useMemo(() => {
//     return tasks.filter((t) => {
//       if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
//       if (statusFilter && t.status !== statusFilter) return false
//       if (priorityFilter && t.priority !== priorityFilter) return false
//       return true
//     })
//   }, [tasks, search, statusFilter, priorityFilter])
//
//   if (loading) return <Loader />
//
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-xl font-semibold text-slate-900">My Tasks</h1>
//       </div>
//
//       <div className="flex flex-wrap gap-3 mb-6">
//         <div className="relative flex-1 min-w-[200px]">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             className="input pl-9"
//             placeholder="Search by title…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//           <option value="">All statuses</option>
//           {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
//         </select>
//         <select className="input w-auto" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
//           <option value="">All priorities</option>
//           {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
//         </select>
//       </div>
//
//       {filtered.length === 0 ? (
//         <EmptyState title="No tasks match" description="Try adjusting your search or filters." />
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filtered.map((t) => <TaskCard key={t.id} task={t} basePath="/app/my-tasks" />)}
//         </div>
//       )}
//     </div>
//   )
// }


import { useEffect, useMemo, useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { tasksApi } from '../../api/tasksApi'
import TaskCard from '../../components/TaskCard'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants'

export default function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await tasksApi.getAll()
        setTasks(data)
      } catch (error) {
        console.error("Failed to load tasks", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter && t.status !== statusFilter) return false
      if (priorityFilter && t.priority !== priorityFilter) return false
      return true
    })
  }, [tasks, search, statusFilter, priorityFilter])

  if (loading) return <Loader />

  return (
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your assigned work.</p>
        </div>

        {/* Unified Toolbar */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-wrap gap-3 mb-8 items-center shadow-sm">
          <div className="hidden sm:flex items-center gap-2 text-slate-500 px-2 font-medium text-sm">
            <Filter size={16} /> Filters
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
                className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Search by title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
              className="bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
              className="bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All priorities</option>
            {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Grid Content */}
        {filtered.length === 0 ? (
            <EmptyState title="No tasks match" description="Try adjusting your search or filters." />
        ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((t) => <TaskCard key={t.id} task={t} basePath="/app/my-tasks" />)}
            </div>
        )}
      </div>
  )
}