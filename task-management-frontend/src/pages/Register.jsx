import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ErrorBanner from '../components/ErrorBanner'

/**
 * Self-registration always creates an EMPLOYEE account (spec: Admin accounts are
 * provisioned by an existing Admin via the Users screen, not self-service).
 */
export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', designation: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ ...form, role: 'EMPLOYEE' })
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="h-9 w-9 rounded bg-indigo-500 flex items-center justify-center text-white font-mono font-bold">T</div>
          <span className="text-xl font-semibold text-white tracking-tight">TaskFlow</span>
        </div>

        <div className="card p-6">
          <h1 className="text-lg font-semibold text-slate-900 mb-1">Create your account</h1>
          <p className="text-sm text-slate-500 mb-6">Registers as an Employee. Ask your Admin for elevated access.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorBanner message={error} />
            <div>
              <label className="label">Full name</label>
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <p className="text-xs text-slate-400 mt-1">At least 8 characters.</p>
            </div>
            <div>
              <label className="label">Designation (optional)</label>
              <input className="input" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-slate-200 hover:text-white font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
