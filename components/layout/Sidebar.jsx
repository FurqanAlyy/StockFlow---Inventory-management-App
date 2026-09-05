'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  ClipboardList,
  Boxes,
  FileBarChart,
  Settings,
  X
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories', href: '/categories', icon: Tags },
  { name: 'Suppliers', href: '/suppliers', icon: Truck },
  { name: 'Inventory', href: '/inventory', icon: ClipboardList },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'About', href: '/about', icon: Boxes }
]

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname()

  return (
    <>
      {open && (
        <button
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 ${
          open
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-zinc-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
              <Boxes size={20} />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-white">
                StockFlow
              </h1>

              <p className="text-xs text-zinc-500">
                Inventory Manager
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 transition hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Management
          </p>

          {navigation.map(item => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active
                    ? 'bg-indigo-600/15 text-indigo-400'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-zinc-800 p-3">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </aside>
    </>
  )
}