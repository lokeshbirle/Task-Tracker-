import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, UserPlus, X, Edit2, ArrowRight, Trash2, Users, ChevronDown, ChevronUp, Shield } from 'lucide-react'
import { teamsApi } from '../../api/teamsApi'
import { usersApi } from '../../api/usersApi'
import TeamFormModal from '../../components/TeamFormModal'
import AddMemberModal from '../../components/AddMemberModal'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'

export default function AdminTeams() {
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [memberModalTeam, setMemberModalTeam] = useState(null)

  // Track which team ID is currently expanded to show members
  const [expandedTeamId, setExpandedTeamId] = useState(null)

  const load = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([teamsApi.getAll(), usersApi.getAll()])

      // Filter out deleted/inactive teams
      const activeTeams = (teamsRes.data || []).filter(
          team => team.status !== 'INACTIVE' && team.status !== 'DELETED'
      )

      setTeams(activeTeams)
      setUsers(usersRes.data)
    } catch (error) {
      console.error("Failed to load teams", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const userName = (id) => users.find((u) => u.id === id)?.name || id

  const getInitials = (name) => {
    if (!name) return '?'
    const cleanName = name.trim()
    const parts = cleanName.split(/\s+/)
    if (parts.length >= 2 && parts[1].length > 0) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return cleanName.substring(0, 2).toUpperCase()
  }

  const handleSaveTeam = async (payload) => {
    if (editingTeam) {
      await teamsApi.update(editingTeam.id, payload)
    } else {
      await teamsApi.create(payload)
    }
    await load()
  }

  const handleDeleteTeam = async (team) => {
    if (!confirm(`Are you sure you want to delete the team "${team.name}"? This action cannot be undone.`)) {
      return
    }
    try {
      await teamsApi.remove(team.id)
      await load()
    } catch (error) {
      console.error("Failed to delete team", error)
      alert("Could not delete the team. Please try again.")
    }
  }

  const handleAddMember = async (userId) => {
    await teamsApi.addMember(memberModalTeam.id, userId)
    await load()
  }

  const handleRemoveMember = async (team, userId) => {
    if (userId === team.teamLeadId) return
    await teamsApi.removeMember(team.id, userId)
    await load()
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teams Directory</h1>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {teams.length} {teams.length === 1 ? 'Team' : 'Teams'}
            </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Manage departments horizontally, expand to view member lists, and track tasks.</p>
          </div>
          <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
              onClick={() => { setEditingTeam(null); setTeamModalOpen(true) }}
          >
            <Plus size={18} /> Create team
          </button>
        </div>

        {teams.length === 0 ? (
            <EmptyState title="No teams created yet" description="Get started by creating your first team department." />
        ) : (
            <div className="space-y-4">
              {teams.map((team) => {
                const leadName = userName(team.teamLeadId)
                const isExpanded = expandedTeamId === team.id
                const memberCount = team.memberIds?.length || 0

                return (
                    <div
                        key={team.id}
                        className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:border-indigo-200"
                    >
                      {/* Horizontal Bar */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 bg-white">

                        {/* Left: Team Name, Description, and Lead */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                            <Users size={22} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900">{team.name}</h3>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                  team.status === 'ACTIVE'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-slate-50 text-slate-600 border-slate-200'
                              }`}>
                          {team.status}
                        </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{team.description || 'No description provided'}</p>

                            <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-600 font-medium">
                        <span className="flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          <Shield size={12} /> Lead: {leadName}
                        </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions and Expand Arrow */}
                        <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
                    </span>

                          <div className="flex items-center gap-1.5">
                            <button
                                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 rounded-lg transition-colors"
                                onClick={() => { setEditingTeam(team); setTeamModalOpen(true) }}
                                title="Edit Team"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 rounded-lg transition-colors"
                                onClick={() => setMemberModalTeam(team)}
                                title="Add Member"
                            >
                              <UserPlus size={16} />
                            </button>
                            <button
                                className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                                onClick={() => handleDeleteTeam(team)}
                                title="Delete Team"
                            >
                              <Trash2 size={16} />
                            </button>

                            <Link
                                to={`/app/teams/${team.id}/tasks`}
                                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                            >
                              Tasks <ArrowRight size={13} />
                            </Link>

                            {/* Expand / Collapse Arrow Button */}
                            <button
                                onClick={() => toggleExpand(team.id)}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                    isExpanded
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                                title={isExpanded ? 'Hide members' : 'View members'}
                            >
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Section: Members Pill List */}
                      {isExpanded && (
                          <div className="border-t border-slate-200 bg-slate-50/70 p-5 animate-fadeIn">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                              Assigned Team Members ({memberCount})
                            </p>

                            {memberCount === 0 ? (
                                <p className="text-xs text-slate-400 italic">No members assigned to this team yet.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                  {team.memberIds.map((mid) => {
                                    const mName = userName(mid)
                                    const isLead = mid === team.teamLeadId

                                    return (
                                        <div
                                            key={mid}
                                            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-full py-1.5 pl-2.5 pr-2 shadow-sm"
                                        >
                              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[9px] font-bold">
                                {getInitials(mName)}
                              </span>
                                          <span>{mName}</span>
                                          {isLead && <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded">Lead</span>}

                                          {!isLead && (
                                              <button
                                                  onClick={() => handleRemoveMember(team, mid)}
                                                  className="text-slate-400 hover:bg-rose-100 hover:text-rose-600 rounded-full p-0.5 transition-colors ml-1"
                                                  title="Remove member"
                                              >
                                                <X size={12} />
                                              </button>
                                          )}
                                        </div>
                                    )
                                  })}
                                </div>
                            )}
                          </div>
                      )}
                    </div>
                )
              })}
            </div>
        )}

        {/* Modals */}
        <TeamFormModal
            open={teamModalOpen}
            onClose={() => setTeamModalOpen(false)}
            onSubmit={handleSaveTeam}
            users={users}
            initialTeam={editingTeam}
        />

        {memberModalTeam && (
            <AddMemberModal
                open={Boolean(memberModalTeam)}
                onClose={() => setMemberModalTeam(null)}
                onSubmit={handleAddMember}
                candidates={users.filter((u) => u.accountStatus === 'ACTIVE' && !memberModalTeam.memberIds.includes(u.id))}
            />
        )}
      </div>
  )
}









// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { Plus, UserPlus, X, Edit2, ArrowRight, Trash2 } from 'lucide-react'
// import { teamsApi } from '../../api/teamsApi'
// import { usersApi } from '../../api/usersApi'
// import TeamFormModal from '../../components/TeamFormModal'
// import AddMemberModal from '../../components/AddMemberModal'
// import Loader from '../../components/Loader'
//
// export default function AdminTeams() {
//   const [teams, setTeams] = useState([])
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [teamModalOpen, setTeamModalOpen] = useState(false)
//   const [editingTeam, setEditingTeam] = useState(null)
//   const [memberModalTeam, setMemberModalTeam] = useState(null)
//
//   const load = async () => {
//     try {
//       const [teamsRes, usersRes] = await Promise.all([teamsApi.getAll(), usersApi.getAll()])
//
//       // Filter out teams that the backend marked as deleted/inactive
//       const activeTeams = teamsRes.data.filter(team => team.status !== 'INACTIVE' && team.status !== 'DELETED')
//
//       setTeams(activeTeams)
//       setUsers(usersRes.data)
//     } catch (error) {
//       console.error("Failed to load teams", error)
//     } finally {
//       setLoading(false)
//     }
//   }
//
//   useEffect(() => { load() }, [])
//
//   const userName = (id) => users.find((u) => u.id === id)?.name || id
//
//   const getInitials = (name) => {
//     if (!name) return '?'
//     const cleanName = name.trim()
//     const parts = cleanName.split(/\s+/)
//     if (parts.length >= 2 && parts[1].length > 0) {
//       return (parts[0][0] + parts[1][0]).toUpperCase()
//     }
//     return cleanName.substring(0, 2).toUpperCase()
//   }
//
//   const handleSaveTeam = async (payload) => {
//     if (editingTeam) {
//       await teamsApi.update(editingTeam.id, payload)
//     } else {
//       await teamsApi.create(payload)
//     }
//     await load()
//   }
//
//   // --- NEW: Handle Team Deletion ---
//   const handleDeleteTeam = async (team) => {
//     if (!confirm(`Are you sure you want to delete the team "${team.name}"? This action cannot be undone.`)) {
//       return
//     }
//     try {
//       await teamsApi.remove(team.id)
//       await load()
//     } catch (error) {
//       console.error("Failed to delete team", error)
//       alert("Could not delete the team. Please try again.")
//     }
//   }
//
//   const handleAddMember = async (userId) => {
//     await teamsApi.addMember(memberModalTeam.id, userId)
//     await load()
//   }
//
//   const handleRemoveMember = async (team, userId) => {
//     if (userId === team.teamLeadId) return
//     await teamsApi.removeMember(team.id, userId)
//     await load()
//   }
//
//   if (loading) return <Loader />
//
//   return (
//       <div className="max-w-7xl mx-auto pb-10">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teams</h1>
//             <p className="text-sm text-slate-500 mt-1">Manage departments, groups, and assigned members.</p>
//           </div>
//           <button
//               className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
//               onClick={() => { setEditingTeam(null); setTeamModalOpen(true) }}
//           >
//             <Plus size={18} /> Create team
//           </button>
//         </div>
//
//         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {teams.map((team) => {
//             const leadName = userName(team.teamLeadId)
//
//             return (
//                 <div key={team.id} className="group bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 flex flex-col h-full">
//                   <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 group-hover:bg-indigo-500 transition-colors duration-300" />
//
//                   <div className="flex items-start justify-between gap-4 mt-1">
//                     <div>
//                       <h3 className="text-lg font-bold text-slate-900 leading-tight">{team.name}</h3>
//                       {team.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{team.description}</p>}
//                     </div>
//                     <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
//                         team.status === 'ACTIVE'
//                             ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
//                             : 'bg-slate-50 text-slate-600 border-slate-200'
//                     }`}>
//                   {team.status}
//                 </span>
//                   </div>
//
//                   <div className="mt-6">
//                     <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2.5">Team Lead</p>
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shadow-sm">
//                         {getInitials(leadName)}
//                       </div>
//                       <p className="text-sm text-slate-900 font-medium">{leadName}</p>
//                     </div>
//                   </div>
//
//                   <div className="mt-6">
//                     <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2.5">
//                       Members ({team.memberIds.length})
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                       {team.memberIds.map((mid) => {
//                         const mName = userName(mid)
//                         const isLead = mid === team.teamLeadId
//
//                         return (
//                             <div key={mid} className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-full py-1 pl-1 pr-2.5 shadow-sm hover:border-slate-300 transition-colors">
//                         <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[9px] font-bold">
//                           {getInitials(mName)}
//                         </span>
//                               <span>{mName}</span>
//                               {!isLead && (
//                                   <button
//                                       onClick={() => handleRemoveMember(team, mid)}
//                                       className="ml-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 rounded-full p-0.5 transition-colors"
//                                       title="Remove member"
//                                   >
//                                     <X size={12} />
//                                   </button>
//                               )}
//                             </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//
//                   {/* Action Footer with Delete Button */}
//                   <div className="flex items-center gap-2 mt-auto pt-6 border-t border-slate-100/80">
//                     <button
//                         className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
//                         onClick={() => { setEditingTeam(team); setTeamModalOpen(true) }}
//                         title="Edit Team"
//                     >
//                       <Edit2 size={16} />
//                     </button>
//                     <button
//                         className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
//                         onClick={() => setMemberModalTeam(team)}
//                         title="Add Member"
//                     >
//                       <UserPlus size={16} />
//                     </button>
//
//                     {/* Delete Team Button */}
//                     <button
//                         className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100"
//                         onClick={() => handleDeleteTeam(team)}
//                         title="Delete Team"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//
//                     <Link
//                         to={`/app/teams/${team.id}/tasks`}
//                         className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 ml-auto bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       View tasks <ArrowRight size={14} />
//                     </Link>
//                   </div>
//                 </div>
//             )
//           })}
//         </div>
//
//         <TeamFormModal
//             open={teamModalOpen}
//             onClose={() => setTeamModalOpen(false)}
//             onSubmit={handleSaveTeam}
//             users={users}
//             initialTeam={editingTeam}
//         />
//
//         {memberModalTeam && (
//             <AddMemberModal
//                 open={Boolean(memberModalTeam)}
//                 onClose={() => setMemberModalTeam(null)}
//                 onSubmit={handleAddMember}
//                 candidates={users.filter((u) => u.accountStatus === 'ACTIVE' && !memberModalTeam.memberIds.includes(u.id))}
//             />
//         )}
//       </div>
//   )
// }