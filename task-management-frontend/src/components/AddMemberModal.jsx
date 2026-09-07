import { useState } from 'react'
import Modal from './Modal'
import ErrorBanner from './ErrorBanner'

export default function AddMemberModal({ open, onClose, onSubmit, candidates }) {
  const [userId, setUserId] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userId) return
    setError('')
    setSaving(true)
    try {
      await onSubmit(userId)
      setUserId('')
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add member')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add team member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner message={error} />
        <div>
          <label className="label">User</label>
          <select className="input" required value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select a user…</option>
            {candidates.map((u) => (
              <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Adding…' : 'Add member'}</button>
        </div>
      </form>
    </Modal>
  )
}
