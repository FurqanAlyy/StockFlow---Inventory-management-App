'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'

export default function DeleteProductButton({ productId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    )

    if (!confirmed) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `/api/products/${productId}`,
        {
          method: 'DELETE'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete product'
        )
      }

      router.push('/products')
      router.refresh()
    } catch (error) {
      window.alert(error.message)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}

      {loading ? 'Deleting...' : 'Delete'}
    </button>
  )
}