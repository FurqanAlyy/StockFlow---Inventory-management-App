'use client'

import { useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, Loader2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StockAdjustment({
  productId,
  currentStock
}) {
  const router = useRouter()

  const [type, setType] = useState(null)
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function openModal(selectedType) {
    setType(selectedType)
    setQuantity('')
    setNote('')
    setError('')
  }

  function closeModal() {
    if (loading) {
      return
    }

    setType(null)
    setQuantity('')
    setNote('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          type,
          quantity: Number(quantity),
          note
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to update stock'
        )
      }

      closeModal()
      router.refresh()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => openModal('in')}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          <ArrowDownToLine size={17} />
          Stock In
        </button>

        <button
          onClick={() => openModal('out')}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-500"
        >
          <ArrowUpFromLine size={17} />
          Stock Out
        </button>
      </div>

      {type && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4">
          <div className="flex min-h-full items-center justify-center">
            <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {type === 'in'
                      ? 'Add Stock'
                      : 'Remove Stock'}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Current stock: {currentStock} units
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="text-zinc-500 transition hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    max={type === 'out' ? currentStock : undefined}
                    value={quantity}
                    onChange={event =>
                      setQuantity(event.target.value)
                    }
                    required
                    autoFocus
                    placeholder="Enter quantity"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
                  />

                  {type === 'out' && (
                    <p className="mt-2 text-xs text-zinc-500">
                      Maximum available: {currentStock}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Note
                  </label>

                  <textarea
                    value={note}
                    onChange={event =>
                      setNote(event.target.value)
                    }
                    rows="3"
                    placeholder={
                      type === 'in'
                        ? 'e.g. New shipment received'
                        : 'e.g. Damaged items'
                    }
                    className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={loading}
                    className="rounded-lg border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      type === 'in'
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-orange-600 hover:bg-orange-500'
                    }`}
                  >
                    {loading && (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    )}

                    {loading
                      ? 'Updating...'
                      : type === 'in'
                        ? 'Add Stock'
                        : 'Remove Stock'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}