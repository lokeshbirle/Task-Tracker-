import { formatDateTime } from '../utils/dateUtils'

export default function ActivityTimeline({ activities, userMap = {}, currentUser }) {
  if (activities.length === 0) {
    return <p className="text-sm text-slate-400">No activity recorded yet.</p>
  }

  // This helper cleans up OLD database records where IDs were saved directly into the description string
  const formatText = (text) => {
    if (!text) return '';
    return text.replace(/\b[a-f0-9]{24}\b/gi, (matchId) => {
      if (currentUser && matchId === currentUser.id) return currentUser.name;
      if (userMap[matchId]) return userMap[matchId];
      return 'User';
    });
  };

  return (
      <ol className="relative border-l border-slate-200 ml-2 space-y-4">
        {activities.map((a) => (
            <li key={a.id} className="ml-4">
              <div className="absolute w-2 h-2 bg-ink-900 rounded-full -left-1 mt-1.5 border border-white" />
              <p className="text-xs text-slate-400 font-mono">{formatDateTime(a.createdDate)}</p>
              <p className="text-sm text-slate-700">
                {/* Notice we are using a.userName here now, which comes directly from the backend */}
                <span className="font-medium">{a.userName || 'System / Admin'}</span> — {formatText(a.description)}
              </p>
            </li>
        ))}
      </ol>
  )
}