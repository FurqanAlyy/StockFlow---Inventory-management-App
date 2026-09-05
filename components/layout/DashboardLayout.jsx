import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}