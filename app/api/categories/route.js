import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'

export async function GET() {
  try {
    await connectDB()

    const categories = await Category.find()
      .sort({ name: 1 })
      .lean()

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    const category = await Category.create({
      name: body.name,
      description: body.description || ''
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error.code === 11000
            ? 'Category already exists'
            : error.message || 'Failed to create category'
      },
      { status: 400 }
    )
  }
}