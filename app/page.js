import {
  Package,
  AlertTriangle,
  Tags,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine
} from 'lucide-react'

import DashboardLayout from '@/components/layout/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'

const recentActivity = [
  {
    product: 'Wireless Keyboard',
    action: 'Stock In',
    quantity: '+20',
    date: 'Today, 10:32 AM',
    type: 'in'
  },
  {
    product: 'Wireless Mouse',
    action: 'Stock Out',
    quantity: '-5',
    date: 'Today, 09:15 AM',
    type: 'out'
  },
  {
    product: '27" Monitor',
    action: 'Stock In',
    quantity: '+10',
    date: 'Yesterday, 04:20 PM',
    type: 'in'
  },
  {
    product: 'USB-C Hub',
    action: 'Stock Out',
    quantity: '-8',
    date: 'Yesterday, 02:45 PM',
    type: 'out'
  }
]

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Products"
              value="248"
              description="12 products added this month"
              icon={Package}
            />

            <StatCard
              title="Low Stock"
              value="12"
              description="Products need your attention"
              icon={AlertTriangle}
            />

            <StatCard
              title="Categories"
              value="18"
              description="Across your inventory"
              icon={Tags}
            />

            <StatCard
              title="Suppliers"
              value="24"
              description="Active suppliers"
              icon={Truck}
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 xl:col-span-2">
            <div className="mb-6">
              <h3 className="font-semibold text-white">Stock Overview</h3>
              <p className="mt-1 text-sm text-zinc-500">
                Inventory movement over the last 7 days
              </p>
            </div>

            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-zinc-800">
              <p className="text-sm text-zinc-600">
                Chart will be added here
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-white">Low Stock</h3>
              <p className="mt-1 text-sm text-zinc-500">
                Products running low
              </p>
            </div>

            <div className="space-y-5">
              {[
                ['Wireless Mouse', '3 units left'],
                ['USB-C Hub', '2 units left'],
                ['Mechanical Keyboard', '4 units left'],
                ['Laptop Stand', '1 unit left']
              ].map(([name, stock]) => (
                <div
                  key={name}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {stock}
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">
                    Low
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 p-6">
            <h3 className="font-semibold text-white">
              Recent Inventory Activity
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Latest stock movements
            </p>
          </div>

          <div className="divide-y divide-zinc-800">
            {recentActivity.map((activity, index) => {
              const isStockIn = activity.type === 'in'

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isStockIn
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {isStockIn ? (
                        <ArrowDownToLine size={18} />
                      ) : (
                        <ArrowUpFromLine size={18} />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {activity.product}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {activity.action} · {activity.date}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      isStockIn
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {activity.quantity}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}