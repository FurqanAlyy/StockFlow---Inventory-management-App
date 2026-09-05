'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function ProductForm({
  initialData = null,
  isEdit = false
}) {
  const router = useRouter()

  const [form, setForm] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    stock: initialData?.stock || '',
    minimumStock: initialData?.minimumStock || '5',
    category: initialData?.category || '',
    supplier: initialData?.supplier || '',
    image: initialData?.image || ''
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(
    initialData?.image || ''
  )
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setError('')
    setSelectedFile(file)

    const imageUrl = URL.createObjectURL(file)

    setPreview(imageUrl)
  }

  function removeImage() {
    setSelectedFile(null)
    setPreview('')
    setForm(prev => ({
      ...prev,
      image: ''
    }))
  }

  async function uploadImage() {
    if (!selectedFile) {
      return form.image
    }

    const formData = new FormData()

    formData.append('file', selectedFile)

    setUploading(true)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to upload image'
        )
      }

      return data.url
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const imageUrl = await uploadImage()

      const url = isEdit
        ? `/api/products/${initialData._id}`
        : '/api/products'

      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          image: imageUrl,
          price: Number(form.price),
          stock: Number(form.stock),
          minimumStock: Number(form.minimumStock)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${isEdit ? 'update' : 'create'} product`
        )
      }

      if (isEdit) {
        router.push(`/products/${initialData._id}`)
      } else {
        router.push('/products')
      }

      router.refresh()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <Link
        href={
          isEdit
            ? `/products/${initialData._id}`
            : '/products'
        }
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        {isEdit ? 'Back to Product' : 'Back to Products'}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          {isEdit
            ? 'Update your product information and inventory details.'
            : 'Add a new product to your inventory.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white">
            Basic Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Product Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Mechanical Keyboard"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                SKU
              </label>

              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                placeholder="e.g. KEY-001"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Category
              </label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                placeholder="e.g. Accessories"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your product..."
                className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white">
            Inventory & Pricing
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                required
                placeholder="8500"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Current Stock
              </label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                required
                placeholder="24"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Minimum Stock
              </label>

              <input
                type="number"
                name="minimumStock"
                value={form.minimumStock}
                onChange={handleChange}
                min="0"
                required
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white">
            Supplier & Image
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Supplier
              </label>

              <input
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                required
                placeholder="e.g. TechWorld"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Product Image
              </label>

              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                  <img
                    src={preview}
                    alt="Product preview"
                    className="h-64 w-full object-contain"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={loading}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-black/70 text-white transition hover:bg-red-500 disabled:opacity-50"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950 px-6 py-12 transition hover:border-indigo-500 hover:bg-zinc-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <ImagePlus size={24} />
                  </div>

                  <p className="mt-4 text-sm font-medium text-zinc-300">
                    Click to upload an image
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    PNG, JPG, WEBP up to 5MB
                  </p>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {selectedFile && (
                <p className="mt-2 text-xs text-zinc-500">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href={
              isEdit
                ? `/products/${initialData._id}`
                : '/products'
            }
            className="rounded-lg border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading || uploading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {(loading || uploading) && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {uploading
              ? 'Uploading Image...'
              : loading
                ? isEdit
                  ? 'Saving...'
                  : 'Adding...'
                : isEdit
                  ? 'Save Changes'
                  : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}