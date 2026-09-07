import { useEffect, useState, useMemo } from 'react'
import { BarChart3, CheckCircle2, Clock, Layers, Users, Filter, Calendar, X } from 'lucide-react'
import { tasksApi } from '../../api/tasksApi'
import { teamsApi } from '../../api/teamsApi'
import Loader from '../../components/Loader'
import { TASK_STATUSES, TASK_PRIORITIES, STATUS_STYLES, PRIORITY_STYLES } from '../../utils/constants'

function Bar({ label, count, max, styleClass }) {
    const pct = max === 0 ? 0 : Math.round((count / max) * 100)

    return (
        <div className="flex items-center gap-4 py-1">
            <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider text-center shrink-0 border ${styleClass || 'bg-slate-100 text-slate-700 border-slate-200'}`} style={{ width: '130px' }}>
                {label}
            </span>

            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>

            <span className="text-sm font-bold font-mono text-slate-700 w-8 text-right">
                {count}
            </span>
        </div>
    )
}

export default function Reports() {
    const [tasks, setTasks] = useState([])
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(true)

    // Filter States
    const [selectedTeamId, setSelectedTeamId] = useState('ALL')
    const [startDate, setStartDate] = useState('') // From Date
    const [endDate, setEndDate] = useState('')     // To Date

    useEffect(() => {
        (async () => {
            try {
                const [tasksRes, teamsRes] = await Promise.all([tasksApi.getAll(), teamsApi.getAll()])
                setTasks(tasksRes.data)

                const activeTeams = (teamsRes.data || []).filter(
                    (team) => team.status !== 'INACTIVE' && team.status !== 'DELETED'
                )
                setTeams(activeTeams)
            } catch (error) {
                console.error("Failed to load report data", error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    // Filter tasks based on selected team and custom date range
    const filteredTasks = useMemo(() => {
        return tasks.filter((t) => {
            // Team Filter
            if (selectedTeamId !== 'ALL' && t.teamId !== selectedTeamId) {
                return false
            }

            // Custom Date Range Filter (From / To)
            if (t.createdDate) {
                const taskDate = new Date(t.createdDate).setHours(0, 0, 0, 0)

                if (startDate) {
                    const start = new Date(startDate).setHours(0, 0, 0, 0)
                    if (taskDate < start) return false
                }

                if (endDate) {
                    const end = new Date(endDate).setHours(23, 59, 59, 999)
                    if (taskDate > end) return false
                }
            }

            return true
        })
    }, [tasks, selectedTeamId, startDate, endDate])

    if (loading) return <Loader />

    const byStatus = TASK_STATUSES.map((s) => ({ label: s, count: filteredTasks.filter((t) => t.status === s).length }))
    const byPriority = TASK_PRIORITIES.map((p) => ({ label: p, count: filteredTasks.filter((t) => t.priority === p).length }))
    const byTeam = teams.map((t) => ({ label: t.name, count: filteredTasks.filter((task) => task.teamId === t.id).length }))

    const maxStatus = Math.max(...byStatus.map((b) => b.count), 1)
    const maxPriority = Math.max(...byPriority.map((b) => b.count), 1)
    const maxTeam = Math.max(...byTeam.map((b) => b.count), 1)

    // Quick stats calculation based on filtered tasks
    const totalTasks = filteredTasks.length
    const completedTasks = filteredTasks.filter((t) => t.status === 'COMPLETED' || t.status === 'DONE').length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const currentSelectedTeam = teams.find(t => t.id === selectedTeamId)

    const clearDates = () => {
        setStartDate('')
        setEndDate('')
    }

    return (
        <div className="max-w-7xl mx-auto pb-10 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Reports & Analytics</h1>
                    <p className="text-sm text-slate-500 mt-1">Detailed performance tracking across custom dates and specific teams.</p>
                </div>

                {/* Custom Filter Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Team Filter Dropdown */}
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                        <Filter size={16} className="text-indigo-500" />
                        <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                        >
                            <option value="ALL">All Teams (Global)</option>
                            {teams.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* From Date Picker */}
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-400 font-medium">From:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                        />
                    </div>

                    {/* To Date Picker */}
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-400 font-medium">To:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                        />
                    </div>

                    {(startDate || endDate) && (
                        <button
                            onClick={clearDates}
                            className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-colors text-xs flex items-center gap-1 font-medium"
                            title="Clear date filter"
                        >
                            <X size={14} /> Clear Dates
                        </button>
                    )}
                </div>
            </div>

            {/* Top Stat Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <Layers size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{totalTasks}</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{completionRate}%</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Users size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Scope</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5 truncate max-w-[220px]">
                            {selectedTeamId === 'ALL' ? 'All Teams' : currentSelectedTeam?.name || 'Team'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Tasks by Status */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <BarChart3 size={18} className="text-indigo-600" /> Tasks by Status
                        </h2>
                        <p className="text-xs text-slate-400 mb-6">Distribution across workflow stages for the selected timeframe.</p>
                    </div>
                    <div className="space-y-4">
                        {byStatus.map((b) => <Bar key={b.label} {...b} max={maxStatus} styleClass={STATUS_STYLES[b.label]} />)}
                    </div>
                </div>

                {/* Tasks by Priority */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <Clock size={18} className="text-indigo-600" /> Tasks by Priority
                        </h2>
                        <p className="text-xs text-slate-400 mb-6">Urgency breakdown for the selected timeframe.</p>
                    </div>
                    <div className="space-y-4">
                        {byPriority.map((b) => <Bar key={b.label} {...b} max={maxPriority} styleClass={PRIORITY_STYLES[b.label]} />)}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Tasks by Team (Global vs Specific Team Focus) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <Users size={18} className="text-indigo-600" />
                            {selectedTeamId === 'ALL' ? 'Tasks by Team Distribution' : `Team Focus: ${currentSelectedTeam?.name}`}
                        </h2>
                        <p className="text-xs text-slate-400">
                            {selectedTeamId === 'ALL'
                                ? 'Workload share across different organizational departments.'
                                : 'Performance breakdown and metrics for this specific department.'}
                        </p>
                    </div>
                </div>

                {selectedTeamId === 'ALL' ? (
                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">
                        {byTeam.map((b) => (
                            <Bar key={b.label} {...b} max={maxTeam} styleClass="bg-indigo-50 text-indigo-700 border-indigo-200" />
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Team Details</p>
                            <p className="text-lg font-bold text-slate-900">{currentSelectedTeam?.name}</p>
                            <p className="text-sm text-slate-600">{currentSelectedTeam?.description || 'No description provided.'}</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-4 rounded-xl shadow-sm shrink-0">
                            <div className="text-right">
                                <p className="text-xs font-semibold text-slate-400 uppercase">Assigned Tasks</p>
                                <p className="text-2xl font-bold text-indigo-600">{totalTasks}</p>
                            </div>
                            <div className="h-8 w-px bg-slate-200" />
                            <div className="text-right">
                                <p className="text-xs font-semibold text-slate-400 uppercase">Completed</p>
                                <p className="text-2xl font-bold text-emerald-600">{completedTasks}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}