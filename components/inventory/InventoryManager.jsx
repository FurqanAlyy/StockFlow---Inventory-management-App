'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  Loader2,
  Search
} from 'lucide-react'

export default function InventoryManager() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

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

  const stats = useMemo(() => {
    const stockIn = movements.filter(
      movement => movement.type === 'in'
    )

    const stockOut = movements.filter(
      movement => movement.type === 'out'
    )

    const totalIn = stockIn.reduce(
      (total, movement) => total + movement.quantity,
      0
    )

    const totalOut = stockOut.reduce(
      (total, movement) => total + movement.quantity,
      0
    )

    return {
      totalMovements: movements.length,
      stockIn: stockIn.length,
      stockOut: stockOut.length,
      totalUnits: totalIn + totalOut
    }
  }, [movements])

  const filteredMovements = useMemo(() => {
    return movements.filter(movement => {
      const productName =
        movement.product?.name?.toLowerCase() || ''

      const sku =
        movement.product?.sku?.toLowerCase() || ''

      const searchValue = search.toLowerCase()

      const matchesSearch =
        productName.includes(searchValue) ||
        sku.includes(searchValue)

      const matchesFilter =
        filter === 'all' ||
        movement.type === filter

      return matchesSearch && matchesFilter
    })
  }, [movements, search, filter])

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

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <p className="text-sm text-zinc-500">
            Total Movements
          </p>

          <p className="mt-2 text-3xl font-semibold text-white">
            {stats.totalMovements}
          </p>

          <p className="mt-2 text-xs text-zinc-600">
            All inventory activity
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-500">
                Stock In
              </p>

              <p className="mt-2 text-3xl font-semibold text-white">
                {stats.stockIn}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ArrowDownToLine size={20} />
            </div>
          </div>

          <p className="mt-2 text-xs text-zinc-600">
            Incoming movements
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-500">
                Stock Out
              </p>

              <p className="mt-2 text-3xl font-semibold text-white">
                {stats.stockOut}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
              <ArrowUpFromLine size={20} />
            </div>
          </div>

          <p className="mt-2 text-xs text-zinc-600">
            Outgoing movements
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-500">
                Units Moved
              </p>

              <p className="mt-2 text-3xl font-semibold text-white">
                {stats.totalUnits}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <ClipboardList size={20} />
            </div>
          </div>

          <p className="mt-2 text-xs text-zinc-600">
            Total units processed
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-3.5 text-zinc-600"
          />

          <input
            value={search}
            onChange={event =>
              setSearch(event.target.value)
            }
            placeholder="Search by product or SKU..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
          />
        </div>

        <select
          value={filter}
          onChange={event =>
            setFilter(event.target.value)
          }
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-indigo-500"
        >
          <option value="all">
            All Movements
          </option>

          <option value="in">
            Stock In
          </option>

          <option value="out">
            Stock Out
          </option>
        </select>
      </div>

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
      ) : filteredMovements.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 py-16 text-center">
          <Search
            size={30}
            className="mx-auto text-zinc-700"
          />

          <h2 className="mt-4 text-lg font-semibold text-white">
            No matching movements
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Try changing your search or filter.
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
                {filteredMovements.map(movement => {
                  const isStockIn =
                    movement.type === 'in'

                  return (
                    <tr
                      key={movement._id}
                      className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {movement.product?.name ||
                              'Deleted Product'}
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

                          {isStockIn
                            ? 'Stock In'
                            : 'Stock Out'}
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