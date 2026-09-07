import { useEffect, useState } from 'react'
import Modal from './Modal'
import ErrorBanner from './ErrorBanner'
import { TASK_PRIORITIES } from '../utils/constants'
import { toDateInputValue } from '../utils/dateUtils'

const emptyForm = {
  title: '', description: '', teamId: '', assignedTo: '',
  priority: 'MEDIUM', startDate: '', deadline: '',
}

/**
 * Handles both create and edit. On edit, teamId/assignedTo are fixed (backend has
 * dedicated /assign endpoint for reassignment - not part of the generic update).
 */
export default function TaskFormModal({ open, onClose, onSubmit, teams, members, initialTask }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(initialTask)

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title || '',
        description: initialTask.description || '',
        teamId: initialTask.teamId || '',
        assignedTo: initialTask.assignedTo || '',
        priority: initialTask.priority || 'MEDIUM',
        startDate: toDateInputValue(initialTask.startDate),
        deadline: toDateInputValue(initialTask.deadline),
      })
    } else {
      setForm(emptyForm)
    }
    setError('')
  }, [initialTask, open])

  const eligibleMembers = form.teamId
    ? members.filter((m) => teams.find((t) => t.id === form.teamId)?.memberIds?.includes(m.id))
    : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (new Date(form.deadline) < new Date(form.startDate)) {
      setError('Deadline cannot be earlier than the start date')
      return
    }

    setSaving(true)
    try {
      await onSubmit({
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        deadline: new Date(form.deadline).toISOString(),
      })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the task')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit task' : 'Create task'} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner message={error} />

        <div>
          <label className="label">Title</label>
          <input
            className="input"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Team</label>
            <select
              className="input"
              required
              disabled={isEdit}
              value={form.teamId}
              onChange={(e) => setForm({ ...form, teamId: e.target.value, assignedTo: '' })}
            >
              <option value="">Select team…</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Assign to</label>
            <select
              className="input"
              required
              disabled={isEdit || !form.teamId}
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            >
              <option value="">Select member…</option>
              {eligibleMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Priority</label>
            <select
              className="input"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Start date</label>
            <input
              type="date"
              className="input"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Deadline</label>
            <input
              type="date"
              className="input"
              required
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
