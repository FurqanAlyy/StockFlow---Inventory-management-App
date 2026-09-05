'use client'

import { useEffect, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  Loader2
} from 'lucide-react'

export default function InventoryManager() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadMovements() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/inventory')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch inventory history'
        )
      }

      setMovements(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMovements()
  }, [])

  function formatDate(date) {
    return new Date(date).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2
          size={28}
          className="animate-spin text-indigo-400"
        />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">
          Inventory
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Track all stock movements across your products.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {movements.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400">
            <ClipboardList size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No inventory activity yet
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Stock movements will appear here once you update product inventory.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-800 text-left">
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Stock Change
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Note
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {movements.map(movement => {
                  const isStockIn = movement.type === 'in'

                  return (
                    <tr
                      key={movement._id}
                      className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {movement.product?.name || 'Deleted Product'}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {movement.product?.sku || '—'}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium ${
                            isStockIn
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-orange-500/10 text-orange-400'
                          }`}
                        >
                          {isStockIn ? (
                            <ArrowDownToLine size={14} />
                          ) : (
                            <ArrowUpFromLine size={14} />
                          )}

                          {isStockIn ? 'Stock In' : 'Stock Out'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            isStockIn
                              ? 'text-emerald-400'
                              : 'text-orange-400'
                          }`}
                        >
                          {isStockIn ? '+' : '-'}
                          {movement.quantity}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-zinc-500">
                            {movement.previousStock}
                          </span>

                          <span className="text-zinc-700">
                            →
                          </span>

                          <span className="font-medium text-white">
                            {movement.newStock}
                          </span>
                        </div>
                      </td>

                      <td className="max-w-xs px-6 py-4">
                        <span className="block truncate text-sm text-zinc-400">
                          {movement.note || 'No note'}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                        {formatDate(movement.createdAt)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}