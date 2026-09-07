import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Users, UsersRound, ListChecks, AlertTriangle,
    Clock, PlayCircle, ShieldAlert, CheckCircle2, Ban, CalendarClock
} from 'lucide-react'
import { dashboardApi } from '../../api/dashboardApi'
import { tasksApi } from '../../api/tasksApi'
import { teamsApi } from '../../api/teamsApi'
import TaskCard from '../../components/TaskCard'
import Loader from '../../components/Loader'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [activeTeamsCount, setActiveTeamsCount] = useState(0)
    const [overdueTasks, setOverdueTasks] = useState([])
    const [upcomingTasks, setUpcomingTasks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const [statsRes, tasksRes, teamsRes] = await Promise.all([
                    dashboardApi.getStats(),
                    tasksApi.getAll(),
                    teamsApi.getAll()
                ])

                setStats(statsRes.data)

                const activeTeams = (teamsRes.data || []).filter(
                    (team) => team.status !== 'INACTIVE' && team.status !== 'DELETED'
                )
                setActiveTeamsCount(activeTeams.length)

                const allTasks = tasksRes.data || []

                // 1. Filter overdue / crossed deadline tasks
                setOverdueTasks(allTasks.filter((t) => t.overdue))

                // 2. Filter tasks approaching their deadline (due within next 3 days)
                const now = new Date().getTime()
                const upcoming = allTasks.filter((t) => {
                    if (t.overdue || t.status === 'COMPLETED' || t.status === 'DONE' || !t.dueDate) return false
                    const dueTime = new Date(t.dueDate).getTime()
                    const diffDays = (dueTime - now) / (1000 * 60 * 60 * 24)
                    return diffDays >= 0 && diffDays <= 3
                })

                setUpcomingTasks(upcoming)
            } catch (error) {
                console.error("Failed to load dashboard data", error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) return <Loader />

    return (
        <div className="max-w-7xl mx-auto pb-10 space-y-10">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Organization-wide overview, timeline alerts, and deadline tracking.</p>
            </div>

            {/* Primary Metrics Grid (All Clickable) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Total Users */}
                <Link
                    to="/app/users"
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-indigo-400 hover:shadow-md transition-all group"
                >
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Total Users</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalUsers || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                        <Users size={22} />
                    </div>
                </Link>

                {/* Total Teams */}
                <Link
                    to="/app/teams"
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all group"
                >
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Total Teams</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{activeTeamsCount}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                        <UsersRound size={22} />
                    </div>
                </Link>

                {/* Total Tasks */}
                <Link
                    to="/app/tasks"
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-violet-400 hover:shadow-md transition-all group"
                >
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-violet-600 transition-colors">Total Tasks</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalTasks || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-105 transition-transform">
                        <ListChecks size={22} />
                    </div>
                </Link>

                {/* Crossed Deadline */}
                <Link
                    to="/app/tasks"
                    className={`border rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all group ${
                        (stats?.overdue || 0) > 0 ? 'bg-rose-50/40 border-rose-200 hover:border-rose-400' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                >
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-rose-600 transition-colors">Crossed Deadline</p>
                        <p className={`text-2xl font-bold mt-1 ${(stats?.overdue || 0) > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                            {stats?.overdue || 0}
                        </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${
                        (stats?.overdue || 0) > 0 ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                        <AlertTriangle size={22} />
                    </div>
                </Link>
            </div>

            {/* Secondary Status Breakdown Grid (All Clickable) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">

                {/* To Do */}
                <Link to="/app/tasks" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-400 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Clock size={15} />
                        <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-slate-700">To Do</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{stats?.todo || 0}</p>
                </Link>

                {/* In Progress */}
                <Link to="/app/tasks" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-2 text-indigo-500 mb-1">
                        <PlayCircle size={15} />
                        <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-indigo-700">In Progress</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{stats?.inProgress || 0}</p>
                </Link>

                {/* Blocked */}
                <Link to="/app/tasks" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-300 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-2 text-amber-500 mb-1">
                        <ShieldAlert size={15} />
                        <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-amber-700">Blocked</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{stats?.blocked || 0}</p>
                </Link>

                {/* Completed */}
                <Link to="/app/tasks" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-2 text-emerald-500 mb-1">
                        <CheckCircle2 size={15} />
                        <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-emerald-700">Completed</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{stats?.completed || 0}</p>
                </Link>

                {/* Cancelled */}
                <Link to="/app/tasks" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1 hover:border-slate-400 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Ban size={15} />
                        <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-slate-700">Cancelled</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{stats?.cancelled || 0}</p>
                </Link>
            </div>

            {/* Section 1: Crossed Deadline (Overdue) Tasks */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-rose-500" /> Crossed Deadline Tasks
                    </h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        overdueTasks.length > 0
                            ? 'text-rose-600 bg-rose-50 border border-rose-100'
                            : 'text-slate-500 bg-slate-100'
                    }`}>
            {overdueTasks.length} {overdueTasks.length === 1 ? 'Task' : 'Tasks'} Overdue
          </span>
                </div>

                {overdueTasks.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {overdueTasks.map((t) => <TaskCard key={t.id} task={t} basePath="/app/tasks" />)}
                    </div>
                )}
            </div>

            {/* Section 2: Reaching / Approaching Deadline Tasks (Due in 3 days) */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <CalendarClock size={18} className="text-amber-500" /> Reaching Deadline Soon (Next 3 Days)
                    </h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        upcomingTasks.length > 0
                            ? 'text-amber-700 bg-amber-50 border border-amber-100'
                            : 'text-slate-500 bg-slate-100'
                    }`}>
            {upcomingTasks.length} {upcomingTasks.length === 1 ? 'Task' : 'Tasks'} Due Soon
          </span>
                </div>

                {upcomingTasks.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {upcomingTasks.map((t) => <TaskCard key={t.id} task={t} basePath="/app/tasks" />)}
                    </div>
                )}
            </div>
        </div>
    )
}