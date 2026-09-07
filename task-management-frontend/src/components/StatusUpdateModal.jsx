import { useState } from 'react'
import Modal from './Modal'
import ErrorBanner from './ErrorBanner'
import { TASK_STATUSES } from '../utils/constants'

export default function StatusUpdateModal({ open, onClose, onSubmit, currentStatus }) {
  const [status, setStatus] = useState(currentStatus)
  const [blockedReason, setBlockedReason] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Mirrors backend rule #8: a blocking reason is required when status -> BLOCKED
    if (status === 'BLOCKED' && !blockedReason.trim()) {
      setError('A reason is required when marking a task as blocked')
      return
    }

    setSaving(true)
    try {
      await onSubmit(status, status === 'BLOCKED' ? blockedReason : undefined)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Update status">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner message={error} />

        <div>
          <label className="label">New status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {status === 'BLOCKED' && (
          <div>
            <label className="label">Reason</label>
            <textarea
              className="input"
              rows={3}
              placeholder='e.g. "Waiting for API credentials from the infrastructure team."'
              value={blockedReason}
              onChange={(e) => setBlockedReason(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Updating…' : 'Update status'}</button>
        </div>
      </form>
    </Modal>
  )
}
