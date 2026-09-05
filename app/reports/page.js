import {
  Package,
  AlertTriangle,
  Boxes,
  TrendingUp,
  CircleCheck,
  CircleAlert
} from 'lucide-react'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'

export const revalidate = 60

async function getReportData() {
  await connectDB()

  const [
    totalProducts,
    lowStockProducts,
    totalCategories
  ] = await Promise.all([
    Product.countDocuments(),

    Product.countDocuments({
      $expr: {
        $lte: ['$stock', '$minimumStock']
      }
    }),

    Category.countDocuments()
  ])

  const stockSummary = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalStock: {
          $sum: '$stock'
        }
      }
    }
  ])

  const outOfStock = await Product.countDocuments({
    stock: 0
  })

  const healthyStock = await Product.countDocuments({
    $expr: {
      $gt: ['$stock', '$minimumStock']
    }
  })

  return {
    totalProducts,
    lowStockProducts,
    totalCategories,
    totalStock: stockSummary[0]?.totalStock || 0,
    outOfStock,
    healthyStock
  }
}

export default async function ReportsPage() {
  const data = await getReportData()

  const stockHealth =
    data.totalProducts === 0
      ? 0
      : Math.round(
          (data.healthyStock / data.totalProducts) * 100
        )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Inventory Reports
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Get a clear overview of your inventory performance and stock health.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Package size={20} />
              </div>

              <TrendingUp
                size={18}
                className="text-zinc-700"
              />
            </div>

            <p className="mt-5 text-sm text-zinc-500">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-semibold text-white">
              {data.totalProducts.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Products currently tracked
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Boxes size={20} />
            </div>

            <p className="mt-5 text-sm text-zinc-500">
              Total Units
            </p>

            <p className="mt-2 text-3xl font-semibold text-white">
              {data.totalStock.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Units currently in stock
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle size={20} />
            </div>

            <p className="mt-5 text-sm text-zinc-500">
              Low Stock
            </p>

            <p className="mt-2 text-3xl font-semibold text-white">
              {data.lowStockProducts.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Products needing attention
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Package size={20} />
            </div>

            <p className="mt-5 text-sm text-zinc-500">
              Categories
            </p>

            <p className="mt-2 text-3xl font-semibold text-white">
              {data.totalCategories.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Product categories
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Inventory Health
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Overall condition of your current inventory.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <CircleCheck size={20} />
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-semibold text-white">
                    {stockHealth}%
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Products with healthy stock
                  </p>
                </div>

                <p className="text-sm text-zinc-500">
                  {data.healthyStock} of {data.totalProducts}
                </p>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${stockHealth}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Stock Attention
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Products that may require immediate action.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <CircleAlert size={20} />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-sm text-zinc-500">
                  Low Stock
                </p>

                <p className="mt-2 text-2xl font-semibold text-amber-400">
                  {data.lowStockProducts}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Below minimum level
                </p>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-sm text-zinc-500">
                  Out of Stock
                </p>

                <p className="mt-2 text-2xl font-semibold text-red-400">
                  {data.outOfStock}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  No units available
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Inventory Summary
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-500">
                Your inventory currently contains{' '}
                <span className="font-medium text-zinc-300">
                  {data.totalProducts}
                </span>{' '}
                products across{' '}
                <span className="font-medium text-zinc-300">
                  {data.totalCategories}
                </span>{' '}
                categories, with{' '}
                <span className="font-medium text-zinc-300">
                  {data.totalStock.toLocaleString()}
                </span>{' '}
                total units available.
                {data.lowStockProducts > 0
                  ? ` ${data.lowStockProducts} ${
                      data.lowStockProducts === 1
                        ? 'product needs'
                        : 'products need'
                    } attention due to low stock.`
                  : ' All products are currently above their minimum stock levels.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}