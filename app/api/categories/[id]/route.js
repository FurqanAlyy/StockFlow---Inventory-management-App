import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid category ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const category = await Category.findByIdAndDelete(id)

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Category deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete category' },
      { status: 500 }
    )
  }
}