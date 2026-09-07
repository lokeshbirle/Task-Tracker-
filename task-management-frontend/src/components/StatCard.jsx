export default function StatCard({ label, value, accent = false }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-1 text-2xl font-semibold font-mono ${accent ? 'text-amber-600' : 'text-ink-900'}`}>
        {value}
      </p>
    </div>
  )
}
