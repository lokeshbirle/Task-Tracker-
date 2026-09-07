export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3 py-2 mb-4">
      {message}
    </div>
  )
}
