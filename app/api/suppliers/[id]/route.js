import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Supplier from '@/models/Supplier'
import Product from '@/models/Product'

export async function PUT(request, { params }) {
  try {
    const { id } = await params

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid supplier ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const body = await request.json()

    const supplier = await Supplier.findById(id)

    if (!supplier) {
      return NextResponse.json(
        { message: 'Supplier not found' },
        { status: 404 }
      )
    }

    const oldName = supplier.company

    supplier.name = body.name
    supplier.company = body.company
    supplier.email = body.email
    supplier.phone = body.phone
    supplier.address = body.address || ''

    await supplier.save()

    if (oldName !== supplier.company) {
      await Product.updateMany(
        { supplier: oldName },
        {
          $set: {
            supplier: supplier.company
          }
        }
      )
    }

    return NextResponse.json(supplier)
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error.message || 'Failed to update supplier'
      },
      { status: 400 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid supplier ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const supplier = await Supplier.findByIdAndDelete(id)

    if (!supplier) {
      return NextResponse.json(
        { message: 'Supplier not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Supplier deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete supplier' },
      { status: 500 }
    )
  }
}