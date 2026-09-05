import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Package,
  Pencil,
  Truck,
  Tag,
  CircleDollarSign
} from 'lucide-react'

import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DeleteProductButton from '@/components/products/DeleteProductButton'
import StockAdjustment from '@/components/products/StockAdjustment'
import ProductInventoryHistory from '@/components/products/ProductInventoryHistory'

async function getProduct(id) {
  await connectDB()

  const product = await Product.findById(id).lean()

  if (!product) {
    return null
  }

  return JSON.parse(JSON.stringify(product))
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

export default async function ProductDetailsPage({ params }) {
  const { id } = await params

  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const status = getStockStatus(
    product.stock,
    product.minimumStock
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white">
                {product.name}
              </h1>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
              >
                {status.label}
              </span>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              SKU: {product.sku}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/products/${product._id}/edit`}
              className="flex w-fit items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              <Pencil size={16} />
              Edit Product
            </Link>

            <DeleteProductButton
              productId={product._id.toString()}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 lg:col-span-1">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-zinc-800">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <Package
                  size={80}
                  className="text-zinc-700"
                />
              )}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h2 className="text-lg font-semibold text-white">
                Product Information
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {product.description ||
                  'No description available.'}
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Tag size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      {product.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Truck size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Supplier
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      {product.supplier}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <CircleDollarSign size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Price
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Package size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      SKU
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      {product.sku}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm text-zinc-500">
                    Current Stock
                  </p>

                  <p className="mt-2 text-4xl font-semibold text-white">
                    {product.stock}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Minimum stock level: {product.minimumStock}
                  </p>
                </div>

                <StockAdjustment
                  productId={product._id.toString()}
                  currentStock={product.stock}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 p-6">
            <h2 className="font-semibold text-white">
              Inventory History
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Recent stock movements for this product.
            </p>
          </div>

          <div className="p-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="border-b border-zinc-800 p-6">
    <h2 className="font-semibold text-white">
      Inventory History
    </h2>

    <p className="mt-1 text-sm text-zinc-500">
      Recent stock movements for this product.
    </p>
            </div>

           <div className="p-6">
           <ProductInventoryHistory
              productId={product._id.toString()}
               />
            </div>
           </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}