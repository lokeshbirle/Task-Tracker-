import { STATUS_STYLES } from '../utils/constants'

export default function StatusBadge({ status }) {
  return <span className={`tag ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>
}
