import { useAuth } from '../../context/AuthContext'
import { formatDate, formatDateTime } from '../../utils/dateUtils'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-slate-900 mb-6">Profile</h1>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-ink-900 text-white flex items-center justify-center text-lg font-semibold">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-400 text-xs uppercase tracking-wide">Role</dt>
            <dd className="text-slate-700 mt-0.5 font-mono">{user.role}</dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs uppercase tracking-wide">Designation</dt>
            <dd className="text-slate-700 mt-0.5">{user.designation || '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs uppercase tracking-wide">Member since</dt>
            <dd className="text-slate-700 mt-0.5">{formatDate(user.createdDate)}</dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs uppercase tracking-wide">Last login</dt>
            <dd className="text-slate-700 mt-0.5">{formatDateTime(user.lastLogin)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
