'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Loader2,
  Truck,
  X,
  Pencil,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

export default function SupplierManager() {
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: ''
  })

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [suppliersResponse, productsResponse] =
        await Promise.all([
          fetch('/api/suppliers'),
          fetch('/api/products')
        ])

      const suppliersData = await suppliersResponse.json()
      const productsData = await productsResponse.json()

      if (!suppliersResponse.ok) {
        throw new Error(
          suppliersData.message || 'Failed to fetch suppliers'
        )
      }

      if (!productsResponse.ok) {
        throw new Error(
          productsData.message || 'Failed to fetch products'
        )
      }

      setSuppliers(suppliersData)
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

  function resetForm() {
    setForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: ''
    })

    setEditingSupplier(null)
    setShowForm(false)
  }

  function openEditForm(supplier) {
    setEditingSupplier(supplier)

    setForm({
      name: supplier.name,
      company: supplier.company,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address || ''
    })

    setError('')
    setShowForm(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setSubmitting(true)
    setError('')

    try {
      const url = editingSupplier
        ? `/api/suppliers/${editingSupplier._id}`
        : '/api/suppliers'

      const method = editingSupplier ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          `Failed to ${editingSupplier ? 'update' : 'create'} supplier`
        )
      }

      resetForm()

      await loadData()
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this supplier?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `/api/suppliers/${id}`,
        {
          method: 'DELETE'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete supplier'
        )
      }

      await loadData()
    } catch (error) {
      setError(error.message)
    }
  }

  function getProductCount(companyName) {
  return products.filter(
    product => product.supplier === companyName
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
            Suppliers
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Manage your inventory suppliers and contacts.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSupplier(null)
            setForm({
              name: '',
              company: '',
              email: '',
              phone: '',
              address: ''
            })
            setError('')
            setShowForm(true)
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {suppliers.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400">
            <Truck size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No suppliers yet
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Add your first supplier to start managing your supply chain.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Add Supplier
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Supplier
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Contact
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Products
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Address
                </th>

                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {suppliers.map(supplier => (
                <tr
                  key={supplier._id}
                  className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400">
                        <Truck size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {supplier.name}
                        </p>

                        <p className="mt-0.5 text-xs text-zinc-500">
                          {supplier.company}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Mail size={13} />
                        {supplier.email}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Phone size={13} />
                        {supplier.phone}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {getProductCount(supplier.company)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex max-w-xs items-center gap-2 text-sm text-zinc-500">
                      <MapPin
                        size={14}
                        className="shrink-0"
                      />
                      <span className="truncate">
                        {supplier.address || 'No address'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() =>
                          openEditForm(supplier)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-indigo-500/10 hover:text-indigo-400"
                        title="Edit supplier"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(supplier._id)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete supplier"
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
                    {editingSupplier
                      ? 'Edit Supplier'
                      : 'Add Supplier'}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    {editingSupplier
                      ? 'Update supplier information.'
                      : 'Add a new supplier to your system.'}
                  </p>
                </div>

                <button
                  onClick={resetForm}
                  className="text-zinc-500 transition hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Contact Name
                    </label>

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Ahmed Khan"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Company
                    </label>

                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      placeholder="e.g. TechWorld"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="supplier@example.com"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+92 300 1234567"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Supplier address..."
                    className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
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

                    {submitting
                      ? editingSupplier
                        ? 'Saving...'
                        : 'Creating...'
                      : editingSupplier
                        ? 'Save Changes'
                        : 'Create Supplier'}
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