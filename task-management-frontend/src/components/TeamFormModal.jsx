import { useEffect, useState } from 'react'
import Modal from './Modal'
import ErrorBanner from './ErrorBanner'

const emptyForm = { name: '', description: '', teamLeadId: '' }

export default function TeamFormModal({ open, onClose, onSubmit, users, initialTeam }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(initialTeam)

  useEffect(() => {
    if (initialTeam) {
      setForm({
        name: initialTeam.name || '',
        description: initialTeam.description || '',
        teamLeadId: initialTeam.teamLeadId || '',
      })
    } else {
      setForm(emptyForm)
    }
    setError('')
  }, [initialTeam, open])

  const activeUsers = users.filter((u) => u.accountStatus === 'ACTIVE')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the team')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit team' : 'Create team'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner message={error} />

        <div>
          <label className="label">Team name</label>
          <input
            className="input"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Team lead</label>
          <select
            className="input"
            required
            value={form.teamLeadId}
            onChange={(e) => setForm({ ...form, teamLeadId: e.target.value })}
          >
            <option value="">Select a lead…</option>
            {activeUsers.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create team'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
