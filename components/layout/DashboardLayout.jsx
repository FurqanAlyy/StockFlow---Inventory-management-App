import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Header />

        <main className="min-h-[calc(100vh-5rem)] overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}