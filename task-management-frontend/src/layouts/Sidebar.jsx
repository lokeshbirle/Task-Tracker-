// import { NavLink } from 'react-router-dom'
// import {
//   LayoutDashboard, Users, UsersRound, ListChecks, Bell, FileBarChart,
//   Settings, LogOut, ClipboardList, User as UserIcon,
// } from 'lucide-react'
// import { useAuth } from '../context/AuthContext'
//
// const adminLinks = [
//   { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
//   { to: '/app/users', label: 'Users', icon: Users },
//   { to: '/app/teams', label: 'Teams', icon: UsersRound },
//   { to: '/app/tasks', label: 'Tasks', icon: ListChecks },
//   { to: '/app/notifications', label: 'Notifications', icon: Bell },
//   { to: '/app/reports', label: 'Reports', icon: FileBarChart },
// ]
//
// const employeeLinks = [
//   { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
//   { to: '/app/my-tasks', label: 'My Tasks', icon: ClipboardList },
//   { to: '/app/notifications', label: 'Notifications', icon: Bell },
//   { to: '/app/profile', label: 'Profile', icon: UserIcon },
// ]
//
// export default function Sidebar() {
//   const { user, isAdmin, logout } = useAuth()
//   const links = isAdmin ? adminLinks : employeeLinks
//
//   return (
//       <aside className="w-60 shrink-0 bg-zinc-950 text-zinc-300 flex flex-col h-screen sticky top-0 border-r border-zinc-800/80 shadow-xl">
//         {/* Logo Section */}
//         <div className="px-5 py-5 border-b border-zinc-800/80">
//           <div className="flex items-center gap-2.5">
//             <div className="h-8 w-8 rounded-lg bg-indigo-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white font-mono font-bold text-sm">
//               T
//             </div>
//             <span className="font-bold text-white tracking-tight text-lg">TaskFlow</span>
//           </div>
//         </div>
//
//         {/* Navigation Links */}
//         <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
//           <div className="px-3 mb-2">
//             <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Menu</p>
//           </div>
//           {links.map(({ to, label, icon: Icon, end }) => (
//               <NavLink
//                   key={to}
//                   to={to}
//                   end={end}
//                   className={({ isActive }) =>
//                       `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
//                           isActive
//                               ? 'bg-zinc-800 text-white font-medium shadow-sm border border-zinc-700/50'
//                               : 'text-zinc-400 font-medium hover:bg-zinc-900 hover:text-zinc-200'
//                       }`
//                   }
//               >
//                 <Icon size={18} className={({ isActive }) => isActive ? 'text-indigo-400' : 'text-zinc-400'} />
//                 {label}
//               </NavLink>
//           ))}
//         </nav>
//
//         {/* Footer / User Profile */}
//         <div className="px-3 py-4 border-t border-zinc-800/80 bg-zinc-900/30">
//           <div className="px-3 py-2 mb-2 flex flex-col gap-0.5">
//             <p className="text-sm font-semibold text-zinc-200 truncate">{user?.name}</p>
//             <p className="text-xs text-indigo-400/80 font-mono font-medium tracking-wide uppercase">{user?.role}</p>
//           </div>
//           <button
//               onClick={logout}
//               className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       </aside>
//   )
// }


import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UsersRound, ListChecks, Bell, FileBarChart,
  LogOut, ClipboardList, User as UserIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { notificationsApi } from '../api/notificationsApi'

const adminLinks = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/users', label: 'Users', icon: Users },
  { to: '/app/teams', label: 'Teams', icon: UsersRound },
  { to: '/app/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/reports', label: 'Reports', icon: FileBarChart },
]

const employeeLinks = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/my-tasks', label: 'My Tasks', icon: ClipboardList },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/profile', label: 'Profile', icon: UserIcon },
]

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth()
  const links = isAdmin ? adminLinks : employeeLinks
  const [unreadCount, setUnreadCount] = useState(0)

  // Check for unread notifications when the sidebar loads
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await notificationsApi.getMine()
        const unread = data.filter((n) => !n.read).length
        setUnreadCount(unread)
      } catch (error) {
        console.error("Failed to load notifications for sidebar", error)
      }
    }
    fetchUnreadCount()
  }, [])

  return (
      <aside className="w-60 shrink-0 bg-zinc-950 text-zinc-300 flex flex-col h-screen sticky top-0 border-r border-zinc-800/80 shadow-xl">
        {/* Logo Section */}
        <div className="px-5 py-5 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] flex items-center justify-center text-white font-mono font-bold text-sm">
              T
            </div>
            <span className="font-bold text-white tracking-tight text-lg">TaskFlow</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Menu</p>
          </div>

          {links.map(({ to, label, icon: Icon, end }) => {
            // Determine if this specific link is the Notifications tab and if it has unread items
            const isNotifications = label === 'Notifications'
            const hasUnread = isNotifications && unreadCount > 0

            return (
                <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 ease-out ${
                            isActive
                                ? 'bg-zinc-800 text-white font-medium border border-zinc-700/50 shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                                : 'text-zinc-400 font-medium hover:bg-indigo-500/10 hover:text-indigo-200 hover:border-transparent hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                        }`
                    }
                >
                  {({ isActive }) => (
                      <>
                        <div className="relative">
                          <Icon
                              size={18}
                              className={`transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-indigo-300'}`}
                          />

                          {/* The Blinking Notification Dot over the Bell Icon */}
                          {hasUnread && (
                              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-zinc-900"></span>
                      </span>
                          )}
                        </div>

                        <span className="flex-1">{label}</span>

                        {/* Unread Number Badge */}
                        {hasUnread && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {unreadCount}
                    </span>
                        )}
                      </>
                  )}
                </NavLink>
            )
          })}
        </nav>

        {/* Footer / User Profile */}
        <div className="px-3 py-4 border-t border-zinc-800/80 bg-zinc-900/30">
          <div className="px-3 py-2 mb-2 flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-zinc-200 truncate">{user?.name}</p>
            <p className="text-xs text-indigo-400/80 font-mono font-medium tracking-wide uppercase">{user?.role}</p>
          </div>

          {/* Glowing Logout Button */}
          <button
              onClick={logout}
              className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 transition-all duration-300 ease-out hover:bg-rose-500/10 hover:text-rose-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
          >
            <LogOut size={18} className="text-zinc-400 group-hover:text-rose-400 transition-colors duration-300" />
            Logout
          </button>
        </div>
      </aside>
  )
}