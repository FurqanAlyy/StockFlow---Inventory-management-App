const fs = require('fs')
const path = require('path')
const https = require('https')
const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const Product = require('./models/Product').default
const Category = require('./models/Category').default
const Supplier = require('./models/Supplier').default
const InventoryMovement =
  require('./models/InventoryMovement').default

const MONGODB_URI = process.env.MONGODB_URI

const imagesDir = path.join(__dirname, 'images')

const imageUrls = {
  wirelessHeadphones:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  mechanicalKeyboard:
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
  laptop:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
  smartphone:
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
  smartwatch:
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  camera:
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
  backpack:
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  runningShoes:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  coffeeMaker:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  deskLamp:
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename)

    if (fs.existsSync(filePath)) {
      console.log(`Image already exists: ${filename}`)
      resolve(filePath)
      return
    }

    const file = fs.createWriteStream(filePath)

    https
      .get(url, response => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          file.close()
          fs.unlinkSync(filePath)

          downloadImage(
            response.headers.location,
            filename
          )
            .then(resolve)
            .catch(reject)

          return
        }

        if (response.statusCode !== 200) {
          file.close()
          fs.unlinkSync(filePath)

          reject(
            new Error(
              `Failed to download ${filename}: ${response.statusCode}`
            )
          )

          return
        }

        response.pipe(file)

        file.on('finish', () => {
          file.close(() => {
            console.log(`Downloaded: ${filename}`)
            resolve(filePath)
          })
        })
      })
      .on('error', error => {
        file.close()

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }

        reject(error)
      })
  })
}

async function downloadImages() {
  console.log('\nDownloading product images...\n')

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }

  const imagePaths = {}

  for (const [key, url] of Object.entries(imageUrls)) {
    const filename = `${key}.jpg`

    imagePaths[key] = await downloadImage(
      url,
      filename
    )
  }

  console.log('\nAll images downloaded.\n')

  return imagePaths
}

async function seedDatabase(imagePaths) {
  console.log('Connecting to MongoDB...')

  await mongoose.connect(MONGODB_URI)

  console.log('MongoDB connected.\n')

  console.log('Clearing database...')

  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Supplier.deleteMany({}),
    InventoryMovement.deleteMany({})
  ])

  console.log('Database cleared.\n')

  const categories = await Category.insertMany([
    {
      name: 'Electronics',
      description:
        'Electronic devices and technology products'
    },
    {
      name: 'Accessories',
      description:
        'Computer and mobile accessories'
    },
    {
      name: 'Home & Office',
      description:
        'Products for home and office use'
    },
    {
      name: 'Fashion',
      description:
        'Fashion and lifestyle products'
    }
  ])

  console.log(
    `Created ${categories.length} categories`
  )

  const suppliers = await Supplier.insertMany([
    {
      name: 'Ahmed Khan',
      company: 'TechWorld',
      email: 'ahmed@techworld.com',
      phone: '+92 300 1111111',
      address: 'Hall Road, Lahore'
    },
    {
      name: 'Usman Ali',
      company: 'Digital Hub',
      email: 'usman@digitalhub.com',
      phone: '+92 301 2222222',
      address: 'Gulberg, Lahore'
    },
    {
      name: 'Hamza Malik',
      company: 'Office Mart',
      email: 'hamza@officemart.com',
      phone: '+92 302 3333333',
      address: 'Blue Area, Islamabad'
    },
    {
      name: 'Bilal Ahmed',
      company: 'Style Source',
      email: 'bilal@stylesource.com',
      phone: '+92 303 4444444',
      address: 'Saddar, Rawalpindi'
    }
  ])

  console.log(
    `Created ${suppliers.length} suppliers`
  )

  const products = await Product.insertMany([
    {
      name: 'Wireless Headphones',
      sku: 'WH-001',
      description:
        'Premium wireless headphones with active noise cancellation and long battery life.',
      price: 12999,
      stock: 24,
      minimumStock: 8,
      category: 'Electronics',
      supplier: 'TechWorld',
      image: imagePaths.wirelessHeadphones
    },
    {
      name: 'Mechanical Keyboard',
      sku: 'MK-002',
      description:
        'RGB mechanical keyboard with tactile switches and durable construction.',
      price: 8500,
      stock: 18,
      minimumStock: 5,
      category: 'Accessories',
      supplier: 'Digital Hub',
      image: imagePaths.mechanicalKeyboard
    },
    {
      name: 'Laptop',
      sku: 'LP-003',
      description:
        'High-performance laptop suitable for development, business and everyday use.',
      price: 185000,
      stock: 7,
      minimumStock: 10,
      category: 'Electronics',
      supplier: 'TechWorld',
      image: imagePaths.laptop
    },
    {
      name: 'Smartphone',
      sku: 'SP-004',
      description:
        'Modern smartphone with high-resolution display and advanced camera system.',
      price: 89999,
      stock: 32,
      minimumStock: 10,
      category: 'Electronics',
      supplier: 'Digital Hub',
      image: imagePaths.smartphone
    },
    {
      name: 'Smartwatch',
      sku: 'SW-005',
      description:
        'Smartwatch with fitness tracking, notifications and health monitoring features.',
      price: 24999,
      stock: 5,
      minimumStock: 8,
      category: 'Electronics',
      supplier: 'TechWorld',
      image: imagePaths.smartwatch
    },
    {
      name: 'Digital Camera',
      sku: 'DC-006',
      description:
        'Compact digital camera for photography and content creation.',
      price: 125000,
      stock: 9,
      minimumStock: 4,
      category: 'Electronics',
      supplier: 'Digital Hub',
      image: imagePaths.camera
    },
    {
      name: 'Travel Backpack',
      sku: 'BP-007',
      description:
        'Durable everyday backpack with multiple compartments and laptop protection.',
      price: 6500,
      stock: 27,
      minimumStock: 8,
      category: 'Fashion',
      supplier: 'Style Source',
      image: imagePaths.backpack
    },
    {
      name: 'Running Shoes',
      sku: 'RS-008',
      description:
        'Lightweight running shoes designed for comfort and everyday training.',
      price: 9500,
      stock: 14,
      minimumStock: 6,
      category: 'Fashion',
      supplier: 'Style Source',
      image: imagePaths.runningShoes
    },
    {
      name: 'Coffee Maker',
      sku: 'CM-009',
      description:
        'Automatic coffee maker suitable for home and office environments.',
      price: 18500,
      stock: 3,
      minimumStock: 5,
      category: 'Home & Office',
      supplier: 'Office Mart',
      image: imagePaths.coffeeMaker
    },
    {
      name: 'Desk Lamp',
      sku: 'DL-010',
      description:
        'Modern LED desk lamp with adjustable brightness and flexible positioning.',
      price: 4500,
      stock: 21,
      minimumStock: 5,
      category: 'Home & Office',
      supplier: 'Office Mart',
      image: imagePaths.deskLamp
    }
  ])

  console.log(
    `Created ${products.length} products`
  )

  const movements = []

  for (const product of products) {
    const initialStock = product.stock

    movements.push({
      product: product._id,
      type: 'in',
      quantity: initialStock,
      previousStock: 0,
      newStock: initialStock,
      note: 'Initial stock received'
    })
  }

  const laptop = products.find(
    product => product.sku === 'LP-003'
  )

  const smartwatch = products.find(
    product => product.sku === 'SW-005'
  )

  const coffeeMaker = products.find(
    product => product.sku === 'CM-009'
  )

  if (laptop) {
    movements.push({
      product: laptop._id,
      type: 'out',
      quantity: 3,
      previousStock: 10,
      newStock: 7,
      note: 'Customer order'
    })
  }

  if (smartwatch) {
    movements.push({
      product: smartwatch._id,
      type: 'out',
      quantity: 3,
      previousStock: 8,
      newStock: 5,
      note: 'Customer order'
    })
  }

  if (coffeeMaker) {
    movements.push({
      product: coffeeMaker._id,
      type: 'out',
      quantity: 2,
      previousStock: 5,
      newStock: 3,
      note: 'Customer order'
    })
  }

  await InventoryMovement.insertMany(movements)

  console.log(
    `Created ${movements.length} inventory movements`
  )

  console.log('\nSeed completed successfully!')
  console.log(`Products: ${products.length}`)
  console.log(`Categories: ${categories.length}`)
  console.log(`Suppliers: ${suppliers.length}`)
  console.log(`Inventory movements: ${movements.length}`)
}

async function seed() {
  try {
    if (!MONGODB_URI) {
      throw new Error(
        'MONGODB_URI is missing from .env.local'
      )
    }

    const imagePaths = await downloadImages()

    await seedDatabase(imagePaths)
  } catch (error) {
    console.error('\nSeed failed:')
    console.error(error.message)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

seed()