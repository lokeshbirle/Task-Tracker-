import { useState } from 'react'
import Modal from './Modal'
import ErrorBanner from './ErrorBanner'

export default function ReassignModal({ open, onClose, onSubmit, eligibleMembers }) {
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
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reassign task')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Reassign task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner message={error} />
        <div>
          <label className="label">New assignee</label>
          <select className="input" required value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select a team member…</option>
            {eligibleMembers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">Only members of this task's team are eligible.</p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Reassigning…' : 'Reassign'}</button>
        </div>
      </form>
    </Modal>
  )
}
