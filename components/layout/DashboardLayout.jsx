'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function openSidebar() {
    setSidebarOpen(true)
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Sidebar
        open={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="min-h-screen lg:ml-64">
        <Header onMenuClick={openSidebar} />

        <main className="min-h-[calc(100vh-5rem)] overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}