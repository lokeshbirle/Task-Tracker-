export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-slate-500">
      <div className="h-4 w-4 mr-2 rounded-full border-2 border-slate-300 border-t-ink-900 animate-spin" />
      {label}
    </div>
  )
}
