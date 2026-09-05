import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import InventoryMovement from '@/models/InventoryMovement'

export async function GET() {
  try {
    await connectDB()

    const movements = await InventoryMovement.find()
      .populate('product', 'name sku')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(movements)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch inventory history' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    const { productId, type, quantity, note } = body

    if (!productId) {
      return NextResponse.json(
        { message: 'Product is required' },
        { status: 400 }
      )
    }

    if (!['in', 'out'].includes(type)) {
      return NextResponse.json(
        { message: 'Invalid inventory movement type' },
        { status: 400 }
      )
    }

    const parsedQuantity = Number(quantity)

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json(
        { message: 'Quantity must be a positive whole number' },
        { status: 400 }
      )
    }

    const product = await Product.findById(productId)

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    const previousStock = product.stock

    let newStock

    if (type === 'in') {
      newStock = previousStock + parsedQuantity
    } else {
      if (parsedQuantity > previousStock) {
        return NextResponse.json(
          {
            message: `Cannot remove ${parsedQuantity} units. Only ${previousStock} units are available.`
          },
          { status: 400 }
        )
      }

      newStock = previousStock - parsedQuantity
    }

    product.stock = newStock

    await product.save()

    const movement = await InventoryMovement.create({
      product: product._id,
      type,
      quantity: parsedQuantity,
      previousStock,
      newStock,
      note: note || ''
    })

    return NextResponse.json(
      {
        message:
          type === 'in'
            ? 'Stock added successfully'
            : 'Stock removed successfully',
        product,
        movement
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error.message || 'Failed to update inventory'
      },
      { status: 400 }
    )
  }
}