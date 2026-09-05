import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const product = await Product.findById(id).lean()

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const body = await request.json()

    const product = await Product.findByIdAndUpdate(
      id,
      {
        ...body,
        price: Number(body.price),
        stock: Number(body.stock),
        minimumStock: Number(body.minimumStock)
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Failed to update product' },
      { status: 400 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Product deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    )
  }
}