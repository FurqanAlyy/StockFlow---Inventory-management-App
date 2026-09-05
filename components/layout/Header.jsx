'use client'

import { Bell, Menu, Search } from 'lucide-react'

export default function Header({ onMenuClick }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:bg-zinc-900 hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Dashboard
          </h2>

        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">

        <div className="flex items-center gap-3 border-l border-zinc-800 pl-2 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            F
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              Furqan
            </p>

            <p className="text-xs text-zinc-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}