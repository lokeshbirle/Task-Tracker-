import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Power, ChevronDown, ChevronUp, Users, ExternalLink } from 'lucide-react'
import { usersApi } from '../../api/usersApi'
import { teamsApi } from '../../api/teamsApi'
import UserFormModal from '../../components/UserFormModal'
import Loader from '../../components/Loader'
import { formatDate, formatRelative } from '../../utils/dateUtils'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  // Track which team ID is currently expanded (null means all are collapsed)
  const [expandedTeamId, setExpandedTeamId] = useState(null)

  const load = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true)
      const [usersRes, teamsRes] = await Promise.all([
        usersApi.getAll(),
        teamsApi.getAll()
      ])
      setUsers(usersRes.data)

      // Filter out inactive or deleted teams
      const activeTeams = (teamsRes.data || []).filter(
          (team) => team.status !== 'INACTIVE' && team.status !== 'DELETED'
      )
      setTeams(activeTeams)
    } catch (error) {
      console.error("Failed to load users or teams", error)
    } finally {
      if (isInitial) setLoading(false)
    }
  }

  useEffect(() => {
    load(true)
    const interval = setInterval(() => load(false), 5000)
    return () => clearInterval(interval)
  }, [])

  const handleCreate = async (payload) => {
    await usersApi.create(payload)
    await load(false)
  }

  const toggleStatus = async (user) => {
    const next = user.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    if (next === 'INACTIVE' && !confirm(`Deactivate ${user.name}? They will lose access immediately.`)) return
    await usersApi.updateStatus(user.id, next)
    await load(false)
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const cleanName = name.trim()
    const parts = cleanName.split(/\s+/)
    if (parts.length >= 2 && parts[1].length > 0) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return cleanName.substring(0, 2).toUpperCase()
  }

  const isAwayLongerThanTwoDays = (lastLoginDate) => {
    if (!lastLoginDate) return true
    const lastLoginTime = new Date(lastLoginDate).getTime()
    const now = new Date().getTime()
    const diffDays = (now - lastLoginTime) / (1000 * 60 * 60 * 24)
    return diffDays > 2
  }

  const toggleExpand = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId)
  }

  if (loading) return <Loader />

  return (
      <div className="max-w-7xl mx-auto pb-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users by Team Directory</h1>
            <p className="text-sm text-slate-500 mt-1">Click the down arrow on any horizontal team row to inspect its members.</p>
          </div>
          <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 shrink-0"
              onClick={() => setModalOpen(true)}
          >
            <UserPlus size={18} /> Add user
          </button>
        </div>

        {/* Horizontal Stack of Team Rows */}
        <div className="space-y-4">
          {teams.map((team) => {
            const isExpanded = expandedTeamId === team.id
            const memberCount = team.memberIds?.length || 0
            const teamUsers = users.filter((u) => team.memberIds?.includes(u.id))

            return (
                <div
                    key={team.id}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
                >
                  {/* Horizontal Team Bar */}
                  <div
                      onClick={() => toggleExpand(team.id)}
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <Users size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{team.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{team.description || 'No description provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
                  </span>

                      {/* Down / Up Arrow Button */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 transition-transform duration-200 ${isExpanded ? 'bg-indigo-50 text-indigo-600' : ''}`}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Expandable User Table Section */}
                  {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50/50 p-4 animate-fadeIn">
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          <table className="w-full text-sm text-left">
                            <thead>
                            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                              <th className="px-6 py-3">Name</th>
                              <th className="px-6 py-3">Email</th>
                              <th className="px-6 py-3">Role</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3">Last Login</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {teamUsers.length === 0 ? (
                                <tr>
                                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                                    No members found in this team.
                                  </td>
                                </tr>
                            ) : (
                                teamUsers.map((u) => {
                                  const awayTooLong = isAwayLongerThanTwoDays(u.lastLogin)

                                  return (
                                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-3.5">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                                              {getInitials(u.name)}
                                            </div>
                                            <div className="font-semibold text-slate-900 flex items-center gap-2 flex-wrap">
                                              <Link
                                                  to={`/app/users/${u.id}/tasks`}
                                                  className="hover:text-indigo-600 hover:underline flex items-center gap-1.5 transition-colors group"
                                              >
                                                {u.name}
                                                <ExternalLink size={12} className="text-slate-400 group-hover:text-indigo-600" />
                                              </Link>

                                              {awayTooLong && u.accountStatus === 'ACTIVE' && (
                                                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                          <span className="flex h-1.5 w-1.5 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                                          </span>
                                          2+ Days
                                        </span>
                                              )}
                                            </div>
                                          </div>
                                        </td>

                                        <td className="px-6 py-3.5 text-slate-500">{u.email}</td>

                                        <td className="px-6 py-3.5">
                                  <span className="font-mono text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                    {u.role}
                                  </span>
                                        </td>

                                        <td className="px-6 py-3.5">
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                      u.accountStatus === 'ACTIVE'
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}>
                                    {u.accountStatus}
                                  </span>
                                        </td>

                                        <td className="px-6 py-3.5 text-slate-500 font-medium text-xs">
                                          {u.lastLogin ? formatRelative(u.lastLogin) : <span className="text-slate-400 italic">Never</span>}
                                        </td>

                                        <td className="px-6 py-3.5 text-right">
                                          <button
                                              onClick={() => toggleStatus(u)}
                                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                                  u.accountStatus === 'ACTIVE'
                                                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                                                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                                              }`}
                                          >
                                            <Power size={12} />
                                            {u.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                          </button>
                                        </td>
                                      </tr>
                                  )
                                })
                            )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                  )}
                </div>
            )
          })}
        </div>

        <UserFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreate} />
      </div>
  )
}