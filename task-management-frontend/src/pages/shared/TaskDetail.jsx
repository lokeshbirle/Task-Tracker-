// import { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { ArrowLeft, Pencil, Repeat, Trash2 } from 'lucide-react'
// import { tasksApi } from '../../api/tasksApi'
// import { commentsApi } from '../../api/commentsApi'
// import { activityApi } from '../../api/activityApi'
// import { teamsApi } from '../../api/teamsApi'
// import { usersApi } from '../../api/usersApi'
// import StatusBadge from '../../components/StatusBadge'
// import PriorityBadge from '../../components/PriorityBadge'
// import Loader from '../../components/Loader'
// import CommentSection from '../../components/CommentSection'
// import ActivityTimeline from '../../components/ActivityTimeline'
// import StatusUpdateModal from '../../components/StatusUpdateModal'
// import ReassignModal from '../../components/ReassignModal'
// import TaskFormModal from '../../components/TaskFormModal'
// import { useAuth } from '../../context/AuthContext'
// import { formatDate, formatDateTime } from '../../utils/dateUtils'
//
// export default function TaskDetail() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { user, isAdmin } = useAuth()
//
//   const [task, setTask] = useState(null)
//   const [comments, setComments] = useState([])
//   const [activity, setActivity] = useState([])
//   const [teams, setTeams] = useState([])
//   const [members, setMembers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [statusModalOpen, setStatusModalOpen] = useState(false)
//   const [reassignModalOpen, setReassignModalOpen] = useState(false)
//   const [editModalOpen, setEditModalOpen] = useState(false)
//
//   const isOwner = task?.assignedTo === user?.id
//   const canUpdateStatus = isAdmin || isOwner
//
//   const load = async () => {
//     try {
//       const [taskRes, commentsRes, activityRes] = await Promise.all([
//         tasksApi.getById(id),
//         commentsApi.getForTask(id),
//         activityApi.getForTask(id),
//       ])
//       setTask(taskRes.data)
//       setComments(commentsRes.data)
//       setActivity(activityRes.data)
//
//       // Fetch users and teams to resolve names.
//       // Using .catch() so it doesn't crash if an Employee lacks backend permissions.
//       const [teamsRes, usersRes] = await Promise.all([
//         teamsApi.getAll().catch(() => ({ data: [] })),
//         usersApi.getAll().catch(() => ({ data: [] }))
//       ])
//
//       setTeams(teamsRes.data)
//       setMembers(usersRes.data)
//     } catch (error) {
//       console.error("Error loading task details", error)
//     } finally {
//       setLoading(false)
//     }
//   }
//
//   useEffect(() => { load() }, [id])
//
//   if (loading || !task) return <Loader />
//
//   // Build lookup maps for instant ID -> Name translation
//   const userMap = {}
//   members.forEach(m => { userMap[m.id] = m.name })
//
//   const teamMap = {}
//   teams.forEach(t => { teamMap[t.id] = t.name })
//
//   const team = teams.find((t) => t.id === task.teamId)
//   const eligibleMembers = team ? members.filter((m) => team.memberIds?.includes(m.id)) : []
//
//   const handleStatusUpdate = async (status, blockedReason) => {
//     const { data } = await tasksApi.updateStatus(task.id, status, blockedReason)
//     setTask(data)
//     await load()
//   }
//
//   const handleReassign = async (userId) => {
//     const { data } = await tasksApi.reassign(task.id, userId)
//     setTask(data)
//     await load()
//   }
//
//   const handleEdit = async (payload) => {
//     const { data } = await tasksApi.update(task.id, payload)
//     setTask(data)
//   }
//
//   const handleDelete = async () => {
//     if (!confirm('Delete this task? This can be recovered by an administrator later.')) return
//     await tasksApi.remove(task.id)
//     navigate(isAdmin ? '/app/tasks' : '/app/my-tasks')
//   }
//
//   return (
//       <div className="max-w-3xl">
//         <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
//         >
//           <ArrowLeft size={15} /> Back
//         </button>
//
//         <div className="card p-6 mb-6">
//           <div className="flex items-start justify-between gap-4">
//             <div>
//               <h1 className="text-lg font-semibold text-slate-900">{task.title}</h1>
//               <p className="text-xs text-slate-400 font-mono mt-1">#{task.id}</p>
//             </div>
//             {task.overdue && <span className="tag bg-rose-100 text-rose-700 shrink-0">Overdue</span>}
//           </div>
//
//           {task.description && <p className="text-sm text-slate-600 mt-4">{task.description}</p>}
//
//           <div className="flex items-center gap-2 mt-4">
//             <StatusBadge status={task.status} />
//             <PriorityBadge priority={task.priority} />
//           </div>
//
//           {task.status === 'BLOCKED' && task.blockedReason && (
//               <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
//                 <span className="font-medium">Blocked:</span> {task.blockedReason}
//               </div>
//           )}
//
//           <dl className="grid grid-cols-2 gap-4 mt-6 text-sm">
//             <div>
//               <dt className="text-slate-400 text-xs uppercase tracking-wide">Assigned to</dt>
//               {/* Swapped ID for userMap lookup, with fallback to the logged-in user's name if they own the task */}
//               <dd className="text-slate-700 mt-0.5">
//                 {task.assignedTo === user?.id ? user?.name : (userMap[task.assignedTo] || task.assignedTo)}
//               </dd>
//             </div>
//             <div>
//               <dt className="text-slate-400 text-xs uppercase tracking-wide">Team</dt>
//               {/* Swapped ID for teamMap lookup */}
//               <dd className="text-slate-700 mt-0.5">{teamMap[task.teamId] || task.teamId}</dd>
//             </div>
//             <div>
//               <dt className="text-slate-400 text-xs uppercase tracking-wide">Start date</dt>
//               <dd className="text-slate-700 mt-0.5">{formatDate(task.startDate)}</dd>
//             </div>
//             <div>
//               <dt className="text-slate-400 text-xs uppercase tracking-wide">Deadline</dt>
//               <dd className="text-slate-700 mt-0.5">{formatDate(task.deadline)}</dd>
//             </div>
//             {task.completedDate && (
//                 <div>
//                   <dt className="text-slate-400 text-xs uppercase tracking-wide">Completed</dt>
//                   <dd className="text-slate-700 mt-0.5">{formatDateTime(task.completedDate)}</dd>
//                 </div>
//             )}
//           </dl>
//
//           <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100">
//             {canUpdateStatus && (
//                 <button className="btn-primary" onClick={() => setStatusModalOpen(true)}>
//                   Update status
//                 </button>
//             )}
//             {isAdmin && (
//                 <>
//                   <button className="btn-secondary" onClick={() => setEditModalOpen(true)}>
//                     <Pencil size={15} /> Edit
//                   </button>
//                   <button className="btn-secondary" onClick={() => setReassignModalOpen(true)}>
//                     <Repeat size={15} /> Reassign
//                   </button>
//                   <button className="btn-danger ml-auto" onClick={handleDelete}>
//                     <Trash2 size={15} /> Delete
//                   </button>
//                 </>
//             )}
//           </div>
//         </div>
//
//         <div className="grid sm:grid-cols-2 gap-6">
//           <div className="card p-5">
//             <h2 className="text-sm font-semibold text-slate-700 mb-4">Comments</h2>
//             <CommentSection
//                 comments={comments}
//                 currentUserId={user.id}
//                 userMap={userMap}
//                 onAdd={async (text) => {
//                   await commentsApi.add(task.id, text)
//                   const { data } = await commentsApi.getForTask(task.id)
//                   setComments(data)
//                 }}
//             />
//           </div>
//
//           <div className="card p-5">
//             <h2 className="text-sm font-semibold text-slate-700 mb-4">Activity</h2>
//             {/* Passed the map down to translate Activity feed names */}
//             <ActivityTimeline activities={activity} userMap={userMap} />
//           </div>
//         </div>
//
//         <StatusUpdateModal
//             open={statusModalOpen}
//             onClose={() => setStatusModalOpen(false)}
//             onSubmit={handleStatusUpdate}
//             currentStatus={task.status}
//         />
//
//         {isAdmin && (
//             <>
//               <ReassignModal
//                   open={reassignModalOpen}
//                   onClose={() => setReassignModalOpen(false)}
//                   onSubmit={handleReassign}
//                   eligibleMembers={eligibleMembers}
//               />
//               <TaskFormModal
//                   open={editModalOpen}
//                   onClose={() => setEditModalOpen(false)}
//                   onSubmit={handleEdit}
//                   teams={teams}
//                   members={members}
//                   initialTask={task}
//               />
//             </>
//         )}
//       </div>
//   )
// }


import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Repeat, Trash2, Calendar, User as UserIcon, Users, Clock, CheckCircle } from 'lucide-react'
import { tasksApi } from '../../api/tasksApi'
import { commentsApi } from '../../api/commentsApi'
import { activityApi } from '../../api/activityApi'
import { teamsApi } from '../../api/teamsApi'
import { usersApi } from '../../api/usersApi'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import Loader from '../../components/Loader'
import CommentSection from '../../components/CommentSection'
import ActivityTimeline from '../../components/ActivityTimeline'
import StatusUpdateModal from '../../components/StatusUpdateModal'
import ReassignModal from '../../components/ReassignModal'
import TaskFormModal from '../../components/TaskFormModal'
import { useAuth } from '../../context/AuthContext'
import { formatDate, formatDateTime } from '../../utils/dateUtils'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()

  const [task, setTask] = useState(null)
  const [comments, setComments] = useState([])
  const [activity, setActivity] = useState([])
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [reassignModalOpen, setReassignModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const isOwner = task?.assignedTo === user?.id
  const canUpdateStatus = isAdmin || isOwner

  const load = async () => {
    try {
      const [taskRes, commentsRes, activityRes] = await Promise.all([
        tasksApi.getById(id),
        commentsApi.getForTask(id),
        activityApi.getForTask(id),
      ])
      setTask(taskRes.data)
      setComments(commentsRes.data)
      setActivity(activityRes.data)

      const [teamsRes, usersRes] = await Promise.all([
        teamsApi.getAll().catch(() => ({ data: [] })),
        usersApi.getAll().catch(() => ({ data: [] }))
      ])

      setTeams(teamsRes.data)
      setMembers(usersRes.data)
    } catch (error) {
      console.error("Error loading task details", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  if (loading || !task) return <Loader />

  const userMap = {}
  members.forEach(m => { userMap[m.id] = m.name })

  const teamMap = {}
  teams.forEach(t => { teamMap[t.id] = t.name })

  const team = teams.find((t) => t.id === task.teamId)
  const eligibleMembers = team ? members.filter((m) => team.memberIds?.includes(m.id)) : []

  const handleStatusUpdate = async (status, blockedReason) => {
    const { data } = await tasksApi.updateStatus(task.id, status, blockedReason)
    setTask(data)
    await load()
  }

  const handleReassign = async (userId) => {
    const { data } = await tasksApi.reassign(task.id, userId)
    setTask(data)
    await load()
  }

  const handleEdit = async (payload) => {
    const { data } = await tasksApi.update(task.id, payload)
    setTask(data)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this task? This can be recovered by an administrator later.')) return
    await tasksApi.remove(task.id)
    navigate(isAdmin ? '/app/tasks' : '/app/my-tasks')
  }

  return (
      <div className="max-w-5xl mx-auto pb-10">
        {/* Back Button */}
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to list
        </button>

        {/* Main Task Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 flex flex-col">

          {/* Header Section */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{task.title}</h1>
                <p className="text-sm text-slate-400 font-mono mt-1.5 flex items-center gap-2">
                  #{task.id}
                  {task.overdue && (
                      <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider shrink-0">
                    Overdue
                  </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
            </div>

            {task.description && (
                <p className="text-slate-600 leading-relaxed mt-4 max-w-4xl">{task.description}</p>
            )}

            {task.status === 'BLOCKED' && task.blockedReason && (
                <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 flex items-start gap-3">
                  <div className="mt-0.5 text-amber-600">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="font-semibold block mb-0.5">Blocked Reason:</span>
                    {task.blockedReason}
                  </div>
                </div>
            )}
          </div>

          {/* Data Grid Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 bg-slate-50 border-y border-slate-200/60">
            <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <UserIcon size={14} className="text-slate-400" /> Assigned To
            </span>
              <span className="text-sm font-medium text-slate-900">
              {task.assignedTo === user?.id ? user?.name : (userMap[task.assignedTo] || task.assignedTo)}
            </span>
            </div>
            <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Users size={14} className="text-slate-400" /> Team
            </span>
              <span className="text-sm font-medium text-slate-900">{teamMap[task.teamId] || task.teamId}</span>
            </div>
            <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Calendar size={14} className="text-slate-400" /> Start Date
            </span>
              <span className="text-sm font-medium text-slate-900">{formatDate(task.startDate)}</span>
            </div>
            <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Clock size={14} className="text-slate-400" /> Deadline
            </span>
              <span className="text-sm font-medium text-slate-900">{formatDate(task.deadline)}</span>
            </div>
          </div>

          {/* Action Bar (Footer) */}
          <div className="p-4 md:px-8 bg-white rounded-b-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {canUpdateStatus && (
                  <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-2"
                      onClick={() => setStatusModalOpen(true)}
                  >
                    <CheckCircle size={16} /> Update status
                  </button>
              )}
            </div>

            {isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      onClick={() => setEditModalOpen(true)}
                  >
                    <Pencil size={15} className="text-slate-400" /> Edit
                  </button>
                  <button
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      onClick={() => setReassignModalOpen(true)}
                  >
                    <Repeat size={15} className="text-slate-400" /> Reassign
                  </button>
                  <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
                  <button
                      className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ml-auto"
                      onClick={handleDelete}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
            )}
          </div>
        </div>

        {/* Two-Column Layout for Comments & Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 h-fit">
            <h2 className="text-sm font-bold text-slate-900 mb-5 uppercase tracking-wider">Comments</h2>
            <CommentSection
                comments={comments}
                currentUserId={user.id}
                userMap={userMap}
                onAdd={async (text) => {
                  await commentsApi.add(task.id, text)
                  const { data } = await commentsApi.getForTask(task.id)
                  setComments(data)
                }}
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-5 uppercase tracking-wider">Activity History</h2>
            <ActivityTimeline activities={activity} userMap={userMap} currentUser={user} />
          </div>
        </div>

        {/* Modals */}
        <StatusUpdateModal
            open={statusModalOpen}
            onClose={() => setStatusModalOpen(false)}
            onSubmit={handleStatusUpdate}
            currentStatus={task.status}
        />

        {isAdmin && (
            <>
              <ReassignModal
                  open={reassignModalOpen}
                  onClose={() => setReassignModalOpen(false)}
                  onSubmit={handleReassign}
                  eligibleMembers={eligibleMembers}
              />
              <TaskFormModal
                  open={editModalOpen}
                  onClose={() => setEditModalOpen(false)}
                  onSubmit={handleEdit}
                  teams={teams}
                  members={members}
                  initialTask={task}
              />
            </>
        )}
      </div>
  )
}