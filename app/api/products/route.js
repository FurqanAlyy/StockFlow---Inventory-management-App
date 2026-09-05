import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET() {
  try {
    await connectDB()

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    const product = await Product.create(body)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Failed to create product' },
      { status: 400 }
    )
  }
}