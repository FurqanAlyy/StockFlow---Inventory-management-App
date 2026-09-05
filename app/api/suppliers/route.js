import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Supplier from '@/models/Supplier'

export async function GET() {
  try {
    await connectDB()

    const suppliers = await Supplier.find()
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(suppliers)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    const supplier = await Supplier.create({
      name: body.name,
      company: body.company,
      email: body.email,
      phone: body.phone,
      address: body.address || ''
    })

    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error.message || 'Failed to create supplier'
      },
      { status: 400 }
    )
  }
}