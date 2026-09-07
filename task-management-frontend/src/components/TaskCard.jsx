// import { Link } from 'react-router-dom'
// import { AlertTriangle } from 'lucide-react'
// import StatusBadge from './StatusBadge'
// import PriorityBadge from './PriorityBadge'
// import { formatDate } from '../utils/dateUtils'
//
// export default function TaskCard({ task, basePath }) {
//   return (
//     <Link
//       to={`${basePath}/${task.id}`}
//       className="card p-4 flex flex-col gap-3 hover:border-ink-900/30 hover:shadow transition"
//     >
//       <div className="flex items-start justify-between gap-2">
//         <h3 className="font-medium text-slate-900 leading-snug">{task.title}</h3>
//         {task.overdue && (
//           <span className="tag bg-rose-100 text-rose-700 shrink-0">
//             <AlertTriangle size={11} /> Overdue
//           </span>
//         )}
//       </div>
//
//       {task.description && (
//         <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>
//       )}
//
//       <div className="flex items-center gap-2 flex-wrap">
//         <StatusBadge status={task.status} />
//         <PriorityBadge priority={task.priority} />
//       </div>
//
//       <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-100">
//         <span>Due {formatDate(task.deadline)}</span>
//         <span>#{task.id.slice(-6)}</span>
//       </div>
//     </Link>
//   )
// }


import { Link } from 'react-router-dom'
import { AlertCircle, Calendar } from 'lucide-react'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import { formatDate } from '../utils/dateUtils'

export default function TaskCard({ task, basePath }) {
  return (
      <Link
          to={`${basePath}/${task.id}`}
          className="group bg-white border border-slate-200 rounded-xl p-5 flex flex-col h-full hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-200 ease-out relative overflow-hidden"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-blue-500 transition-colors duration-300" />

        {/* Title & Overdue Tag */}
        <div className="flex items-start justify-between gap-3 mb-3 mt-1">
          <h3 className="font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {task.title}
          </h3>
          {task.overdue && (
              <span className="flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-100 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">
            <AlertCircle size={12} /> Overdue
          </span>
          )}
        </div>

        {/* Description */}
        {task.description && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
              {task.description}
            </p>
        )}

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Footer (Pinned to bottom using mt-auto) */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
            <span>{task.deadline ? formatDate(task.deadline) : 'No deadline'}</span>
          </div>
          <span className="font-mono text-slate-300 group-hover:text-slate-400 transition-colors">
          #{task.id.slice(-6)}
        </span>
        </div>
      </Link>
  )
}