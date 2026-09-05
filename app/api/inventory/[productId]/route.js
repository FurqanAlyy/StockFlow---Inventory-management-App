import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import InventoryMovement from '@/models/InventoryMovement'

export async function GET(request, { params }) {
  try {
    const { productId } = await params

    if (!mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const movements = await InventoryMovement.find({
      product: productId
    })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(movements)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch product inventory history' },
      { status: 500 }
    )
  }
}