import { useState } from 'react'
import { Send } from 'lucide-react'
import { formatDateTime } from '../utils/dateUtils'

export default function CommentSection({ comments, onAdd, currentUserId }) {
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    try {
      await onAdd(text.trim())
      setText('')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {comments.length === 0 && (
          <p className="text-sm text-slate-400">No comments yet.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className={`rounded-lg px-3 py-2 text-sm ${c.userId === currentUserId ? 'bg-indigo-50' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
              <span>{c.userId === currentUserId ? 'You' : c.userId}</span>
              <span>{formatDateTime(c.createdDate)}</span>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap">{c.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="input"
          placeholder="Add a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn-primary px-3" disabled={posting || !text.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
