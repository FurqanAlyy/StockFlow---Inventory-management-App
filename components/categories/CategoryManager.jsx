'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Loader2,
  Tags,
  X,
  Pencil
} from 'lucide-react'

export default function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: ''
  })

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [categoriesResponse, productsResponse] =
        await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products')
        ])

      const categoriesData = await categoriesResponse.json()
      const productsData = await productsResponse.json()

      if (!categoriesResponse.ok) {
        throw new Error(
          categoriesData.message || 'Failed to fetch categories'
        )
      }

      if (!productsResponse.ok) {
        throw new Error(
          productsData.message || 'Failed to fetch products'
        )
      }

      setCategories(categoriesData)
      setProducts(productsData)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to create category'
        )
      }

      setForm({
        name: '',
        description: ''
      })

      setShowForm(false)

      await loadData()
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(event) {
  event.preventDefault()

  setSubmitting(true)
  setError('')

  try {
    const response = await fetch(
      `/api/categories/${editingCategory._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to update category'
      )
    }

    setForm({
      name: '',
      description: ''
    })

    setEditingCategory(null)
    setShowForm(false)

    await loadData()
  } catch (error) {
    setError(error.message)
  } finally {
    setSubmitting(false)
  }
}

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this category?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `/api/categories/${id}`,
        {
          method: 'DELETE'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete category'
        )
      }

      await loadData()
    } catch (error) {
      setError(error.message)
    }
  }

  function getProductCount(categoryName) {
    return products.filter(
      product => product.category === categoryName
    ).length
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Categories
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Organize your products into categories.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400">
            <Tags size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No categories yet
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Create your first category to organize your products.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Add Category
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Category
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Products
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Description
                </th>

                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map(category => (
                <tr
                  key={category._id}
                  className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400">
                        <Tags size={17} />
                      </div>

                      <span className="text-sm font-medium text-white">
                        {category.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {getProductCount(category.name)}
                  </td>

                  <td className="max-w-md px-6 py-4 text-sm text-zinc-500">
                    {category.description || 'No description'}
                  </td>

                  <td className="px-6 py-4 text-right">
  <div className="flex justify-end gap-1">
    <button
      onClick={() => {
        setEditingCategory(category)

        setForm({
          name: category.name,
          description: category.description || ''
        })

        setError('')
        setShowForm(true)
      }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-indigo-500/10 hover:text-indigo-400"
      title="Edit category"
    >
      <Pencil size={17} />
    </button>

    <button
      onClick={() =>
        handleDelete(category._id)
      }
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
      title="Delete category"
    >
      <Trash2 size={17} />
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4">
         <div className="flex min-h-full items-center justify-center">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                {editingCategory ? 'Edit Category' : 'Add Category'}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                {editingCategory
                 ? 'Update this category and its products.'
                 : 'Create a new product category.'}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false)
                   setEditingCategory(null)
                   setForm({  name: '',
                    description: ''
                       })
                  }}
                className="text-zinc-500 transition hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={editingCategory ? handleEdit : handleSubmit}
             className="space-y-5 p-6"
             >
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Category Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Electronics"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe this category..."
                  className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCategory(null)
                    setForm({ name: '',
                    description: ''
                     })
                   }}
                  className="rounded-lg border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {submitting && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {submitting ? editingCategory ? 'Saving...' : 'Creating...' : editingCategory ? 'Save Changes': 'Create Category'}
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}
      
    </div>
  )
}