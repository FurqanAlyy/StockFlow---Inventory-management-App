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
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import Supplier from '@/models/Supplier'
import InventoryMovement from '@/models/InventoryMovement'

async function getDashboardData() {
  await connectDB()

  const lowStockQuery = {
    $expr: {
      $lte: ['$stock', '$minimumStock']
    }
  }

  const [
    totalProducts,
    lowStockCount,
    lowStockProducts,
    totalCategories,
    totalSuppliers,
    recentMovements
  ] = await Promise.all([
    Product.countDocuments(),

    Product.countDocuments(lowStockQuery),

    Product.find(lowStockQuery)
      .sort({ stock: 1 })
      .limit(5)
      .lean(),

    Category.countDocuments(),

    Supplier.countDocuments(),

    InventoryMovement.find()
      .populate('product', 'name sku')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean()
  ])

  const totalStock = await Product.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum: '$stock'
        }
      }
    }
  ])

  return {
    totalProducts,
    lowStockCount,
    lowStockProducts: JSON.parse(
      JSON.stringify(lowStockProducts)
    ),
    totalCategories,
    totalSuppliers,
    totalStock: totalStock[0]?.total || 0,
    recentMovements: JSON.parse(
      JSON.stringify(recentMovements)
    )
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString()
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Here's what's happening with your inventory today.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Products"
            value={data.totalProducts}
            description="Products in your inventory"
            icon={Package}
          />

          <StatCard
            title="Low Stock"
            value={data.lowStockCount}
            description="Products need attention"
            icon={AlertTriangle}
          />

          <StatCard
            title="Categories"
            value={data.totalCategories}
            description="Product categories"
            icon={Tags}
          />

          <StatCard
            title="Suppliers"
            value={data.totalSuppliers}
            description="Active suppliers"
            icon={Truck}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">
                    Stock Overview
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Current inventory levels.
                  </p>
                </div>

                <Package
                  size={20}
                  className="text-indigo-400"
                />
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    Total Units in Stock
                  </p>

                  <p className="mt-2 text-4xl font-semibold text-white">
                    {data.totalStock.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-400">
                  Current Stock
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full w-full rounded-full bg-indigo-500" />
              </div>

              <p className="mt-3 text-xs text-zinc-600">
                Inventory across all products
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 p-6">
              <h2 className="font-semibold text-white">
                Low Stock Products
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Products that need restocking.
              </p>
            </div>

            <div className="divide-y divide-zinc-800">
              {data.lowStockProducts.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-emerald-400">
                    All products have sufficient stock.
                  </p>
                </div>
              ) : (
                data.lowStockProducts.map(product => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {product.sku}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-amber-400">
                        {product.stock} units
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        Minimum: {product.minimumStock}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 p-6">
            <h2 className="font-semibold text-white">
              Recent Inventory Activity
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Latest stock movements across your inventory.
            </p>
          </div>

          {data.recentMovements.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-zinc-500">
                No inventory activity yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {data.recentMovements.map(movement => {
                const isStockIn =
                  movement.type === 'in'

                return (
                  <div
                    key={movement._id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isStockIn
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-orange-500/10 text-orange-400'
                        }`}
                      >
                        {isStockIn ? (
                          <ArrowDownToLine size={17} />
                        ) : (
                          <ArrowUpFromLine size={17} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {movement.product?.name ||
                            'Deleted Product'}
                        </p>

                        <p className="mt-1 truncate text-xs text-zinc-500">
                          {movement.note || 'No note'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-sm font-semibold ${
                          isStockIn
                            ? 'text-emerald-400'
                            : 'text-orange-400'
                        }`}
                      >
                        {isStockIn ? '+' : '-'}
                        {movement.quantity}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {formatDate(movement.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}