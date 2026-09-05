import { notFound } from 'next/navigation'
import mongoose from 'mongoose'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProductForm from '@/components/products/ProductForm'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

async function getProduct(id) {
  if (!mongoose.isValidObjectId(id)) {
    return null
  }

  await connectDB()

  const product = await Product.findById(id).lean()

  if (!product) {
    return null
  }

  return JSON.parse(JSON.stringify(product))
}

export default async function EditProductPage({ params }) {
  const { id } = await params

  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <DashboardLayout>
      <ProductForm
        initialData={product}
        isEdit
      />
    </DashboardLayout>
  )
}