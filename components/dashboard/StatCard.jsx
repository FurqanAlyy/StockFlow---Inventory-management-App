export default function StatCard({
  title,
  value,
  description,
  icon: Icon
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold text-white">
            {value}
          </h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500">{description}</p>
    </div>
  )
}