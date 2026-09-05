import { Bell, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Here's what's happening with your inventory today.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:bg-zinc-900 hover:text-white">
          <Search size={18} />
        </button>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:bg-zinc-900 hover:text-white">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-zinc-800 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            F
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">Furqan</p>
            <p className="text-xs text-zinc-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}