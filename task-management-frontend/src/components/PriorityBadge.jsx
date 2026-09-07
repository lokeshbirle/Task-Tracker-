import { PRIORITY_STYLES } from '../utils/constants'

export default function PriorityBadge({ priority }) {
  return <span className={`tag ${PRIORITY_STYLES[priority] || 'bg-slate-100 text-slate-600'}`}>{priority}</span>
}
