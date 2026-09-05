import Link from 'next/link'
import { Package, Plus, Search } from 'lucide-react'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import DashboardLayout from '@/components/layout/DashboardLayout'

async function getProducts() {
  await connectDB()

  const products = await Product.find()
    .sort({ createdAt: -1 })
    .lean()

  return JSON.parse(JSON.stringify(products))
}

function getStockStatus(stock, minimumStock) {
  if (stock === 0) {
    return {
      label: 'Out of Stock',
      className: 'bg-red-500/10 text-red-400'
    }
  }

  if (stock <= minimumStock) {
    return {
      label: 'Low Stock',
      className: 'bg-amber-500/10 text-amber-400'
    }
  }

  return {
    label: 'In Stock',
    className: 'bg-emerald-500/10 text-emerald-400'
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Products
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage your inventory products.
            </p>
          </div>

          <Link
            href="/products/new"
            className="flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
          <Search size={18} className="text-zinc-500" />

          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-800 text-left">
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    SKU
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <Package
                        size={40}
                        className="mx-auto text-zinc-700"
                      />

                      <p className="mt-4 text-sm text-zinc-400">
                        No products found
                      </p>

                      <Link
                        href="/products/new"
                        className="mt-3 inline-block text-sm text-indigo-400 hover:text-indigo-300"
                      >
                        Add your first product
                      </Link>
                    </td>
                  </tr>
                ) : (
                  products.map(product => {
                    const status = getStockStatus(
                      product.stock,
                      product.minimumStock
                    )

                    return (
                      <tr
                        key={product._id}
                        className="transition hover:bg-zinc-900"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/products/${product._id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                              <Package
                                size={18}
                                className="text-zinc-500"
                              />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-white">
                                {product.name}
                              </p>

                              <p className="mt-1 max-w-xs truncate text-xs text-zinc-500">
                                {product.description || 'No description'}
                              </p>
                            </div>
                          </Link>
                        </td>

                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {product.sku}
                        </td>

                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {product.category}
                        </td>

                        <td className="px-6 py-4 text-sm text-zinc-300">
                          Rs. {product.price.toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-zinc-200">
                          {product.stock}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}