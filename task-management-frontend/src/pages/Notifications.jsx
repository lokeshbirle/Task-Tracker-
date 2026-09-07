// import { useEffect, useState } from 'react'
// import { Bell, Check } from 'lucide-react'
// import { notificationsApi } from '../api/notificationsApi'
// import Loader from '../components/Loader'
// import EmptyState from '../components/EmptyState'
// import { formatRelative } from '../utils/dateUtils'
//
// export default function Notifications() {
//   const [notifications, setNotifications] = useState([])
//   const [loading, setLoading] = useState(true)
//
//   const load = async () => {
//     const { data } = await notificationsApi.getMine()
//     setNotifications(data)
//     setLoading(false)
//   }
//
//   useEffect(() => { load() }, [])
//
//   const markRead = async (id) => {
//     await notificationsApi.markRead(id)
//     setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
//   }
//
//   if (loading) return <Loader />
//
//   return (
//     <div>
//       <h1 className="text-xl font-semibold text-slate-900 mb-6">Notifications</h1>
//
//       {notifications.length === 0 ? (
//         <EmptyState title="No notifications" description="You're all caught up." />
//       ) : (
//         <div className="card divide-y divide-slate-100">
//           {notifications.map((n) => (
//             <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${!n.read ? 'bg-indigo-50/40' : ''}`}>
//               <Bell size={16} className={`mt-0.5 shrink-0 ${!n.read ? 'text-indigo-500' : 'text-slate-300'}`} />
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm text-slate-700">{n.message}</p>
//                 <p className="text-xs text-slate-400 font-mono mt-0.5">{formatRelative(n.createdDate)}</p>
//               </div>
//               {!n.read && (
//                 <button
//                   onClick={() => markRead(n.id)}
//                   className="text-xs text-slate-400 hover:text-ink-900 flex items-center gap-1 shrink-0"
//                 >
//                   <Check size={13} /> Mark read
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { Bell, CheckCircle2 } from 'lucide-react'
import { notificationsApi } from '../api/notificationsApi'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { formatRelative } from '../utils/dateUtils'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const { data } = await notificationsApi.getMine()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to load notifications", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    await notificationsApi.markRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  if (loading) return <Loader />

  return (
      <div className="max-w-4xl mx-auto pb-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated on your task assignments and team activity.</p>
        </div>

        {notifications.length === 0 ? (
            <EmptyState title="No notifications" description="You're all caught up." />
        ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              {notifications.map((n) => (
                  <div
                      key={n.id}
                      className={`group relative flex items-start gap-4 p-5 transition-all duration-200 border-b border-slate-100 last:border-0 hover:bg-slate-50 ${
                          !n.read ? 'bg-indigo-50/30' : ''
                      }`}
                  >
                    {/* Icon with Blinking Dot for Unread */}
                    <div className="relative shrink-0 mt-1">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${!n.read ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Bell size={18} />
                      </div>

                      {/* The Blinking/Pulse Effect */}
                      {!n.read && (
                          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-600 border-2 border-white"></span>
                  </span>
                      )}
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <p className={`text-sm leading-relaxed ${!n.read ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-1.5 uppercase tracking-wide">
                        {formatRelative(n.createdDate)}
                      </p>
                    </div>

                    {/* Action Button */}
                    {!n.read && (
                        <button
                            onClick={() => markRead(n.id)}
                            className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 hover:border-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <CheckCircle2 size={14} /> Mark as read
                        </button>
                    )}
                  </div>
              ))}
            </div>
        )}
      </div>
  )
}