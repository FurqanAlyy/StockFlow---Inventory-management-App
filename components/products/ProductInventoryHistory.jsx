'use client'

import { useEffect, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Loader2,
  Package
} from 'lucide-react'

export default function ProductInventoryHistory({
  productId
}) {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadMovements() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `/api/inventory/${productId}`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to fetch inventory history'
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
  }, [productId])

  function formatDate(date) {
    return new Date(date).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Loader2
          size={24}
          className="animate-spin text-indigo-400"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {error}
      </div>
    )
  }

  if (movements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-800 py-12 text-center">
        <Package
          size={32}
          className="mx-auto text-zinc-700"
        />

        <p className="mt-3 text-sm text-zinc-500">
          No inventory movements recorded yet.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-800 text-left">
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Type
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Quantity
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Stock Change
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Note
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
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
                  <td className="px-5 py-4">
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

                      {isStockIn
                        ? 'Stock In'
                        : 'Stock Out'}
                    </div>
                  </td>

                  <td className="px-5 py-4">
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

                  <td className="px-5 py-4">
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

                  <td className="max-w-xs px-5 py-4">
                    <span className="block truncate text-sm text-zinc-400">
                      {movement.note || 'No note'}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-500">
                    {formatDate(movement.createdAt)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}