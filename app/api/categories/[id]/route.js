import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'
import Product from '@/models/Product'

export async function PUT(request, { params }) {
  try {
    const { id } = await params

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid category ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const body = await request.json()

    const name = body.name?.trim()
    const description = body.description?.trim() || ''

    if (!name) {
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      )
    }

    const category = await Category.findById(id)

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    const oldName = category.name

    const existingCategory = await Category.findOne({
      name,
      _id: { $ne: id }
    })

    if (existingCategory) {
      return NextResponse.json(
        { message: 'Category already exists' },
        { status: 400 }
      )
    }

    category.name = name
    category.description = description

    await category.save()

    if (oldName !== name) {
      await Product.updateMany(
        { category: oldName },
        { $set: { category: name } }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error.message || 'Failed to update category'
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